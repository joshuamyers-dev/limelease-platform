import { Alert, Button } from 'antd';

import styled from 'styled-components';
import { URGENT_MATTER_BODY_TEXT, URGENT_MATTER_CTA_LINK, URGENT_MATTER_CTA_TEXT, URGENT_MATTER_HEADLINE_TEXT } from '../utils/Constants';
import { motion } from 'framer-motion';
import { fadeInOutProps } from '@utils/AnimationsProps';

const UrgentMatterAlert = () => {
  return (
    <AlertContainer {...fadeInOutProps}>
      <Alert
        message={URGENT_MATTER_HEADLINE_TEXT}
        description={
          <>
            <UrgentRepairsMessage>{URGENT_MATTER_BODY_TEXT}</UrgentRepairsMessage>
            <Button type="default" onClick={() => window.open(URGENT_MATTER_CTA_LINK, '_blank')}>
              {URGENT_MATTER_CTA_TEXT}
            </Button>
          </>
        }
        type="warning"
        showIcon
        closable
      />
    </AlertContainer>
  );
};

const AlertContainer = styled(motion.div)`
  margin-bottom: 13px;
`;

const UrgentRepairsMessage = styled.div`
  margin-bottom: 13px;
`;

export default UrgentMatterAlert;
