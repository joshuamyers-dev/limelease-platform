import { useState, useEffect } from 'react';

function getWindowDimensions(hasWindow: boolean) {
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions(hasWindow));

  const handleResize = () => {
    setWindowDimensions(getWindowDimensions(hasWindow));
  };

  useEffect(() => {
    if (hasWindow) {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}

export default useWindowDimensions;
