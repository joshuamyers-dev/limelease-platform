import { AnimatedContainer } from '@components/AnimatedContainer';
import { Lease, Tenant } from '@graphql/generated';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { formatMobileNumber } from '@utils/Helpers';
import { Badge, Divider, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import styled from 'styled-components';

interface PropertyLeaseProps {
  leaseDetails: Lease;
  tenants: Tenant[];
}

const PropertyLease: React.FC<PropertyLeaseProps> = ({ leaseDetails, tenants }) => {
  const isActive = useMemo(() => {
    return leaseDetails !== null;
  }, [leaseDetails]);

  const startDate = useMemo(() => {
    return dayjs(leaseDetails?.startDate)?.format('DD MMMM YYYY');
  }, [leaseDetails?.startDate]);

  const endDate = useMemo(() => {
    return dayjs(leaseDetails?.endDate)?.format('DD MMMM YYYY');
  }, [leaseDetails?.startDate]);

  const leaseDuration = useMemo(() => {
    return dayjs(leaseDetails?.endDate).diff(dayjs(leaseDetails?.startDate), 'months');
  }, [leaseDetails?.startDate, leaseDetails?.endDate]);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      <SectionTitle>Lease Details</SectionTitle>

      <LeaseStatusWrapper>
        <DetailRow>
          <DetailRowTitle>Lease Status</DetailRowTitle>
          <DetailRowValue>
            <Badge status={leaseDetails?.isActive ? 'success' : 'error'} text={leaseDetails?.isActive ? 'Active' : 'Not active'} />
          </DetailRowValue>
        </DetailRow>
      </LeaseStatusWrapper>

      {leaseDetails?.isActive && (
        <>
          <DetailRow>
            <DetailRowTitle>Bond Status</DetailRowTitle>
            <DetailRowValue>
              <Badge status="success" text="Lodged" />
            </DetailRowValue>
          </DetailRow>

          <DetailRow>
            <DetailRowTitle>Lease Start Date</DetailRowTitle>
            <DetailRowValue>{startDate}</DetailRowValue>
          </DetailRow>

          <DetailRow>
            <DetailRowTitle>Lease End Date</DetailRowTitle>
            <DetailRowValue>{endDate}</DetailRowValue>
          </DetailRow>

          <DetailRow>
            <DetailRowTitle>Lease Term</DetailRowTitle>
            <DetailRowValue>{leaseDuration} months</DetailRowValue>
          </DetailRow>

          <DetailRow>
            <DetailRowTitle>Rental Amount</DetailRowTitle>
            <DetailRowValue>
              ${leaseDetails.rentPcm}{' '}
              <Tooltip title="Per Calendar Month" style={{ fontStyle: 'italic' }}>
                pcm
              </Tooltip>
            </DetailRowValue>
          </DetailRow>

          <Divider />

          <SectionTitle>Tenants</SectionTitle>

          {tenants.map((tenant) => {
            return (
              <>
                <TenantContainer>
                  <TenantName>
                    {tenant?.user?.profile?.firstName} {tenant?.user?.profile?.lastName}
                  </TenantName>

                  <DetailRow>
                    <DetailRowTitle>Email</DetailRowTitle>
                    <DetailRowValue>
                      <a href={`mailto:${tenant?.user?.profile?.email}`}>{tenant.user?.profile?.email}</a>
                    </DetailRowValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailRowTitle>Phone Number</DetailRowTitle>
                    <DetailRowValue>{formatMobileNumber(tenant.user?.profile?.phoneNumber, true)}</DetailRowValue>
                  </DetailRow>
                </TenantContainer>
              </>
            );
          })}
        </>
      )}
    </AnimatedContainer>
  );
};

const LeaseStatusWrapper = styled.div`
  margin-top: 24px;
`;

const SectionTitle = styled.div`
  color: ${Colours.NAVY};
  font-family: Figtree;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const DetailRowTitle = styled.div`
  color: #8c8c8c;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  width: 160px;
`;

const DetailRowValue = styled.div`
  color: #262626;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`;

const TenantContainer = styled.div``;

const TenantName = styled.div`
  font-size: 16px;
  font-family: Figtree;
  font-weight: 600;
  color: ${Colours.GRAY_10};
  padding-bottom: 16px;
  padding-top: 24px;
`;

export default PropertyLease;
