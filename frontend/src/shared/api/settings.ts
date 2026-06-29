import client from "./client";
import type { UserProfile, UpdateProfilePayload } from "../types/settings";

export function getProfile(): Promise<UserProfile> {
  return client.get("/api/users/me").then((r) => r.data);
}

export function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return client.put("/api/users/me", payload).then((r) => r.data);
}
