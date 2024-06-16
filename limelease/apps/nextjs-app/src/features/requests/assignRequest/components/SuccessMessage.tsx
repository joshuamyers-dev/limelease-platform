import { Heading1 } from '@components/Headings';
import Image from 'next/image';
import styled from 'styled-components';
import greenTickIcon from '@public/images/green-tick.svg';
import { Colours } from '@utils/Colours';
import { motion } from 'framer-motion';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { useContext } from 'react';
import { RequestDetailsContext } from '@features/requests/requestDetails/containers/RequestDetailsContainer';

const SuccessMessage = () => {
  const context = useContext(RequestDetailsContext);

  return (
    <SuccessContainer {...fadeInOutProps}>
      <Image src={greenTickIcon} layout="fixed" width={63} height={63} />
      <Heading1 style={{ marginTop: '2rem' }}>You're all done!</Heading1>
      <SuccessTextDescription>
        Your request has been sent to {context?.selectedContractor?.businessName}. You will be notified once the contractor has accepted the job.
      </SuccessTextDescription>
    </SuccessContainer>
  );
};

const SuccessContainer = styled(motion.div)`
  text-align: center;
  width: 90%;
  margin: 40px auto;
`;

const SuccessTextDescription = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${Colours.GRAY_7};
`;

export default SuccessMessage;
