import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/', destination: '/pt-BR', permanent: false },
      ...['about', 'certifications', 'projects', 'project', 'blog', 'contact'].map((route) => ({
        source: '/' + route + '/:rest*',
        destination: '/pt-BR/' + route + '/:rest*',
        permanent: false,
      })),
      { source: '/pt/:rest*', destination: '/pt-PT/:rest*', permanent: false },
    ];
  },
};

export default config;
