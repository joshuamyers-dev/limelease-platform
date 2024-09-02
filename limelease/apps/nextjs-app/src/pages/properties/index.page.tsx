import ViewPropertiesContainer from '@features/properties/viewProperties/containers/ViewPropertiesContainer';
import Head from 'next/head';

const ViewPropertiesPage = () => {
  return (
    <>
      <Head>
        <title>OccuPie</title>
      </Head>

      <ViewPropertiesContainer />
    </>
  );
};

export default ViewPropertiesPage;
