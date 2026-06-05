import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth-storage";

export type UserRole = "client" | "professional" | "admin" | "super_admin";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole;
  is_verified: boolean;
  avatar: string | null;
  created_at?: string;
  client_profile?: {
    address: string | null;
    birth_date: string | null;
    favorite_categories_count: number;
    saved_professionals_count: number;
  };
  professional_profile?: {
    business_name: string;
    description: string;
    is_approved: boolean;
    rating_avg: string;
    total_reviews: number;
    contact_phone: string;
    whatsapp_link: string;
  };
}

interface TokenPair {
  access: string;
  refresh: string;
}

interface LoginResponse extends TokenPair {
  user: Pick<AuthUser, "id" | "email" | "username" | "first_name" | "last_name" | "role" | "is_verified">;
  role: UserRole;
}

interface RegisterResponse extends TokenPair {
  user: AuthUser;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  password2: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

const ME_KEY = ["auth", "me"] as const;

export const useMe = () =>
  useQuery({
    queryKey: ME_KEY,
    queryFn: async (): Promise<AuthUser | null> => {
      if (!authStorage.getAccess()) return null;
      const { data } = await api.get<AuthUser>("/auth/me/");
      return data;
    },
    staleTime: 1000 * 60,
    retry: false,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput): Promise<LoginResponse> => {
      const { data } = await api.post<LoginResponse>("/auth/login/", input);
      return data;
    },
    onSuccess: (data) => {
      authStorage.set(data.access, data.refresh);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<RegisterResponse> => {
      const { data } = await api.post<RegisterResponse>("/auth/register/", input);
      return data;
    },
    onSuccess: (data) => {
      authStorage.set(data.access, data.refresh);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refresh = authStorage.getRefresh();
      if (refresh) {
        try {
          await api.post("/auth/logout/", { refresh });
        } catch {
          // Si el refresh ya está invalidado el servidor responde 400; igual limpiamos sesión local.
        }
      }
    },
    onSettled: () => {
      authStorage.clear();
      qc.setQueryData(ME_KEY, null);
      qc.invalidateQueries({ queryKey: ME_KEY });
    },
  });
};

export const extractApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      if ("error" in data && typeof data.error === "string") return data.error;
      if ("detail" in data && typeof data.detail === "string") return data.detail;
      const first = Object.values(data as Record<string, unknown>)[0];
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
      if (typeof first === "string") return first;
    }
    return error.message;
  }
  return "Error inesperado. Intenta de nuevo.";
};
