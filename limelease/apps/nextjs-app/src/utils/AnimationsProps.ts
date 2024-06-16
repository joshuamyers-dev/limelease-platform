export const cardAnimationProps = {
  initial: { opacity: 0, y: +10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
  exit: { opacity: 0, y: -10 },
};

export const fadeInOutProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};
