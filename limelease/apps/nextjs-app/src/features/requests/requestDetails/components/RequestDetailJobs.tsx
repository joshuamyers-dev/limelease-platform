import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  FetchActiveJobForRequestDocument,
  FetchRequestCommentsDocument,
  FetchRequestDocument,
  useDeleteContractorJobMutation,
  useFetchActiveJobForRequestQuery,
} from '@graphql/generated';
import { Colours } from '@utils/Colours';
import { DEVICE_TIMEZONE } from '@utils/Constants';
import { dayjs } from '@utils/DayjsTimezone';
import { Button, Modal, message } from 'antd';
import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { RequestDetailsContext } from '../containers/RequestDetailsContainer';

const { confirm } = Modal;

interface RequestDetailJobsProps {
  requestId: string;
}

const RequestDetailJobs: React.FC<RequestDetailJobsProps> = ({ requestId }) => {
  const context = useContext(RequestDetailsContext);

  const { data: jobData, loading: fetchingJob } = useFetchActiveJobForRequestQuery({
    variables: {
      requestId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteJobMutation, { loading: deletingJob, error: deleteJobError }] = useDeleteContractorJobMutation();

  const startDate = useMemo(() => {
    return dayjs(jobData?.contractorJobActive?.bookingDateStart)
      .tz(DEVICE_TIMEZONE)
      .format('DD/MM/YYYY - hh:mma');
  }, [jobData]);

  const endDate = useMemo(() => {
    const start = dayjs(jobData?.contractorJobActive?.bookingDateStart).tz(DEVICE_TIMEZONE);
    const end = dayjs(jobData?.contractorJobActive?.bookingDateEnd).tz(DEVICE_TIMEZONE);

    if (start.isSame(end, 'day')) {
      return end.format('hh:mma');
    } else {
      return end.format('DD/MM/YYYY - hh:mma');
    }
  }, [jobData]);

  const onClickAddJob = useCallback(() => {
    if (jobData?.contractorJobActive) {
      confirm({
        title: 'Are you sure you want to add a new job?',
        content: 'There is already an active job assigned to a contractor for this request. The contractor will be notified about this change.',
        okText: 'Continue',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk: async () => {
          context?.setAssignRequestVisible(true);
        },
      });
    } else {
      context?.setAssignRequestVisible(true);
    }
  }, [jobData]);

  const onClickDeleteJob = useCallback(async () => {
    confirm({
      title: 'Are you sure you want to delete this job?',
      content: 'This action cannot be undone. The contractor will be notified about this change.',
      okText: 'Continue',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        if (!jobData?.contractorJobActive) return;

        await deleteJobMutation({
          variables: {
            id: jobData.contractorJobActive.id,
          },
          refetchQueries: [
            {
              query: FetchRequestDocument,
              variables: {
                id: requestId,
              },
            },
            {
              query: FetchActiveJobForRequestDocument,
              variables: {
                requestId,
              },
            },
            {
              query: FetchRequestCommentsDocument,
              variables: {
                requestId,
                first: 10,
              },
            },
          ],
          awaitRefetchQueries: true,
        });

        message.success('This job has been deleted.');
      },
    });
  }, [jobData?.contractorJobActive, requestId]);

  return (
    <Container>
      <ContainerHeader>
        <ContainerTitle>Active Job</ContainerTitle>
        <AddCommentButton>
          <Button type="default" icon={<PlusOutlined />} onClick={onClickAddJob}>
            Create Job
          </Button>
        </AddCommentButton>
      </ContainerHeader>

      {jobData?.contractorJobActive && (
        <JobContainer>
          <DeleteContainer>
            <Button type="link" danger icon={<DeleteOutlined />} onClick={onClickDeleteJob}>
              Delete Job
            </Button>
          </DeleteContainer>
          <RequestDetailRow>
            <RequestDetailTitle>Description</RequestDetailTitle>
            <RequestDetailDescription>{jobData?.contractorJobActive?.description}</RequestDetailDescription>
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailTitle>Contractor</RequestDetailTitle>
            <RequestDetailDescription>{jobData?.contractorJobActive?.contractor?.businessName}</RequestDetailDescription>
          </RequestDetailRow>
          <RequestDetailRow>
            <RequestDetailTitle>Booked for</RequestDetailTitle>
            <RequestDetailDescription>
              {startDate} - {endDate}
            </RequestDetailDescription>
          </RequestDetailRow>
        </JobContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 40px;
`;

const ContainerTitle = styled.div`
  color: #262626;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 16px;
  flex: 1;
`;

const JobContainer = styled.div`
  background: ${Colours.GRAY_2};
  padding: 16px;
  border-radius: 8px;
  position: relative;
`;

const ContainerHeader = styled.div`
  display: flex;
`;

const DeleteContainer = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`;

const AddCommentButton = styled.div``;

const RequestDetailRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const RequestDetailTitle = styled.div`
  color: ${Colours.GRAY_7};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  min-width: 120px;
  margin-right: 16px;
`;

const RequestDetailDescription = styled.div`
  color: ${Colours.GRAY_10};
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  width: 100%;
`;

export default RequestDetailJobs;
