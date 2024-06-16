import { useEffect, useState, useRef, RefObject } from 'react';

function useInfiniteScroll<T>(callback: () => void): RefObject<T> {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<T>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current as Element);
    }
  }, [callback]);

  return lastElementRef;
}

export default useInfiniteScroll;
