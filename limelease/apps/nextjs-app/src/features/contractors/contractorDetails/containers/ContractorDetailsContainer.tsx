import { LeftOutlined, RightOutlined, ToolOutlined } from '@ant-design/icons';
import LoadingSpinner from '@components/LoadingSpinner';
import DashboardContainer from '@containers/DashboardContainer';
import { Maybe, PropertyRequestFilter, Scalars, useFetchContractorJobsQuery, useFetchContractorQuery } from '@graphql/generated';
import { Breadcrumb, Button } from 'antd';
import ContractorDetails from '../components/ContractorDetails';
import ContractorJobs from '../components/ContractorJobs';
import styled from 'styled-components';
import { usePagination } from '@hooks/usePagination';
import { useState } from 'react';

const INITIAL_LOAD_AMOUNT = 5;

interface ContractorDetailsContainerProps {
  contractorId: Maybe<string>;
}

const ContractorDetailsContainer: React.FC<ContractorDetailsContainerProps> = ({ contractorId }) => {
  if (!contractorId) return null;

  const [filter, setFilter] = useState<PropertyRequestFilter>(PropertyRequestFilter.All);

  const {
    data: contractorData,
    loading: fetchingContractor,
    error,
  } = useFetchContractorQuery({
    variables: {
      contractorId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: jobsData,
    loading: fetchingJobs,
    fetchMore,
  } = useFetchContractorJobsQuery({
    variables: {
      contractorId,
      first: INITIAL_LOAD_AMOUNT,
      state: filter,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { onClickBack, onClickForward } = usePagination({ data: jobsData?.jobsForContractor, fetchMore, initialFetchAmount: INITIAL_LOAD_AMOUNT });

  const contractor = contractorData?.fetchContractor;
  const contractorJobs = jobsData?.jobsForContractor?.edges?.map((edge) => edge?.node);

  return (
    <DashboardContainer>
      <>
        <Breadcrumb separator="/" style={{ marginTop: '32px' }}>
          <Breadcrumb.Item>
            <ToolOutlined />
            <span>Contractors</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <span>{contractor?.businessName}</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        {fetchingContractor && <LoadingSpinner />}
        {!fetchingContractor && (
          <Container>
            <ContractorDetails {...contractor} />
            <ContractorJobs isFetching={fetchingJobs} jobs={contractorJobs} onChangeFilter={(filter) => setFilter(filter)} />
            <PaginationButtonsContainer>
              <Button type="primary" icon={<LeftOutlined />} onClick={onClickBack} disabled={!jobsData?.jobsForContractor?.pageInfo.hasPreviousPage} />
              <Button type="primary" icon={<RightOutlined />} onClick={onClickForward} disabled={!jobsData?.jobsForContractor?.pageInfo.hasNextPage} />
            </PaginationButtonsContainer>
          </Container>
        )}
      </>
    </DashboardContainer>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const PaginationButtonsContainer = styled.div`
  gap: 8px;
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
`;

export default ContractorDetailsContainer;
