import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Order } from "@/types";

export interface CreateOrderInput {
  professional: number | string;
  service_title: string;
  category?: string | null;
  description?: string;
  scheduled_for?: string | null;
  location?: string;
  agreed_price?: string | number | null;
  source?: "chat" | "direct";
}

export const useOrder = (orderNumber: string | undefined) =>
  useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${orderNumber}/`);
      return data;
    },
    enabled: !!orderNumber,
    retry: false,
  });

export const useMyOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get<Order[]>("/orders/");
      return data;
    },
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const { data } = await api.post<Order>("/orders/", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
