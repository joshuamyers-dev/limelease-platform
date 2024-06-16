import { RefObject, useEffect, useState, useRef } from 'react';

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useElementOnScreen(options: Options): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);

      if (entry.isIntersecting && options.freezeOnceVisible) {
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
}

export default useElementOnScreen;
