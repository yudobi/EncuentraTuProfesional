import { useQuery } from "@tanstack/react-query";
import { REVIEWS } from "@/data/mocks";

export const useReviewsByPro = (proId: string | undefined) =>
  useQuery({
    queryKey: ["reviews", proId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return REVIEWS.filter((r) => r.proId === proId);
    },
    enabled: !!proId,
  });

export const useAllReviews = () =>
  useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => REVIEWS,
  });
