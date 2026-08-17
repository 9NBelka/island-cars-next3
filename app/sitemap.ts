import type { MetadataRoute } from 'next';

import { LANGS } from './i18n/types';

const SITE_URL = 'https://rent.islandcars.pro';

const PUBLIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}[] = [
  { path: '', priority: 1, changeFrequency: 'daily' },
  // { path: '/questions', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/rules', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contacts', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap(({ path, priority, changeFrequency }) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    })),
  );
}
