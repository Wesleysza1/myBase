/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  },
  async headers() {
    return [
      {
        // Aqui você pode definir um path genérico como "/(.*)" para todas as rotas
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(self), microphone=()'
          },
        ],
      },
      // {
      //   source: '/public/(.*)',
      //   headers: [
      //     {
      //       key: 'Content-Security-Policy',
      //       value: "default-src 'self'; script-src 'self'; object-src 'none';"
      //     },
      //   ],
      // },
    ];
  },
};

export default nextConfig;