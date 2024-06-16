import DashboardContainer from '@containers/DashboardContainer';
import { Maybe, useFetchPropertyQuery } from '@graphql/generated';
import { renderAddressLabel } from '@utils/Helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LoadingSpinner from '@components/LoadingSpinner';
import dynamic from 'next/dynamic';
import { AnimatedContainer } from '@components/AnimatedContainer';
import PropertyRequests from '../components/PropertyRequests';
import { cardAnimationProps } from '@utils/AnimationsProps';
import PropertyLease from '../components/PropertyLease';
import { Breadcrumb, Button, Card, Divider, Modal, Segmented } from 'antd';
import CreateRequestForm from '@features/requests/createRequest/components/CreateRequestForm';
import { EditOutlined, HomeOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import { Colours } from '@utils/Colours';
import { CardTitleText } from '@components/Headings';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import RentalProviders from '../components/RentalProviders';

const PropertyDetails = dynamic(() => import('../components/PropertyDetails'));

const MotionCard = motion(Card);

export const OVERVIEW_SCREEN = 'Overview';
export const LEASE_SCREEN = 'Lease';
export const RENTAL_PROVIDERS_SCREEN = 'Rental Providers';
export const FILES_SCREEN = 'Files';

interface ViewPropertyContainerProps {
  propertyId: Maybe<string>;
}

const ViewPropertyContainer: React.FC<ViewPropertyContainerProps> = ({ propertyId }) => {
  const { data: propertyData, loading, error } = useFetchPropertyQuery({ variables: { id: propertyId as string }, fetchPolicy: 'cache-and-network' });

  const [selectedTab, setSelectedTab] = useState(OVERVIEW_SCREEN);
  const [addRequestModalVisible, showAddRequestModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const addressLabel = useMemo(() => {
    return propertyData ? renderAddressLabel(propertyData?.fetchProperty?.address) : '';
  }, [propertyData]);

  const onChangeSegmented = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  const onClickAddRequest = useCallback(() => {
    showAddRequestModal(true);
  }, []);

  const onClickEdit = useCallback(() => {
    router.push(`/properties/edit/${propertyId}`);
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) {
      setSelectedTab(searchParams.get('tab') || OVERVIEW_SCREEN);
    }
  }, [searchParams, propertyId]);

  useEffect(() => {
    if (propertyId && !loading) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, id: propertyId, tab: selectedTab },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [selectedTab, propertyId, loading]);

  const property = propertyData?.fetchProperty;

  return (
    <DashboardContainer>
      <Modal open={addRequestModalVisible} footer={null} onCancel={() => showAddRequestModal(false)} width={'50%'}>
        <CreateRequestForm propertyId={property?.id} onCloseModal={() => showAddRequestModal(false)} />
      </Modal>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <AnimatedContainer {...cardAnimationProps}>
            <Breadcrumb separator="/">
              <Breadcrumb.Item onClick={() => router.back()}>
                <HomeOutlined />
                <span>Properties</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="" onClick={(e) => e.preventDefault()}>
                <span>{property?.address && renderAddressLabel(property.address)}</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </AnimatedContainer>

          <StyledCard {...cardAnimationProps}>
            <CardHeaderRow>
              <CardHeaderCol>
                <CardTitleText>{addressLabel}</CardTitleText>
                <SuburbText>
                  {property?.address?.suburb}, {property?.address?.state}
                </SuburbText>
              </CardHeaderCol>

              <Button type="primary" size="large" icon={<EditOutlined />} onClick={onClickEdit}>
                Edit
              </Button>
            </CardHeaderRow>

            <SegmentedContainer>
              <Segmented size="small" options={['Overview', 'Lease', 'Rental Providers', 'Files']} value={selectedTab} onChange={onChangeSegmented} />
              <Divider style={{ color: Colours.GRAY_5, margin: '0px 2px 0 2px' }} />
            </SegmentedContainer>

            <AnimatePresence mode="wait">
              {selectedTab === OVERVIEW_SCREEN && <PropertyDetails key={1} property={property} addressLabel={addressLabel} />}
              {selectedTab === LEASE_SCREEN && <PropertyLease key={2} leaseDetails={property?.lease} tenants={property?.tenants} />}
              {selectedTab === RENTAL_PROVIDERS_SCREEN && <RentalProviders key={2} landlords={property?.landlords} />}
            </AnimatePresence>
          </StyledCard>

          <AnimatedContainer {...cardAnimationProps}>
            <PropertyRequests property={property} onClickAddRequest={onClickAddRequest} />
          </AnimatedContainer>
        </>
      )}
    </DashboardContainer>
  );
};

const SegmentedContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const StyledCard = styled(motion(Card))`
  max-width: 80%;
  margin: 24px auto;
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
`;

const CardHeaderCol = styled.div`
  flex: 1;
`;

const SuburbText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${Colours.GRAY_8};
`;


export default ViewPropertyContainer;
