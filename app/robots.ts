import type { MetadataRoute } from 'next';

const SITE_URL = 'https://rent.islandcars.pro';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/en/login',
          '/es/login',
          '/en/register',
          '/es/register',
          '/en/profile',
          '/es/profile',
          '/en/profile/',
          '/es/profile/',
          '/en/reset-password',
          '/es/reset-password',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
