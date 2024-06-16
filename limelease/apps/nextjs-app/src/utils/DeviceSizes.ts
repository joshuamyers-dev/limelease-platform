export const screenSizes = {
  mobile: '480px',
  tablet: '960px',
  laptop: '1025px',
  desktop: '1280px',
};

export const deviceSize = {
  mobile: `(max-width: ${screenSizes.mobile})`,
  tablet: `(max-width: ${screenSizes.tablet})`,
  laptop: `(min-width: ${screenSizes.laptop})`,
  desktop: `(max-width: ${screenSizes.desktop})`,
};
