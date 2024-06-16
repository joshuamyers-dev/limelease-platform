import ViewPropertiesContainer from '@features/properties/viewProperties/containers/ViewPropertiesContainer';
import Head from 'next/head';

const ViewPropertiesPage = () => {
  return (
    <>
      <Head>
        <title>LimeLease</title>
      </Head>

      <ViewPropertiesContainer />
    </>
  );
};

export default ViewPropertiesPage;
