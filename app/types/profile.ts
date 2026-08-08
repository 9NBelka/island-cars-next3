export type Profile = {
  id: string;

  first_name: string | null;
  last_name: string | null;

  phone: string | null;

  date_of_birth: string | null;

  language: string | null;

  country: string | null;
  city: string | null;
  address: string | null;

  license_number: string | null;

  document_type: string | null;
  document_number: string | null;

  avatar_url: string | null;

  role: string;

  created_by_admin: boolean;
  is_verified: boolean;

  created_at: string;
  updated_at: string;
};
