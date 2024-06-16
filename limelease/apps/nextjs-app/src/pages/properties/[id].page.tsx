import ViewPropertyContainer from '@features/properties/propertyDetails/containers/ViewPropertyContainer';
import { useRouter } from 'next/router';

const ViewPropertyPage = () => {
  const { query: queryParams } = useRouter();

  return <ViewPropertyContainer propertyId={queryParams?.id as string} />;
};

export default ViewPropertyPage;
