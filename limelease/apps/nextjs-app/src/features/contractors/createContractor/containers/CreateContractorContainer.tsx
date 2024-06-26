import React, { createContext, useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Breadcrumb, Button, Card, Col, Form, Row, Steps } from 'antd';

import { ToolOutlined } from '@ant-design/icons';

import DashboardContainer from '@containers/DashboardContainer';
import { useRouter } from 'next/router';
import { Heading1, Heading3 } from '../../../../components/Headings';
import { Colours } from '../../../../utils/Colours';
import { pxToRem } from '../../../../utils/Helpers';

import { FetchContractorsDocument, useCreateContractorMutation } from '@graphql/generated';
import useHandleFormError from '@hooks/useHandleFormError';
import greenTickIcon from '@public/images/green-tick.svg';
import Image from 'next/image';
import GeneralInformationForm, { CreateContractorFormValues } from '../components/GeneralInformationForm';
import { AnimatePresence, motion } from 'framer-motion';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';

interface ContextProps {
  currentStep: number;
  searchResults: Array<any>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSearchResults: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const errorKeyToFieldName: { [key: string]: string } = {
  contact_number: 'contactNumber',
  contact_email: 'contactEmail',
  website_url: 'websiteUrl',
};

export const CreateContractorContext = createContext<ContextProps | null>(null);

const CreateContractorContainer = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [contractorAdded, showContractorAdded] = useState(false);

  const [createContractor, { loading: isLoading, error: createContractorError, data: createContractorData }] = useCreateContractorMutation();

  useHandleFormError(createContractorError, form, errorKeyToFieldName);

  const onFormComplete = useCallback(
    async (formValues: CreateContractorFormValues) => {
      await createContractor({
        variables: {
          ...formValues,
        },
        refetchQueries: [
          {
            query: FetchContractorsDocument,
            variables: {
              first: 10,
            },
          },
        ],
      });
    },
    [createContractorData]
  );

  useEffect(() => {
    if (createContractorData?.createContractor) {
      showContractorAdded(true);
    }
  }, [createContractorData]);

  const onClickViewContractor = useCallback(() => {
    router.push(`/contractors/${createContractorData?.createContractor.id}`);
  }, [createContractorData]);

  const onClickReturnHome = useCallback(() => {
    router.push('/contractors');
  }, []);

  return (
    <DashboardContainer>
      <Breadcrumb separator="/" style={{ marginTop: '32px' }}>
        <Breadcrumb.Item>
          <ToolOutlined />
          <span>Contractors</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>Add New Contractor</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <StyledCard>
        <AnimatePresence mode="wait">
          {!contractorAdded && (
            <AddContractorContainer key={0} {...fadeInOutProps}>
              <Heading3 style={{ textAlign: 'center' }}>Add New Contractor</Heading3>
              <GeneralInformationForm isLoading={isLoading} form={form} onFormComplete={onFormComplete} onPressCancel={onClickReturnHome} />
            </AddContractorContainer>
          )}

          {contractorAdded && (
            <SuccessContainer key={1} {...fadeInOutProps}>
              <Image src={greenTickIcon} layout="fixed" width={63} height={63} />
              <Heading1 style={{ marginTop: '2rem' }}>You're all done!</Heading1>
              <SuccessTextDescription>
                You can now assign this contractor to a property request and they'll be contacted regarding the details of the job.
              </SuccessTextDescription>

              <Row style={{ marginTop: '2rem' }}>
                <Col span={12} style={{ textAlign: 'left' }}>
                  <Button type="ghost" onClick={onClickReturnHome}>
                    Return to home
                  </Button>
                </Col>

                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={onClickViewContractor}>
                    View Contractor
                  </Button>
                </Col>
              </Row>
            </SuccessContainer>
          )}
        </AnimatePresence>
      </StyledCard>
    </DashboardContainer>
  );
};

const StyledCard = styled(Card)`
  width: 60%;
  margin: ${pxToRem(32)} auto;
`;

const AddContractorContainer = styled(motion.div)`
  h1 {
    padding-bottom: 16px;
  }
`;

const SuccessContainer = styled(motion.div)`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`;

const SuccessTextDescription = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${Colours.GRAY_7};
`;

export default CreateContractorContainer;
