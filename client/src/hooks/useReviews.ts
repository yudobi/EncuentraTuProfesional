import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Review } from "@/types";

export const useReviewsByPro = (proId: string | undefined) =>
  useQuery({
    queryKey: ["reviews", proId],
    queryFn: async () => {
      const { data } = await api.get<Review[]>("/reviews/", {
        params: { professional: proId },
      });
      return data;
    },
    enabled: !!proId,
  });

export const useAllReviews = () =>
  useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data } = await api.get<Review[]>("/reviews/");
      return data;
    },
  });

export interface CreateReviewInput {
  order_number: string;
  rating: number;
  text?: string;
}

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const { data } = await api.post<Review>("/reviews/", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useReplyReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { data } = await api.post<Review>(`/reviews/${id}/reply/`, { text });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export interface CreatePlatformReviewInput {
  rating: number;
  text?: string;
}

export const useCreatePlatformReview = () =>
  useMutation({
    mutationFn: async (input: CreatePlatformReviewInput) => {
      const { data } = await api.post("/reviews/platform/", input);
      return data;
    },
  });
