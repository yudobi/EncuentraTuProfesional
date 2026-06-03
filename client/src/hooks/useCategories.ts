import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/data/mocks";
import type { Category } from "@/types";

const fetchCategories = async (): Promise<Category[]> => {
  await new Promise((r) => setTimeout(r, 80));
  return CATEGORIES;
};

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

export const useCategory = (id: string | undefined) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: async () => CATEGORIES.find((c) => c.id === id),
    enabled: !!id,
  });
