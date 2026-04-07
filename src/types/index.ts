export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  credits: number;
  plan: string;
  role: 'admin' | 'user';
  last_bonus_date: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  last_ad_date?: string | null;
  daily_ads_watched?: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  type: string;
  thumbnail: string | null;
  content: any;
  created_at?: string;
  updated_at?: string;
}

export interface AppConfig {
  bonus_enabled: boolean;
}

export interface SubscriptionPlan {
  plan_id: string;
  name: string;
  price: number;
  credits: number;
  currency_symbol?: string;
  subtitle?: string;
  features?: string[];
}

export interface PlanBonus {
  plan_id: string;
  daily_bonus: number;
}
