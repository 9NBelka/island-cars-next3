import type { JSX } from 'react';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';

import styles from './Privacy.module.scss';

type Props = {
  lang: Lang;
};

const SECTION_KEYS = [
  'controller',
  'dataCollected',
  'purposesLegalBasis',
  'cookiesLocalStorage',
  'recipients',
  'retention',
  'rights',
  'transfers',
  'changes',
] as const;

// Строки, начинающиеся с "- ", группируются в <ul>, остальные — в <p>.
function renderBody(text: string): JSX.Element[] {
  const lines = text.split('\n').filter(Boolean);

  const blocks: JSX.Element[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length === 0) return;

    blocks.push(
      <ul key={`ul-${key++}`} className={styles.list}>
        {currentList.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>,
    );

    currentList = [];
  };

  lines.forEach((line) => {
    if (line.startsWith('- ')) {
      currentList.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p key={`p-${key++}`} className={styles.paragraph}>
          {line}
        </p>,
      );
    }
  });

  flushList();

  return blocks;
}

export default function Privacy({ lang }: Props) {
  const t = getT(lang);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('privacy.title')}</h1>
        <p className={styles.lastUpdated}>{t('privacy.lastUpdated')}</p>

        {SECTION_KEYS.map((key) => (
          <div key={key} className={styles.section}>
            <h2 className={styles.sectionTitle}>{t(`privacy.sections.${key}.title`)}</h2>
            {renderBody(t(`privacy.sections.${key}.body`))}
          </div>
        ))}
      </div>
    </section>
  );
}
