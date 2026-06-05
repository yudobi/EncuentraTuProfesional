import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/types";

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories/");
  return data;
};

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

export const useCategory = (id: string | undefined) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data } = await api.get<Category>(`/categories/${id}/`);
      return data;
    },
    enabled: !!id,
  });
