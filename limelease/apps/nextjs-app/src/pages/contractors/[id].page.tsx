import ContractorDetailsContainer from '@features/contractors/contractorDetails/containers/ContractorDetailsContainer';
import { useRouter } from 'next/router';

const ContractorDetailsPage = () => {
  const { query: queryParams } = useRouter();

  return <ContractorDetailsContainer contractorId={queryParams.id as string} />;
};

export default ContractorDetailsPage;
