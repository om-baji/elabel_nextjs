export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  phone_number?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<
  Omit<Profile, 'id' | 'email' | 'role' | 'created_at' | 'updated_at'>
>;

export type UserWithProfile = {
  id: string;
  email: string;
  profile: Profile;
};
