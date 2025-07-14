export interface Wage {
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