import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

import imagePlaceholder from '@public/images/image-placeholder.png';

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  [x: string]: any;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ src, alt, width, height, ...rest }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded && !src) {
      setImageLoaded(false);
    }
  }, [imageLoaded]);

  return (
    <ImageContainer>
      <Image src={src} alt={alt} width={width} height={height} priority onLoad={() => setImageLoaded(true)} {...rest} />
      <AnimatePresence mode="wait">
        {!imageLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Image src={imagePlaceholder} alt="Loading..." width={width} height={height} {...rest} />
          </motion.div>
        )}
      </AnimatePresence>
    </ImageContainer>
  );
};

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default ImagePlaceholder;
