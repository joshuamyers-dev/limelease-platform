import { CardTitleText } from '@components/Headings';
import { Maybe, Property, PropertyRequestFilter, useFetchPropertyRequestsLazyQuery } from '@graphql/generated';
import { Button, Card, Divider, Segmented, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { usePagination } from '@hooks/usePagination';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { propertyRequestTableColumns } from '../utils/Constants';

const INITIAL_LOAD_AMOUNT = 5;

interface PropertyRequestsProps {
  property: Maybe<Property> | undefined;
  onClickAddRequest: () => void;
}

const PropertyRequests: React.FC<PropertyRequestsProps> = ({ onClickAddRequest, property }) => {
  const [fetchRequestsQuery, { loading, data: requestsData, fetchMore, error }] = useFetchPropertyRequestsLazyQuery();

  const [selectedFilter, setSelectedFilter] = useState('New');

  const router = useRouter();

  const { onClickBack, onClickForward } = usePagination({
    data: requestsData?.requestsForProperty,
    fetchMore,
    initialFetchAmount: INITIAL_LOAD_AMOUNT,
  });

  useEffect(() => {
    if (property) {
      fetchRequestsQuery({
        variables: {
          propertyId: property.id,
          first: INITIAL_LOAD_AMOUNT,
        },
        fetchPolicy: 'cache-and-network',
      });
    }
  }, [property]);

  const onChangeRequestFilter = useCallback(
    (value: string | number) => {
      if (!property) return;

      setSelectedFilter(value.toString());

      const state = value.toString().toUpperCase() as PropertyRequestFilter;

      fetchRequestsQuery({
        variables: {
          propertyId: property.id,
          first: INITIAL_LOAD_AMOUNT,
          state,
        },
        fetchPolicy: 'cache-and-network',
      });
    },
    [property]
  );

  const requests = useMemo(() => requestsData?.requestsForProperty?.edges?.map((edge) => edge?.node), [requestsData?.requestsForProperty]);

  const data = useMemo(() => {
    return requests?.map((request, index) => {
      return {
        key: index,
        id: request?.id,
        title: request?.title,
        requestedOn: dayjs(request?.insertedAt).format('DD MMM YYYY'),
        urgency: request?.urgency,
        status: request?.state,
        ticketNumber: request?.ticketNumber,
        messages: 0,
      };
    });
  }, [requests]);

  return (
    <StyledCard>
      <CardTitleText>Requests</CardTitleText>

      <SegmentedContainer>
        <SegmentedWrapper>
          <Segmented
            defaultValue={'New'}
            value={selectedFilter}
            size="small"
            options={['All', 'New', 'Completed', 'Archived']}
            onChange={onChangeRequestFilter}
          />
          <Divider style={{ marginTop: 0, marginBottom: 0 }} />
        </SegmentedWrapper>
        <AddButtonContainer>
          <Button type="primary" icon={<PlusOutlined />} onClick={onClickAddRequest}>
            Add Request
          </Button>
        </AddButtonContainer>
      </SegmentedContainer>

      <Table
        columns={propertyRequestTableColumns}
        dataSource={data}
        size="middle"
        loading={loading}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              router.push(`/requests/${record.ticketNumber}`);
            },
          };
        }}
      />

      <PaginationButtonsContainer>
        <Button type="primary" icon={<LeftOutlined />} onClick={onClickBack} disabled={!requestsData?.requestsForProperty?.pageInfo.hasPreviousPage} />
        <Button type="primary" icon={<RightOutlined />} onClick={onClickForward} disabled={!requestsData?.requestsForProperty?.pageInfo.hasNextPage} />
      </PaginationButtonsContainer>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin: 24px auto;
  max-width: 80%;
`;

const SegmentedContainer = styled.div`
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SegmentedWrapper = styled.div``;

const AddButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const PaginationButtonsContainer = styled.div`
  gap: 8px;
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
`;

export default PropertyRequests;
