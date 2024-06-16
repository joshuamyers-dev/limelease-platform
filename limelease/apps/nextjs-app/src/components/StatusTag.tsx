import { PropertyRequestState } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { Colours } from '@utils/Colours';
import { formatStatusTitle } from '@utils/Helpers';
import { Tag } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';

interface StatusTagProps {
  status: Maybe<PropertyRequestState>;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  if (status === PropertyRequestState.AwaitingResponse) {
    return <AwaitingResponseTag>{formatStatusTitle(status)}</AwaitingResponseTag>;
  } else if (status === PropertyRequestState.AssignedToContractor) {
    return <AwaitingTag>{formatStatusTitle(status)}</AwaitingTag>;
  } else if (status === PropertyRequestState.ContractorAppointmentBooked) {
    return <JobAcceptedTag>{formatStatusTitle(status)}</JobAcceptedTag>;
  } else if (status === PropertyRequestState.Resolved) {
    return <JobResolvedTag>{formatStatusTitle(status)}</JobResolvedTag>;
  } else if (status === PropertyRequestState.Deleted) {
    return <JobCancelledTag>{formatStatusTitle(status)}</JobCancelledTag>;
  } else {
    return null;
  }
};

const AwaitingResponseTag = styled(Tag)`
  background-color: ${Colours.BACKGROUND_1};
  color: ${Colours.GRAY_10};
  font-weight: 500;
  border: 1px solid ${Colours.GRAY_10};
  font-size: 12px;
`;

const AwaitingTag = styled(Tag)`
  background-color: ${Colours.GOLD_8};
  color: white;
  font-weight: 500;
  border: 1px solid ${Colours.GOLD_8};
  font-size: 12px;
`;

const JobAcceptedTag = styled(Tag)`
  background-color: ${Colours.GEEK_BLUE_3};
  color: ${Colours.GEEK_BLUE_8};
  font-weight: 500;
  border: 1px solid ${Colours.GEEK_BLUE_3};
  font-size: 12px;
`;

const JobResolvedTag = styled(Tag)`
  background-color: ${Colours.LIME_8};
  color: white;
  font-weight: 500;
  border: 1px solid ${Colours.LIME_8};
  font-size: 12px;
`;

const JobCancelledTag = styled(Tag)`
  background-color: ${Colours.GRAY_10};
  color: white;
  font-weight: 500;
  border: 1px solid ${Colours.GRAY_10};
  font-size: 12px;
`;

export default StatusTag;
