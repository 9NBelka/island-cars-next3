'use client';

import { useCallback, useEffect, useState } from 'react';

import Hero from '../Hero/Hero';
import CarList from '../Cars/CarList/CarList';

import type { Lang } from '../../i18n/types';
import type { Car } from '../../types/car';
import type { SearchCarsParams } from '../../types/search';
import type { CarAvailability } from '../../types/carAvailability';
import type { SearchFormState } from '../../types/searchForm';

import { searchCars } from '../../services/searchCars';
import { saveSearch, loadSearch } from '../../services/searchStorage';
import { DEFAULT_FORM } from '../../constants/search';

function searchParamsToForm(params: SearchCarsParams): SearchFormState {
  return {
    fromPlace: params.pickupPlace,
    toPlace: params.returnPlace,
    fromDate: params.startAt.slice(0, 10),
    fromTime: params.startAt.slice(11, 16),
    toDate: params.endAt.slice(0, 10),
    toTime: params.endAt.slice(11, 16),
  };
}

export default function HomePage({ lang }: { lang: Lang }) {
  const [cars, setCars] = useState<(Car & { availability: CarAvailability })[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SearchFormState>(DEFAULT_FORM);
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchCarsParams | null>(null);

  const runSearch = useCallback(async (params: SearchCarsParams) => {
    setLoading(true);
    setCurrentSearchParams(params);

    try {
      const result = await searchCars(params);
      setCars(result);
      saveSearch(params);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Восстанавливаем сохранённый поиск один раз после монтирования
  useEffect(() => {
    const saved = loadSearch();
    if (!saved) return;

    // Откладываем setState — React больше не считает это каскадом
    queueMicrotask(() => {
      setForm(searchParamsToForm(saved));
      setCurrentSearchParams(saved);
      void runSearch(saved);
    });
  }, [runSearch]);

  return (
    <>
      <Hero lang={lang} form={form} onFormChange={setForm} onSearch={runSearch} />
      <CarList cars={cars} loading={loading} searchParams={currentSearchParams} lang={lang} />
    </>
  );
}
