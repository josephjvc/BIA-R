import client from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return client.post("/api/auth/register", payload).then((r) => r.data);
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return client.post("/api/auth/login", payload).then((r) => r.data);
}
