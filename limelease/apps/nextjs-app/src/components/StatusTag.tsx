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
  background-color: ${Colours.ORANGE_LIGHT};
  color: ${Colours.ORANGE_DARK};
  font-weight: 500;
  border: 1px solid ${Colours.ORANGE_LIGHT};
  font-size: 12px;
`;

const AwaitingTag = styled(Tag)`
  background-color: ${Colours.ORANGE_LIGHT};
  color: ${Colours.ORANGE_DARK};
  font-weight: 500;
  border: 1px solid ${Colours.ORANGE_LIGHT};
  font-size: 12px;
`;

const JobAcceptedTag = styled(Tag)`
  background-color: ${Colours.LIGHT_GREEN};
  color: ${Colours.DARK_GREEN};
  font-weight: 500;
  border: 1px solid ${Colours.LIGHT_GREEN};
  font-size: 12px;
`;

const JobResolvedTag = styled(Tag)`
  background-color: ${Colours.LIGHT_GREEN};
  color: ${Colours.DARK_GREEN};
  font-weight: 500;
  border: 1px solid ${Colours.LIGHT_GREEN};
  font-size: 12px;
`;

const JobCancelledTag = styled(Tag)`
  background-color: ${Colours.LIGHT_RED};
  color: ${Colours.RED_8};
  font-weight: 500;
  border: 1px solid ${Colours.LIGHT_RED};
  font-size: 12px;
`;

export default StatusTag;
