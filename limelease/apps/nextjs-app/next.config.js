module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    minimumCacheTTL: 86400,
    domains: ['s3.ap-southeast-2.amazonaws.com', 'images.wsj.net', 'katypropertymanagement.com'],
  },
  pageExtensions: ['page.tsx'],
  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-form',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    'rc-segmented',
    'compress.js',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lodash', 'styled-components', 'phoenix', 'framer-motion', 'crypto-hash', 'dayjs', 'react-image-lightbox'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};
