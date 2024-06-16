import EditPropertyContainer from '@features/properties/editProperty/containers/EditPropertyContainer';
import { useRouter } from 'next/router';

const EditPropertyPage = () => {
  const { query: queryParams } = useRouter();

  return <EditPropertyContainer propertyId={queryParams?.id as string} />;
};

export default EditPropertyPage;
