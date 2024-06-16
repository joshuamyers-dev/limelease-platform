import RequestDetailsContainer from '@features/requests/requestDetails/containers/RequestDetailsContainer';
import { useRouter } from 'next/router';

const RequestDetailsPage = () => {
  const { query: queryParams } = useRouter();

  return <RequestDetailsContainer ticketNumber={queryParams.ticketNumber as string} />;
};

export default RequestDetailsPage;
