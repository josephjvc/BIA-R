export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  organizationName: string | null;
}

export interface UpdateProfilePayload {
  displayName?: string;
  email?: string;
}
