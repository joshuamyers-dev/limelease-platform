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
      <Tag color={Colours.RED_8} icon={<FireOutlined />}>
        Emergency
      </Tag>
    );
  } else if (urgency === PropertyRequestUrgency.MidHigh) {
    return (
      <MidHighTag color={Colours.ORANGE_1} icon={<ExclamationCircleOutlined />}>
        Mid-High
      </MidHighTag>
    );
  } else if (urgency === PropertyRequestUrgency.Low) {
    return (
      <LowTag color={Colours.GRAY_7} icon={<FlagOutlined />}>
        Low
      </LowTag>
    );
  } else {
    return null;
  }
};

const LowTag = styled(Tag)``;

const MidHighTag = styled(Tag)`
  color: ${Colours.GRAY_11} !important;
`;

export default UrgencyTag;
