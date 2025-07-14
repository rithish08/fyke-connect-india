export interface Wage {
  rate: string | number;
  unit: string;
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