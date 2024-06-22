import { AnimatedContainer } from '@components/AnimatedContainer';
import DashboardContainer from '@containers/DashboardContainer';
import { PropertyRequestFilter, useFetchRequestsLazyQuery } from '@graphql/generated';
import { usePagination } from '@hooks/usePagination';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { Button, Divider, Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ViewRequestsTableList from '../components/ViewRequestsTableList';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const INITIAL_LOAD_AMOUNT = 10;

const ViewRequestsContainer = () => {
  const [selectedFilter, setSelectedFilter] = useState(PropertyRequestFilter.New);
  const [fetchRequests, { data, loading, error, fetchMore }] = useFetchRequestsLazyQuery();

  useEffect(() => {
    fetchRequests({
      variables: {
        first: INITIAL_LOAD_AMOUNT,
      },
      fetchPolicy: 'cache-and-network',
    });
  }, []);

  const { onClickForward, onClickBack } = usePagination({ data: data?.myRequests, fetchMore, initialFetchAmount: INITIAL_LOAD_AMOUNT });

  const onChangeFilter = useCallback(async (state: PropertyRequestFilter) => {
    setSelectedFilter(state);

    await fetchRequests({
      variables: {
        first: INITIAL_LOAD_AMOUNT,
        state,
      },
      fetchPolicy: 'cache-and-network',
    });
  }, []);

  const requests = useMemo(() => data?.myRequests?.edges?.map((edge) => edge?.node), [data?.myRequests]);

  const segmentedOptions = useMemo(() => {
    return [
      {
        label: 'All',
        value: PropertyRequestFilter.All,
      },
      {
        label: 'New',
        value: PropertyRequestFilter.New,
      },
      {
        label: 'Completed',
        value: PropertyRequestFilter.Completed,
      },
      {
        label: 'Archived',
        value: PropertyRequestFilter.Archived,
      },
    ];
  }, []);

  return (
    <DashboardContainer>
      <AnimatedContainer {...cardAnimationProps}>
        <SegmentedContainer>
          <Segmented
            size="small"
            value={selectedFilter}
            options={segmentedOptions}
            onChange={(value: SegmentedValue) => onChangeFilter(value as PropertyRequestFilter)}
          />
          <Divider style={{ color: Colours.GRAY_5, margin: '0px 2px 0 2px' }} />
        </SegmentedContainer>
      </AnimatedContainer>

      <AnimatedContainer {...cardAnimationProps}>
        <ViewRequestsTableList requests={requests} isFetching={loading} />

        <PaginationButtonsContainer>
          <Button type="primary" icon={<LeftOutlined />} onClick={onClickBack} disabled={!data?.myRequests?.pageInfo.hasPreviousPage} />
          <Button type="primary" icon={<RightOutlined />} onClick={onClickForward} disabled={!data?.myRequests?.pageInfo.hasNextPage} />
        </PaginationButtonsContainer>
      </AnimatedContainer>
    </DashboardContainer>
  );
};

const SegmentedContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PaginationButtonsContainer = styled.div`
  gap: 8px;
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
`;

export default ViewRequestsContainer;
