import { useQuery } from "@tanstack/react-query";
import { PROFESSIONALS } from "@/data/mocks";
import type { Professional } from "@/types";

export interface ProfessionalsFilters {
  categoryId?: string;
  query?: string;
  sort?: "rating" | "price-asc" | "price-desc" | "distance";
  verifiedOnly?: boolean;
}

const fetchProfessionals = async (
  filters: ProfessionalsFilters = {},
): Promise<Professional[]> => {
  await new Promise((r) => setTimeout(r, 120));
  let list = [...PROFESSIONALS];

  if (filters.categoryId) {
    list = list.filter((p) => p.category === filters.categoryId);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }
  if (filters.verifiedOnly) {
    list = list.filter((p) => p.verified);
  }
  if (filters.sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === "price-asc") {
    list.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (filters.sort === "price-desc") {
    list.sort((a, b) => b.priceFrom - a.priceFrom);
  } else if (filters.sort === "distance") {
    list.sort((a, b) => a.distanceKm - b.distanceKm);
  }
  return list;
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
      await new Promise((r) => setTimeout(r, 100));
      return PROFESSIONALS.find((p) => p.id === id);
    },
    enabled: !!id,
  });
