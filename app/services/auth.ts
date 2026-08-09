import { supabase } from '../lib/supabase';
import type { RegisterValues } from '@/app/components/Auth/RegisterForm/validationSchema';
import type { LoginValues } from '@/app/components/Auth/LoginForm/validationSchema';
import type { Profile } from '@/app/types/profile';

export type ProfileUpdateValues = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  address?: string;
  licenseNumber?: string;
  documentType?: string;
  documentNumber?: string;
};

export async function register(values: RegisterValues) {
  const {
    email,
    password,

    firstName,
    lastName,
    phone,
    dateOfBirth,
    language,
    country,
    city,
    address,
    licenseNumber,
    documentType,
    documentNumber,
  } = values;

  //---------------------------------------
  // Создаем пользователя
  //---------------------------------------

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error('User was not created');
  }

  //---------------------------------------
  // Создаем профиль
  //---------------------------------------

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,

    first_name: firstName,
    last_name: lastName,

    phone,

    date_of_birth: dateOfBirth,

    language,

    country,
    city,
    address,

    license_number: licenseNumber,

    document_type: documentType,
    document_number: documentNumber,

    role: 'customer',
    created_by_admin: false,
    is_verified: false,
  });

  if (profileError) throw profileError;

  return data.user;
}

export async function login(values: LoginValues) {
  const { email, password } = values;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // console.log('LOGIN USER:', data.user);
  // console.log('SESSION:', data.session);

  if (error) throw error;

  if (!data.user) {
    throw new Error('User not found.');
  }

  return data.user;
}

export async function updateProfile(userId: string, values: ProfileUpdateValues) {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (values.firstName !== undefined) payload.first_name = values.firstName;
  if (values.lastName !== undefined) payload.last_name = values.lastName;
  if (values.phone !== undefined) payload.phone = values.phone;
  if (values.dateOfBirth !== undefined) payload.date_of_birth = values.dateOfBirth;
  if (values.country !== undefined) payload.country = values.country;
  if (values.city !== undefined) payload.city = values.city;
  if (values.address !== undefined) payload.address = values.address;
  if (values.licenseNumber !== undefined) payload.license_number = values.licenseNumber;
  if (values.documentType !== undefined) payload.document_type = values.documentType;
  if (values.documentNumber !== undefined) payload.document_number = values.documentNumber;

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  return data as Profile;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
