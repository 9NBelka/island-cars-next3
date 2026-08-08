import en from './locales/en.json';
import es from './locales/es.json';
import type { Lang } from './types';

const dictionaries = { en, es };
export type Dictionary = typeof en;
export type TFunction = (key: string) => string;

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function getT(lang: Lang) {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG_FALLBACK];
  return (key: string): string => {
    const value = getNestedValue(dict, key);
    return typeof value === 'string' ? value : key;
  };
}

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LANG_FALLBACK];
}

const DEFAULT_LANG_FALLBACK: Lang = 'en';
