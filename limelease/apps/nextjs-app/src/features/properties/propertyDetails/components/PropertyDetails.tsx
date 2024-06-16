import { EditOutlined, HomeOutlined } from '@ant-design/icons';
import { Maybe, Property } from '@graphql/generated';
import { Colours } from '@utils/Colours';
import { Breadcrumb, Button, Card, Divider, Modal, Segmented } from 'antd';
import styled from 'styled-components';

import bathroomIcon from '@features/properties/viewProperties/assets/bathroom-icon.png';
import bedroomIcon from '@features/properties/viewProperties/assets/bedroom-icon.png';
import carIcon from '@features/properties/viewProperties/assets/car-icon.png';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { AnimatedContainer } from '@components/AnimatedContainer';
import { CardTitleText } from '@components/Headings';
import ImagePlaceholder from '@components/ImagePlaceholder';
import { useImageGallery } from '@hooks/useImageGallery';
import { cardAnimationProps, fadeInOutProps } from '@utils/AnimationsProps';
import { renderAddressLabel } from '@utils/Helpers';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CreateRequestForm = dynamic(() => import('@features/requests/createRequest/components/CreateRequestForm'));
const PropertyRequests = dynamic(() => import('./PropertyRequests'));

interface PropertyDetailsProps {
  addressLabel: Maybe<string>;
  property: Maybe<Property> | undefined;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ addressLabel, property }) => {
  const router = useRouter();

  const imageUrls = useMemo(() => {
    return property?.photos ? property.photos.map((photo) => photo.staticMedia?.url).filter((url): url is string => url !== undefined) : [];
  }, [property]);

  const { ImageGallery, onClickViewAllPhotos } = useImageGallery(imageUrls);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      {ImageGallery}

      <AnimatedContainer {...cardAnimationProps}>
        <DwellingInfoContainer>
          <DwellingInfo>
            <DwellingLabelText>Bedrooms:</DwellingLabelText>
            <DwellingInfoText>{property?.bedrooms}</DwellingInfoText>
          </DwellingInfo>
          <DwellingInfo>
            <DwellingLabelText>Bathrooms:</DwellingLabelText>
            <DwellingInfoText>{property?.bathrooms}</DwellingInfoText>
          </DwellingInfo>
          <DwellingInfo>
            <DwellingLabelText>Carspaces:</DwellingLabelText>
            <DwellingInfoText>{property?.carspaces}</DwellingInfoText>
          </DwellingInfo>
        </DwellingInfoContainer>

        <PhotosContainerGrid>
          {property?.photos?.slice(0, 5).map((photo, index) => {
            return (
              <PhotoContainer key={index}>
                <ImagePlaceholder alt="Photo of the property" src={photo.staticMedia!.url as string} fill priority />
              </PhotoContainer>
            );
          })}
        </PhotosContainerGrid>

        {property?.photos?.length && property.photos.length > 0 && (
          <Button type="link" onClick={onClickViewAllPhotos}>
            View all photos
          </Button>
        )}
      </AnimatedContainer>
    </AnimatedContainer>
  );
};

const SegmentedContainer = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
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

const DwellingInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 16px;
  gap: 32px;
`;

const DwellingLabelText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${Colours.GRAY_7};
`;

const DwellingInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 10px;

  & > img {
    filter: brightness(30%);
  }
`;

const DwellingInfoText = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${Colours.GRAY_10};
  padding-left: 4px;
`;

const PhotosContainerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const PhotoContainer = styled.div`
  position: relative;
  flex: 1;
  height: 200px;
  max-width: 300px;
  margin-right: 8px;

  img {
    border-radius: 4px;
    object-fit: cover;
  }
`;

export default PropertyDetails;
