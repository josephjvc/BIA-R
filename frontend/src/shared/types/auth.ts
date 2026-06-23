export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  organizationName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
