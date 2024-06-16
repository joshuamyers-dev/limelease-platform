import { ContractorJobState, PropertyRequestState } from '@graphql/generated';
import { Maybe } from '@types/Maybe';
import { Colours } from '@utils/Colours';
import { Tag } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';

interface ContractorJobStatusTagProps {
  status: Maybe<ContractorJobState>;
}

const ContractorJobStatusTag: React.FC<ContractorJobStatusTagProps> = ({ status }) => {
  const formatStatusTitle = useCallback((title: ContractorJobState) => {
    switch (title) {
      case ContractorJobState.Sent:
        return 'Sent';
      case ContractorJobState.QuoteBooked:
        return 'Booked for Quote';
      case ContractorJobState.QuotedPriced:
        return 'Quoted & Invoiced';
      case ContractorJobState.JobBooked:
        return 'Job Booked';
      case ContractorJobState.JobCompleted:
        return 'Job Completed';
      case ContractorJobState.Archived:
        return 'Archived';
      case ContractorJobState.JobCancelled:
        return 'Job Cancelled';
      default:
        return 'Unknown Status';
    }
  }, []);

  switch (status) {
    case ContractorJobState.Sent:
      return <SentTag>{formatStatusTitle(status)}</SentTag>;
    case ContractorJobState.QuoteBooked:
      return <QuoteBookedTag>{formatStatusTitle(status)}</QuoteBookedTag>;
    case ContractorJobState.QuotedPriced:
      return <QuotedPricedTag>{formatStatusTitle(status)}</QuotedPricedTag>;
    case ContractorJobState.JobBooked:
      return <JobBookedTag>{formatStatusTitle(status)}</JobBookedTag>;
    case ContractorJobState.JobCompleted:
      return <JobCompletedTag>{formatStatusTitle(status)}</JobCompletedTag>;
    case ContractorJobState.Archived:
      return <ArchivedTag>{formatStatusTitle(status)}</ArchivedTag>;
    case ContractorJobState.JobCancelled:
      return <JobCancelledTag>{formatStatusTitle(status)}</JobCancelledTag>;
    default:
      return null;
  }
};

const ArchivedTag = styled(Tag)`
  background-color: ${Colours.BACKGROUND_1};
  color: ${Colours.GRAY_10};
  font-weight: 500;
  border: 1px solid ${Colours.GRAY_10};
  font-size: 12px;
`;

const JobCancelledTag = styled(Tag)`
  background-color: ${Colours.GOLD_5};
  color: ${Colours.GOLD_8};
  font-weight: 500;
  border: 1px solid ${Colours.GOLD_5};
  font-size: 12px;
`;

const JobBookedTag = styled(Tag)`
  background-color: ${Colours.GEEK_BLUE_3};
  color: ${Colours.GEEK_BLUE_8};
  font-weight: 500;
  border: 1px solid ${Colours.GEEK_BLUE_3};
  font-size: 12px;
`;

const JobCompletedTag = styled(Tag)`
  background-color: ${Colours.LIME_5};
  color: ${Colours.GRAY_10};
  font-weight: 500;
  border: 1px solid ${Colours.LIME_5};
  font-size: 12px;
`;

const SentTag = styled(Tag)`
  background-color: ${Colours.BACKGROUND_1};
  color: ${Colours.GRAY_10};
  font-weight: 500;
  border: 1px solid ${Colours.GRAY_10};
  font-size: 12px;
`;

const QuoteBookedTag = styled(Tag)`
  background-color: ${Colours.GOLD_5};
  color: ${Colours.GOLD_8};
  font-weight: 500;
  border: 1px solid ${Colours.GOLD_5};
  font-size: 12px;
`;

const QuotedPricedTag = styled(Tag)`
  background-color: ${Colours.GEEK_BLUE_3};
  color: ${Colours.GEEK_BLUE_8};
  font-weight: 500;
  border: 1px solid ${Colours.GEEK_BLUE_3};
  font-size: 12px;
`;

export default ContractorJobStatusTag;
