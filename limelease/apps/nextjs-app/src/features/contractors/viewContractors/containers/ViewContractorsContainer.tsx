import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { AnimatedContainer } from '@components/AnimatedContainer';
import EmptyState from '@components/EmptyState';
import DashboardContainer from '@containers/DashboardContainer';
import ViewRequestsTableList from '@features/requests/viewRequests/components/ViewRequestsTableList';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Button, Input, Space } from 'antd';
import styled from 'styled-components';

import contractorsEmptyImage from '@public/images/contractors-empty.svg';
import { useCountContractorsQuery, useFetchContractorsQuery } from '@graphql/generated';
import { useCallback, useMemo, useState } from 'react';
import ContractorsTableList from '../components/ContractorsTableList';
import Link from 'next/link';
import { usePagination } from '@hooks/usePagination';
import { useDebounce } from '@hooks/useDebounce';

const { Search } = Input;

const INITIAL_LOAD_AMOUNT = 10;

const ViewContractorsContainer = () => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' || event.target.value === ' ') {
      setSearchTerm(null);
    } else {
      setSearchTerm(event.target.value);
    }
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: contractorsData,
    loading: isLoading,
    fetchMore,
  } = useFetchContractorsQuery({
    variables: { first: INITIAL_LOAD_AMOUNT, searchTerm: debouncedSearchTerm },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { onClickForward, onClickBack } = usePagination({ data: contractorsData?.myContractors, fetchMore, initialFetchAmount: INITIAL_LOAD_AMOUNT });

  const { data: contractorCountData } = useCountContractorsQuery({ fetchPolicy: 'cache-and-network' });

  const contractors = useMemo(() => {
    return contractorsData?.myContractors?.edges?.map((edge) => edge?.node);
  }, [contractorsData?.myContractors?.edges]);

  return (
    <DashboardContainer>
      {contractorCountData?.contractorCount === 0 && (
        <EmptyState
          title="Contractors are your friends."
          description="If there's something strange... in your neighborhood... who you gonna call?"
          image={contractorsEmptyImage}
          buttonCtaText="Add Contractor"
          routeTo="/contractors/create"
        />
      )}

      {contractorCountData && contractorCountData?.contractorCount > 0 && (
        <>
          <TabsContainer>
            <RightContainer>
              <Space>
                <Search enterButton placeholder="Search" style={{ width: 320 }} size="large" onChange={onSearchChange} />

                <Link href="/contractors/create">
                  <Button type="primary" icon={<PlusOutlined />} size="large">
                    Add Contractor
                  </Button>
                </Link>
              </Space>
            </RightContainer>
          </TabsContainer>

          <GridContainer>
            <ContractorsTableList isFetching={isLoading} contractors={contractors} />

            <PaginationButtonsContainer>
              <Button type="primary" icon={<LeftOutlined />} onClick={onClickBack} disabled={!contractorsData?.myContractors?.pageInfo.hasPreviousPage} />
              <Button type="primary" icon={<RightOutlined />} onClick={onClickForward} disabled={!contractorsData?.myContractors?.pageInfo.hasNextPage} />
            </PaginationButtonsContainer>
          </GridContainer>
        </>
      )}
    </DashboardContainer>
  );
};

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
`;

const RightContainer = styled.div`
  flex: 1;
  justify-content: flex-end;
  display: flex;
`;

const GridContainer = styled.div`
  margin-top: 20px;
`;

const PaginationButtonsContainer = styled.div`
  gap: 8px;
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
`;

export default ViewContractorsContainer;
