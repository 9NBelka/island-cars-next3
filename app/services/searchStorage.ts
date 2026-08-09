import type { SearchCarsParams } from '../types/search';
import { SEARCH_STORAGE_KEY } from '../constants/storage';

type SearchStorage = {
  form: SearchCarsParams;
  searchedAt: string;
};

// Храним поиск максимум 4 часа
const SEARCH_TTL = 4 * 60 * 60 * 1000;

export function saveSearch(params: SearchCarsParams) {
  const data: SearchStorage = {
    form: params,
    searchedAt: new Date().toISOString(),
  };

  localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(data));
}

export function loadSearch(): SearchCarsParams | null {
  const saved = localStorage.getItem(SEARCH_STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    const parsed: SearchStorage = JSON.parse(saved);

    // Проверяем дату сохранения
    const searchedAt = new Date(parsed.searchedAt).getTime();

    // Если дата некорректная — удаляем запись
    if (Number.isNaN(searchedAt)) {
      clearSearch();
      return null;
    }

    // Если прошло больше 4 часов — очищаем поиск
    const isExpired = Date.now() - searchedAt > SEARCH_TTL;

    if (isExpired) {
      clearSearch();
      return null;
    }

    return parsed.form;
  } catch {
    // Если localStorage поврежден или JSON некорректный
    clearSearch();
    return null;
  }
}

export function clearSearch() {
  localStorage.removeItem(SEARCH_STORAGE_KEY);
}
