import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Professional } from "@/types";

export interface UpdateProfileInput {
  business_name?: string;
  description?: string;
  headline?: string;
  location?: string;
  price_from?: string | number;
  response_time_min?: number;
  whatsapp_link?: string;
  contact_phone?: string;
  skills?: string[];
  schedule?: string[];
  categories?: string[];
}

export interface ProfessionalsFilters {
  categoryId?: string;
  query?: string;
  sort?: "rating" | "price-asc" | "price-desc" | "distance";
  verifiedOnly?: boolean;
}

const fetchProfessionals = async (
  filters: ProfessionalsFilters = {},
): Promise<Professional[]> => {
  const params: Record<string, string> = {};
  if (filters.categoryId) params.category = filters.categoryId;
  if (filters.query) params.search = filters.query;
  if (filters.sort) params.ordering = filters.sort;
  if (filters.verifiedOnly) params.verified_only = "true";

  const { data } = await api.get<Professional[]>("/professionals/", { params });
  return data;
};

export const useProfessionals = (filters: ProfessionalsFilters = {}) =>
  useQuery({
    queryKey: ["professionals", filters],
    queryFn: () => fetchProfessionals(filters),
  });

export const useProfessional = (id: string | undefined) =>
  useQuery({
    queryKey: ["professional", id],
    queryFn: async () => {
      const { data } = await api.get<Professional>(`/professionals/${id}/`);
      return data;
    },
    enabled: !!id,
  });

export const useMyProfile = (enabled = true) =>
  useQuery({
    queryKey: ["professional", "me"],
    queryFn: async () => {
      const { data } = await api.get<Professional>("/professionals/me/");
      return data;
    },
    enabled,
    retry: false,
  });

export const useUpdateMyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const { data } = await api.put<Professional>("/professionals/me/", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["professional", "me"] });
      qc.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
};
