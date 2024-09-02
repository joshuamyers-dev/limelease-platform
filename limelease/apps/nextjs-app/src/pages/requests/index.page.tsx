import ViewRequestsContainer from '@features/requests/viewRequests/containers/ViewRequestsContainer';
import Head from 'next/head';

const ViewRequestsPage = () => {
  return (
    <>
      <Head>
        <title>OccuPie</title>
      </Head>

      <ViewRequestsContainer />
    </>
  );
};

export default ViewRequestsPage;
