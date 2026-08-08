import { supabase } from '../lib/supabase';
import type { Car } from '../types/car';

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabase.from('cars').select('*').order('brand');

  if (error) {
    throw error;
  }

  return data as Car[];
}
