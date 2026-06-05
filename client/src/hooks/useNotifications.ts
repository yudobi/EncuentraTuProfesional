import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AppNotification {
  id: string;
  type: "signup" | "edit" | "flag" | "chat" | "order" | "approval" | "review";
  text: string;
  link: string;
  urgent: boolean;
  is_read: boolean;
  time: string;
  created_at: string;
}

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get<AppNotification[]>("/notifications/");
      return data;
    },
    enabled,
  });

export const useUnreadCount = (enabled = true) =>
  useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>("/notifications/unread-count/");
      return data.count;
    },
    enabled,
    refetchInterval: 60_000,
  });

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/notifications/read-all/", {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/notifications/${id}/read/`, {});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};
