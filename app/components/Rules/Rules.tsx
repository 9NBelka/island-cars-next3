import type { JSX } from 'react';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';

import styles from './Rules.module.scss';

type Props = {
  lang: Lang;
};

const SECTION_KEYS = [
  'subject',
  'obligations',
  'unauthorizedUse',
  'term',
  'other',
  'dataProcessing',
] as const;

// Простой парсер: строки, начинающиеся с "- ", группируются в <ul>,
// остальные строки идут отдельными <p>. Разделитель между блоками — \n.
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

export default function Rules({ lang }: Props) {
  const t = getT(lang);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('rules.title')}</h1>

        <div className={styles.highlights}>{renderBody(t('rules.highlights'))}</div>

        {SECTION_KEYS.map((key) => (
          <div key={key} className={styles.section}>
            <h2 className={styles.sectionTitle}>{t(`rules.sections.${key}.title`)}</h2>
            {renderBody(t(`rules.sections.${key}.body`))}
          </div>
        ))}
      </div>
    </section>
  );
}
