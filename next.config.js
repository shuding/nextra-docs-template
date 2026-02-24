const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
});

module.exports = {
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  // basePath: '/cardinal-docs',
  async redirects() {
    return [
      {
        source: '/agent-builder/:path*',
        destination: '/vibeshield/:path*',
        permanent: true,
      },
      {
        source: '/agent-builder',
        destination: '/vibeshield',
        permanent: true,
      },
    ];
  },
};
