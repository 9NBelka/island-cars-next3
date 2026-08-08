import type { SearchCarsParams } from '../types/search';
import { SEARCH_STORAGE_KEY } from '../constants/storage';

type SearchStorage = {
  form: SearchCarsParams;
  searchedAt: string;
};

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

    return parsed.form;
  } catch {
    return null;
  }
}

export function clearSearch() {
  localStorage.removeItem(SEARCH_STORAGE_KEY);
}
