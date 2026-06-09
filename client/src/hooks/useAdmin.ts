import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AdminStats {
  pending_professionals: number;
  flagged_reviews: number;
  total_orders: number;
  orders_today: number;
  active_professionals: number;
  total_clients: number;
}

export interface AdminProfessional {
  id: string;
  name: string;
  business_name: string;
  email: string;
  category: string | null;
  approval_status: "pending" | "approved" | "rejected" | "changes_requested";
  approval_notes: string;
  is_approved: boolean;
  submitted_at: string;
}

export interface AdminReview {
  id: string;
  proId: string;
  professional_name: string;
  orderId: string;
  user: string;
  initials: string;
  rating: number;
  daysAgo: number;
  text: string;
  proReply: string | null;
  flagged: boolean;
}

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>("/admin/stats/");
      return data;
    },
  });

export const usePendingProfessionals = () =>
  useQuery({
    queryKey: ["admin", "pending-pros"],
    queryFn: async () => {
      const { data } = await api.get<AdminProfessional[]>("/admin/professionals/pending/");
      return data;
    },
  });

export const useAdminReviews = (flaggedOnly = false) =>
  useQuery({
    queryKey: ["admin", "reviews", flaggedOnly],
    queryFn: async () => {
      const { data } = await api.get<AdminReview[]>("/admin/reviews/", {
        params: flaggedOnly ? { flagged: "true" } : undefined,
      });
      return data;
    },
  });

const useAdminInvalidate = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["professionals"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };
};

export const useApproveProfessional = () => {
  const invalidate = useAdminInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/professionals/${id}/approve/`, {});
      return data;
    },
    onSuccess: invalidate,
  });
};

export const useRejectProfessional = () => {
  const invalidate = useAdminInvalidate();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { data } = await api.post(`/admin/professionals/${id}/reject/`, { notes });
      return data;
    },
    onSuccess: invalidate,
  });
};

export const useApproveReview = () => {
  const invalidate = useAdminInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/reviews/${id}/approve/`, {});
      return data;
    },
    onSuccess: invalidate,
  });
};

export const useDeleteReview = () => {
  const invalidate = useAdminInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/reviews/${id}/`);
    },
    onSuccess: invalidate,
  });
};
