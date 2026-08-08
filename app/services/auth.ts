import { supabase } from '../lib/supabase';
import type { RegisterValues } from '@/app/components/Auth/RegisterForm/validationSchema';
import type { LoginValues } from '@/app/components/Auth/LoginForm/validationSchema';

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
