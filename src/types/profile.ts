export interface Wage {
  id?: string;
  amount?: number;
  period?: string;
  category_id?: string;
  subcategory_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  rate: string | number;
  unit: 'fixed' | 'per_hour' | 'per_day';
}

export type AvailabilityStatus = 'available' | 'busy' | 'offline' | 'online';

export interface ProfileInfoData {
  name?: string;
  email?: string;
  location?: string;
  bio?: string;
  phone?: string;
  experience?: string;
}