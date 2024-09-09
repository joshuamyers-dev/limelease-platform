import React, { useCallback, useContext, useEffect } from 'react';
import { Form, Button, Divider, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInOutProps } from '@utils/AnimationsProps';
import styled from 'styled-components';
import GeneralInformationForm, { CreateContractorFormValues } from '@features/contractors/createContractor/components/GeneralInformationForm';
import { useCreateContractorMutation } from '@graphql/generated';
import useHandleFormError from '@hooks/useHandleFormError';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { CardTitleText, Heading3 } from '@components/Headings';

interface CreateContractorStepProps {
  isCreatingContractor: boolean;
  setCreatingContractor: (value: boolean) => void;
  onContractorCreated: () => void;
}

const errorKeyToFieldName: { [key: string]: string } = {
  contact_number: 'contactNumber',
  contact_email: 'contactEmail',
  website_url: 'websiteUrl',
};

const CreateContractorStep: React.FC<CreateContractorStepProps> = ({ isCreatingContractor, setCreatingContractor, onContractorCreated }) => {
  const context = useContext(RequestDetailsContext);
  const [form] = Form.useForm();

  const [createContractorMutation, { loading, data: createContractorData, error: createContractorError }] = useCreateContractorMutation();

  useHandleFormError(createContractorError, form, errorKeyToFieldName);

  const onFormComplete = useCallback(async (values: CreateContractorFormValues) => {
    await createContractorMutation({
      variables: {
        businessName: values.businessName,
        contactNumber: values.contactNumber,
        contactEmail: values.contactEmail,
        websiteUrl: values.websiteUrl,
        areasServed: values.areasServed,
      },
    });
  }, []);

  useEffect(() => {
    if (createContractorData?.createContractor) {
      message.success('The contractor has been added successfully.');
      context?.setSelectedContractor(createContractorData?.createContractor);
      onContractorCreated();
    }
  }, [createContractorData]);

  return (
    <AnimatePresence>
      {isCreatingContractor && (
        <CreateContractorWrapper {...fadeInOutProps}>
          <GeneralInformationForm form={form} isLoading={loading} onFormComplete={onFormComplete} onPressCancel={() => setCreatingContractor(false)} />
        </CreateContractorWrapper>
      )}
    </AnimatePresence>
  );
};

const CreateContractorWrapper = styled(motion.div)`
  padding-bottom: 25px;
`;

export default CreateContractorStep;