import ViewContractorsContainer from '@features/contractors/viewContractors/containers/ViewContractorsContainer';
import Head from 'next/head';

const ViewPropertiesPage = () => {
  return (
    <>
      <Head>
        <title>LimeLease</title>
      </Head>

      <ViewContractorsContainer />
    </>
  );
};

export default ViewPropertiesPage;
