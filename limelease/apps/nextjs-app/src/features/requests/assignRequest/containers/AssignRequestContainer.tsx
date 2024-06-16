import { LeftOutlined } from '@ant-design/icons';
import { Heading3 } from '@components/Headings';
import LoadingSpinner from '@components/LoadingSpinner';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { Steps } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useContext } from 'react';
import styled from 'styled-components';

const FindCreateContractor = dynamic(() => import('../components/FindCreateContractor'));
const SelectCompletionDate = dynamic(() => import('../components/SelectCompletionDate'));
const AddContractorMessage = dynamic(() => import('../components/AddContractorMessage'));
const SuccessMessage = dynamic(() => import('../components/SuccessMessage'));

const { Step } = Steps;

const AssignRequestContainer = () => {
  const context = useContext(RequestDetailsContext);
  const currentStep = context?.currentStep ?? 0;

  const stepStatus = useCallback(
    (stepNumber: number) => {
      if (currentStep === stepNumber) {
        return 'wait';
      } else if (currentStep > stepNumber) {
        return 'finish';
      }
    },
    [currentStep]
  );

  const onClickBack = useCallback(() => {
    context?.setStep(context.currentStep - 1);
  }, [context?.currentStep]);

  return (
    <Container {...fadeInOutProps}>
      <Heading3>Create Job</Heading3>
      <AnimatePresence>
        {currentStep > 0 && (
          <BackButton onClick={onClickBack} {...fadeInOutProps}>
            <LeftOutlined />
          </BackButton>
        )}
      </AnimatePresence>

      <StyledSteps current={currentStep} type="navigation">
        <Step status={stepStatus(0)} title="Assign Contractor" />
        <Step status={stepStatus(1)} title="Job Details" />
        <Step status={stepStatus(2)} title="Send Message" />
      </StyledSteps>

      <AnimatePresence mode="wait">
        {currentStep === 0 && <FindCreateContractor key={0} />}
        {currentStep === 1 && <SelectCompletionDate key={1} />}
        {currentStep === 2 && <AddContractorMessage key={2} />}
        {currentStep === 3 && <SuccessMessage key={3} />}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled(motion.div)`
  min-height: 300px;

  > h1 {
    text-align: center;
  }
`;

const StyledSteps = styled(Steps)`
  border-bottom: 1px solid ${Colours.GRAY_5};
  margin-top: 32px;
  margin-bottom: 16px;
`;

const BackButton = styled(motion.div)`
  position: absolute;
  left: 24px;
  top: 45px;
  cursor: pointer;

  svg {
    height: 18px;
    width: 18px;
  }
`;

export default AssignRequestContainer;
