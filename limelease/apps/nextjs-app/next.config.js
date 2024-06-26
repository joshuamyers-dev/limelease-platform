module.exports = {
  output: 'standalone',
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
    optimizePackageImports: ['lodash', 'phoenix', 'framer-motion', 'crypto-hash', 'dayjs', 'react-image-lightbox'],
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
