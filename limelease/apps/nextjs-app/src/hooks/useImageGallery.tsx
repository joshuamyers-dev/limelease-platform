import { Maybe } from '@graphql/generated';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';

const Lightbox = dynamic(() => import('react-image-lightbox'));

export const useImageGallery = (imageUrls: (Maybe<string> | undefined)[]) => {
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const validImageUrls = imageUrls.filter((url): url is string => url !== null && url !== undefined);

  const onClickViewAllPhotos = useCallback(() => {
    setImageGalleryOpen(true);
  }, []);

  const onCloseRequest = useCallback(() => {
    setImageGalleryOpen(false);
  }, []);

  const onMovePrevRequest = useCallback(() => {
    setPhotoIndex((prevIndex) => (prevIndex + imageUrls.length - 1) % imageUrls.length);
  }, [imageUrls.length]);

  const onMoveNextRequest = useCallback(() => {
    setPhotoIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const ImageGallery =
    imageGalleryOpen && validImageUrls.length > 0 ? (
      <Lightbox
        mainSrc={validImageUrls[photoIndex]}
        nextSrc={validImageUrls[(photoIndex + 1) % validImageUrls.length]}
        prevSrc={validImageUrls[(photoIndex + validImageUrls.length - 1) % validImageUrls.length]}
        onCloseRequest={onCloseRequest}
        onMovePrevRequest={onMovePrevRequest}
        onMoveNextRequest={onMoveNextRequest}
      />
    ) : null;

  return { ImageGallery, onClickViewAllPhotos };
};
