export interface Job {
  id: string;
  title: string;
  description?: string;
  category?: { name: string; icon?: string; } | string;
  subcategory?: string;
  employer_id?: string;
  employer?: { name: string; };
  employer_name?: string;
  employer_phone?: string;
  location: string;
  salary?: string;
  salary_min?: number;
  salary_max?: number;
  salary_period?: 'hour' | 'day' | 'week' | 'month' | 'project';
  status?: 'posted' | 'applied' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'open';
  applicant_id?: string;
  applicant_name?: string;
  applicant_phone?: string;
  created_at: string;
  updated_at?: string;
  posted_at?: string;
  urgent?: boolean;
  requirements?: string[];
  benefits?: string[];
  total_positions?: number;
  accepted_at?: string;
  completed_at?: string;
  rating_employer?: number;
  rating_worker?: number;
  review_employer?: string;
  review_worker?: string;
  company?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  message?: string;
}

export interface Rating {
  id: string;
  job_id: string;
  rater_id: string;
  rated_id: string;
  rating: number;
  review: string;
  created_at: string;
}
