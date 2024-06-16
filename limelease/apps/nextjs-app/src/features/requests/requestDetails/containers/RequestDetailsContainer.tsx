import { ProfileOutlined } from '@ant-design/icons';
import LoadingSpinner from '@components/LoadingSpinner';
import DashboardContainer from '@containers/DashboardContainer';
import {
  Contractor,
  FetchActiveJobForRequestDocument,
  FetchRequestCommentsDocument,
  FetchRequestDocument,
  Maybe,
  PropertyRequest,
  useAssignRequestToContractorMutation,
  useFetchRequestByTicketNumberQuery,
  useMeQuery,
} from '@graphql/generated';
import useWindowDimensions from '@hooks/useWindowDimensions';
import { Breadcrumb, Modal, message } from 'antd';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, createContext, useCallback, useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

// Split Client Components
const AssignRequestContainer = dynamic(() => import('@features/requests/assignRequest/containers/AssignRequestContainer'));
const RequestDetails = dynamic(() => import('../components/RequestDetails'));

interface RequestDetailsContainerProps {
  ticketNumber: Maybe<string>;
}

interface RequestDetailsContextProps {
  assignRequestVisible: boolean;
  setAssignRequestVisible: (visible: boolean) => void;
  selectedContractor: Maybe<Contractor> | undefined;
  setSelectedContractor: Dispatch<SetStateAction<Contractor | undefined>>;
  currentStep: number;
  setStep: Dispatch<SetStateAction<number>>;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  setStartDate: Dispatch<SetStateAction<Dayjs | null>>;
  setEndDate: Dispatch<SetStateAction<Dayjs | null>>;
  contractorMessage: string | null;
  setContractorMessage: Dispatch<SetStateAction<string | null>>;
  ticketNumber: Maybe<string>;
  request: Maybe<PropertyRequest> | undefined;
  userIsGuest: boolean;
  setPollComments: Dispatch<SetStateAction<boolean>>;
  shouldPollComments: boolean;
}

export const RequestDetailsContext = createContext<RequestDetailsContextProps | null>(null);

const RequestDetailsContainer: React.FC<RequestDetailsContainerProps> = ({ ticketNumber }) => {
  const router = useRouter();

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor>();
  const [currentStep, setStep] = useState(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [description, setDescription] = useState('');
  const [contractorMessage, setContractorMessage] = useState<string | null>(null);

  const { width: screenWidth } = useWindowDimensions();

  const { loading, data: requestData } = useFetchRequestByTicketNumberQuery({
    variables: {
      ticketNumber,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [assignRequestMutation, { loading: assignRequestLoading, error: assignRequestError, data: contractorJobData }] = useAssignRequestToContractorMutation();

  const { data: userData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const request = requestData?.fetchRequestByTicketNumber;

  const onCloseModal = useCallback(() => {
    setAssignModalVisible(false);
  }, []);

  const isContinueDisabled = useMemo(() => {
    if (currentStep === 0 && !selectedContractor) {
      return true;
    } else if (currentStep === 1 && !startDate && !endDate && !description) {
      return true;
    } else if (currentStep === 2 && !contractorMessage) {
      return true;
    } else {
      return false;
    }
  }, [currentStep, selectedContractor, startDate, endDate, description, contractorMessage]);

  const onPressSaveAndNext = useCallback(async () => {
    if (currentStep === 1) {
      if (startDate?.isBefore(endDate, 'seconds')) {
        setStep((prevStep) => prevStep + 1);
      } else {
        message.error("The booking's end date must be after the start date.");
      }
    } else if (currentStep === 2) {
      if (!selectedContractor || !startDate || !endDate || !contractorMessage || !request?.id) {
        return;
      }

      await assignRequestMutation({
        variables: {
          contractorId: selectedContractor.id,
          requestId: request.id,
          bookingDateStart: startDate.toISOString(),
          bookingDateEnd: endDate.toISOString(),
          description,
          contractorMessage,
        },
        refetchQueries: [
          {
            query: FetchRequestDocument,
            variables: {
              id: request.id,
            },
          },
          {
            query: FetchActiveJobForRequestDocument,
            variables: {
              requestId: request.id,
            },
          },
          {
            query: FetchRequestCommentsDocument,
            variables: {
              requestId: request.id,
              first: 10,
            },
          },
        ],
      });
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  }, [currentStep, contractorMessage, startDate, endDate, description, selectedContractor, request]);

  const userIsGuest = useMemo(() => {
    return userData?.me === null ? true : false;
  }, [userData]);

  useEffect(() => {
    if (contractorJobData?.contractorJobCreate) {
      setStep((prevStep) => prevStep + 1);
    }
  }, [contractorJobData]);

  return (
    <DashboardContainer>
      <RequestDetailsContext.Provider
        value={{
          assignRequestVisible: assignModalVisible,
          setAssignRequestVisible: setAssignModalVisible,
          setSelectedContractor,
          selectedContractor,
          currentStep,
          setStep,
          startDate,
          endDate,
          setStartDate,
          setEndDate,
          description,
          setDescription,
          contractorMessage,
          setContractorMessage,
          ticketNumber,
          request,
          userIsGuest,
        }}
      >
        {screenWidth && (
          <Modal
            destroyOnClose
            open={assignModalVisible}
            width={screenWidth * 0.6}
            okText={currentStep === 2 ? 'Assign Request' : 'Save & Next'}
            confirmLoading={assignRequestLoading}
            onOk={onPressSaveAndNext}
            footer={currentStep === 3 ? null : undefined}
            okButtonProps={{ disabled: isContinueDisabled }}
            onCancel={() => {
              onCloseModal();
              setStep(0);
              setSelectedContractor(undefined);
              setStartDate(null);
              setEndDate(null);
              setDescription('');
            }}
          >
            {assignModalVisible && <AssignRequestContainer />}
          </Modal>
        )}

        {loading && <LoadingSpinner />}
        {!loading && (
          <>
            {!userIsGuest && (
              <Breadcrumb separator="/" style={{ marginTop: '32px' }}>
                <Breadcrumb.Item onClick={() => router.back()}>
                  <ProfileOutlined />
                  <span>Requests</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="" onClick={(e) => router.forward()}>
                  <span>{request?.title}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            )}

            <RequestDetails request={request} />
          </>
        )}
      </RequestDetailsContext.Provider>
    </DashboardContainer>
  );
};

export default RequestDetailsContainer;
