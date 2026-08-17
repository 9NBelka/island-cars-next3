import type { Metadata } from 'next';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';

const SITE_URL = 'https://rent.islandcars.pro';
const SITE_NAME = 'Island Cars';
const DEFAULT_OG_IMAGE = '/imageMeta.jpg';

export type MetaPageKey = 'home' | 'rules' | 'privacy' | 'contacts';

type BuildMetadataOptions = {
  noindex?: boolean;
  ogType?: 'website' | 'article';
};

export async function buildMetadata(
  lang: Lang,
  page: MetaPageKey,
  path: string,
  options: BuildMetadataOptions = {},
): Promise<Metadata> {
  const t = getT(lang);
  const { noindex = false, ogType = 'website' } = options;

  const title = t(`meta.${page}.title`);
  const description = t(`meta.${page}.description`);
  const ogTitle = t(`meta.${page}.ogTitle`);
  const ogDescription = t(`meta.${page}.ogDescription`);
  const keywords = page === 'home' ? t('meta.home.keywords') : undefined;

  const url = `${SITE_URL}/${lang}${path}`;
  const enPath = `/en${path}`;
  const esPath = `/es${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: {
        en: enPath,
        es: esPath,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Car rental in Costa Blanca, Spain`,
        },
      ],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
