import React from 'react';
import Image from 'next/image';

import { Card, Col, Row } from 'antd';

import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import bathroomIcon from '@public/images/bathrooms-icon.svg';
import bedroomIcon from '@public/images/bedrooms-icon.svg';
import carIcon from '@public/images/carspace-icon.svg';

import styled from 'styled-components';

import { Colours } from '../../../../utils/Colours';
import { PropertyNotificationCounts } from '@graphql/generated';
import ImagePlaceholder from '@components/ImagePlaceholder';
import { useRouter } from 'next/router';

interface PropertyCardProps {
  id: string;
  addressLabel: string;
  imageUrl: string;
  suburb: string;
  bedrooms: number;
  bathrooms: number;
  carspaces: number;
  notificationCounts: PropertyNotificationCounts;
  onClickProperty: (id: string) => void;
}

const PropertyCard = ({ id, addressLabel, imageUrl, suburb, bedrooms, bathrooms, carspaces, notificationCounts, onClickProperty }: PropertyCardProps) => {
  const router = useRouter();

  return (
    <Card style={{ width: '100%', cursor: 'pointer' }} onClick={() => onClickProperty(id)}>
      <HeaderContainer>
        <AddressLocationContainer>
          <AddressText>{addressLabel}</AddressText>
          <LocationText>{suburb}</LocationText>
        </AddressLocationContainer>

        <ActionButton onClick={() => router.push(`/properties/edit/${id}`)}>
          <EditOutlined width={18} height={18} color={Colours.LIME_10} />
        </ActionButton>

        <ActionButton>
          <EllipsisOutlined width={16} height={3} color={Colours.LIME_10} />
        </ActionButton>
      </HeaderContainer>

      <DwellingInfoContainer>
        <DwellingInfo>
          <Image src={bedroomIcon} width={14} height={11} />
          <DwellingInfoText>{bedrooms}</DwellingInfoText>
        </DwellingInfo>
        <DwellingInfo>
          <Image src={bathroomIcon} width={13} height={12} />
          <DwellingInfoText>{bathrooms}</DwellingInfoText>
        </DwellingInfo>
        <DwellingInfo>
          <Image src={carIcon} width={15} height={15} />
          <DwellingInfoText>{carspaces}</DwellingInfoText>
        </DwellingInfo>
      </DwellingInfoContainer>

      <CoverPhoto alt="Photo of this property" src={imageUrl} width={600} height={200} />

      <StatsRow>
        <StatsCol span={8}>
          <StatHeader>{notificationCounts.messagesCount}</StatHeader>
          <StatLabel>Messages</StatLabel>
        </StatsCol>
        <StatsCol span={8}>
          <StatCircle>{notificationCounts.urgentCount}</StatCircle>
          <StatLabel>Urgent</StatLabel>
        </StatsCol>
        <StatsCol span={8}>
          <StatHeader>{notificationCounts.midHighCount}</StatHeader>
          <StatLabel>Mid-High</StatLabel>
        </StatsCol>
      </StatsRow>
    </Card>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const AddressLocationContainer = styled.div`
  flex: 1;
`;

const AddressText = styled.div`
  font-weight: 600;
  color: ${Colours.GRAY_10};
  font-size: 16px;
`;

const LocationText = styled.div`
  font-weight: 600;
  color: ${Colours.GRAY_8};
`;

const DwellingInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 16px;
`;

const DwellingInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-right: 10px;

  img {
    fill: ${Colours.GRAY_8};
  }
`;

const DwellingInfoText = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${Colours.GRAY_8};
  padding-left: 4px;
`;

const CoverPhoto = styled(ImagePlaceholder)`
  border-radius: 4px;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ActionButton = styled.div`
  cursor: pointer;
  margin-left: 16px;

  svg {
    fill: ${Colours.LIME_5};
    width: 18px;
    height: 18px;
  }
`;

const StatsRow = styled(Row)`
  align-items: center;
  justify-content: center;
  padding-top: 12px;
`;

const StatsCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatHeader = styled.div`
  font-weight: 600;
  color: ${Colours.GRAY_9};
  font-size: 14px;
`;

const StatCircle = styled.div`
  background: #fff1f0;
  border-radius: 32px;
  width: 25px;
  height: 22px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  color: #cf1322;
`;

const StatLabel = styled.div`
  color: ${Colours.GRAY_7};
  font-size: 12px;
  line-height: 22px;
`;

export default PropertyCard;
