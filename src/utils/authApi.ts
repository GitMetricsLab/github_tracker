import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const authApi = axios.create({
  baseURL: `${backendUrl}/api/auth`,
  withCredentials: true,
});

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  provider?: string;
}

export interface OAuthProviders {
  google: boolean;
  github: boolean;
}

export async function fetchOAuthProviders(): Promise<OAuthProviders> {
  const { data } = await authApi.get<OAuthProviders>("/oauth/providers");
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await authApi.get<{ user: AuthUser }>("/me");
    return data.user;
  } catch {
    return null;
  }
}

export function getOAuthLoginUrl(provider: "google" | "github"): string {
  return `${backendUrl}/api/auth/${provider}`;
}
