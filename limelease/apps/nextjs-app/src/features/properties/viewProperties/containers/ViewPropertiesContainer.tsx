import { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { AnimatedContainer } from '@components/AnimatedContainer';
import DashboardContainer from '@containers/DashboardContainer';
import { PropertyFilter, useFetchPropertiesQuery } from '@graphql/generated';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { renderAddressLabel } from '@utils/Helpers';
import { Button, Col, Divider, Input, Row, Segmented, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EmptyState from '../../../../components/EmptyState';
import PropertyCard from '../components/PropertyCard';

import LoadingSpinner from '@components/LoadingSpinner';
import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';
import propertiesEmptyImage from '@public/images/properties-empty.svg';
import { AnimatePresence } from 'framer-motion';

const { Search } = Input;

const INITIAL_LOAD_AMOUNT = 6;

const ViewPropertiesContainer = () => {
  const router = useRouter();
  const [filter, setFilter] = useState(PropertyFilter.All);
  const [searchKeywords, setSearchKeywords] = useState('');
  const debouncedSearchKeywords = useDebounce(searchKeywords);

  const { loading, data, error, fetchMore } = useFetchPropertiesQuery({
    variables: { first: INITIAL_LOAD_AMOUNT, filter, searchKeywords: debouncedSearchKeywords },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { onClickForward, onClickBack } = usePagination({ data: data?.myProperties, fetchMore, initialFetchAmount: INITIAL_LOAD_AMOUNT });

  const onClickProperty = useCallback((propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  }, []);

  const properties = useMemo(() => {
    return data?.myProperties?.edges?.map((propertyNode) => propertyNode?.node);
  }, [data]);

  return (
    <DashboardContainer>
      <TabsContainer>
        <LeftContainer>
          <Segmented
            value={filter}
            size="large"
            options={[
              {
                label: 'All',
                value: PropertyFilter.All,
              },
              {
                label: 'Occupied',
                value: PropertyFilter.Occupied,
              },
              {
                label: 'Vacant',
                value: PropertyFilter.Vacant,
              },
            ]}
            onChange={(value) => setFilter(value as PropertyFilter)}
          />
        </LeftContainer>

        <RightContainer>
          <Space>
            <Search enterButton placeholder="Search" style={{ width: 320 }} size="large" onChange={(e) => setSearchKeywords(e.target.value)} />

            <Link href="/properties/create">
              <Button type="primary" icon={<PlusOutlined />} size="large">
                Add Property
              </Button>
            </Link>
          </Space>
        </RightContainer>
      </TabsContainer>

      <Divider style={{ color: Colours.GRAY_5, margin: '0px 2px 0 2px' }} />

      <GridContainer>
        <AnimatePresence mode="wait">
          {loading && <LoadingSpinner key={0} containerStyle={{ marginTop: 50 }} />}

          {!loading && properties?.length === 0 && (
            <EmptyState
              key={1}
              title="This estate has been abandoned!"
              description="Don’t leave it empty for too long. Ghosts like unoccupied spaces."
              image={propertiesEmptyImage}
              buttonCtaText="Add a Property"
              routeTo="/properties/create"
            />
          )}

          <Row gutter={[24, 24]}>
            {!loading &&
              properties?.map((property, index) => (
                <Col span={8} key={index}>
                  <AnimatedContainer {...cardAnimationProps}>
                    <PropertyCard
                      id={property?.id}
                      addressLabel={renderAddressLabel(property?.address)}
                      suburb={`${property?.address?.suburb}, ${property?.address?.state}`}
                      imageUrl={property?.photos[0]?.staticMedia?.url}
                      bathrooms={property?.bathrooms}
                      bedrooms={property?.bedrooms}
                      carspaces={property?.carspaces}
                      notificationCounts={property?.notificationCount}
                      onClickProperty={onClickProperty}
                    />
                  </AnimatedContainer>
                </Col>
              ))}
          </Row>
        </AnimatePresence>

        {properties && properties?.length > 0 && (
          <PaginationButtonsContainer>
            <Button type="primary" icon={<LeftOutlined />} onClick={onClickBack} disabled={!data?.myProperties?.pageInfo.hasPreviousPage} />
            <Button type="primary" icon={<RightOutlined />} onClick={onClickForward} disabled={!data?.myProperties?.pageInfo.hasNextPage} />
          </PaginationButtonsContainer>
        )}
      </GridContainer>
    </DashboardContainer>
  );
};

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 32px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
`;

const RightContainer = styled.div``;

const PaginationContainer = styled.div`
  float: right;
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

export default ViewPropertiesContainer;
