import { AnimatedContainer } from '@components/AnimatedContainer';
import { Landlord, Lease, Tenant } from '@graphql/generated';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { formatMobileNumber } from '@utils/Helpers';
import { Badge, Divider, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import styled from 'styled-components';

interface RentalProvidersProps {
  landlords: Landlord[];
}

const RentalProviders: React.FC<RentalProvidersProps> = ({ landlords }) => {
  return (
    <AnimatedContainer {...fadeInOutProps}>
      <SectionTitle>Rental Providers</SectionTitle>

      {landlords.map((landlord) => {
        return (
          <>
            <TenantContainer>
              <TenantName>
                {landlord.firstName} {landlord.lastName}
              </TenantName>

              <DetailRow>
                <DetailRowTitle>Email</DetailRowTitle>
                <DetailRowValue>
                  <a href={`mailto:${landlord.email}`}>{landlord.email}</a>
                </DetailRowValue>
              </DetailRow>
              <DetailRow>
                <DetailRowTitle>Phone Number</DetailRowTitle>
                <DetailRowValue>{formatMobileNumber(landlord.phoneNumber, true)}</DetailRowValue>
              </DetailRow>
            </TenantContainer>
          </>
        );
      })}
    </AnimatedContainer>
  );
};

const LeaseStatusWrapper = styled.div`
  margin-top: 24px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${Colours.GRAY_8};
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

export default RentalProviders;
