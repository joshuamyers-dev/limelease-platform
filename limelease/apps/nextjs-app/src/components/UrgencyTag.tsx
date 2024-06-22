import { ExclamationCircleOutlined, FireOutlined, FlagOutlined } from '@ant-design/icons';
import { PropertyRequestUrgency } from '@graphql/generated';
import { Colours } from '@utils/Colours';
import { Tag } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';

interface UrgencyTagProps {
  urgency: PropertyRequestUrgency;
}

const UrgencyTag: React.FC<UrgencyTagProps> = ({ urgency }) => {
  if (urgency === PropertyRequestUrgency.Emergency) {
    return (
      <EmergencyTag color={Colours.LIGHT_RED} icon={<FireOutlined />}>
        Emergency
      </EmergencyTag>
    );
  } else if (urgency === PropertyRequestUrgency.MidHigh) {
    return (
      <MidHighTag color={Colours.ORANGE_LIGHT} icon={<ExclamationCircleOutlined />}>
        Mid-High
      </MidHighTag>
    );
  } else if (urgency === PropertyRequestUrgency.Low) {
    return (
      <LowTag color={Colours.GRAY_3} icon={<FlagOutlined />}>
        Low
      </LowTag>
    );
  } else {
    return null;
  }
};

const LowTag = styled(Tag)`
  color: ${Colours.GRAY_8} !important;
`;

const MidHighTag = styled(Tag)`
  color: ${Colours.ORANGE_DARK} !important;
`;

const EmergencyTag = styled(Tag)`
  color: ${Colours.RED_8} !important;
`;


export default UrgencyTag;
