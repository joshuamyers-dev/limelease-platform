import ImagePlaceholder from '@components/ImagePlaceholder';
import LoadingSpinner from '@components/LoadingSpinner';
import { PropertyRequestPhoto } from '@graphql/generated';
import { useImageGallery } from '@hooks/useImageGallery';
import { deviceSize } from '@utils/DeviceSizes';
import { Button } from 'antd';
import Image from 'next/image';
import { useMemo } from 'react';
import styled from 'styled-components';

interface RequestDetailPhotosProps {
  photos: PropertyRequestPhoto[];
}

const RequestDetailPhotos: React.FC<RequestDetailPhotosProps> = ({ photos }) => {
  const imageUrls = useMemo(() => {
    return photos ? photos.map((photo) => photo.staticMedia.url) : [];
  }, [photos]);

  const { ImageGallery, onClickViewAllPhotos } = useImageGallery(imageUrls);

  return (
    <Container>
      <Wrapper>
        {ImageGallery}
        {photos?.slice(0, 3)?.map((photo) => (
          <PhotoImageContainer>
            <PhotoImage src={photo.staticMedia.url} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
          </PhotoImageContainer>
        ))}
      </Wrapper>

      {photos?.length > 0 && (
        <ViewAllContainer>
          <Button type="link" onClick={onClickViewAllPhotos}>
            View all photos
          </Button>
        </ViewAllContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-left: 120px;

  @media ${deviceSize.mobile} {
    margin-left: 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
`;

const PhotoImageContainer = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  width: 220px;
  height: 200px;
  border-radius: 4px;
  margin-right: 8px;

  @media ${deviceSize.mobile} {
    width: 100%;
  }
`;

const PhotoImage = styled(ImagePlaceholder)`
  object-fit: cover;
  border-radius: 4px;

  @media ${deviceSize.mobile} {
    width: 100%;
  }
`;

const ViewAllContainer = styled.div`
  margin-top: 20px;
`;

export default RequestDetailPhotos;
