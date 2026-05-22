export type CategoryIconName =
  | "wrench"
  | "bolt"
  | "broom"
  | "brush"
  | "hammer"
  | "leaf"
  | "truck"
  | "snow"
  | "key"
  | "chip"
  | "scissors"
  | "book";

export interface Category {
  id: string;
  name: string;
  icon: CategoryIconName;
  count: number;
  hero: string;
}

export interface Professional {
  id: string;
  initials: string;
  name: string;
  handle: string;
  category: string;
  title: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  responseMin: number;
  verified: boolean;
  pro: boolean;
  priceFrom: number;
  badges: string[];
  bio: string;
  skills: string[];
  gallery: string[];
  contact: { whatsapp: boolean; phone: boolean };
  schedule: string[];
  pendingEdits: boolean;
}

export interface Review {
  id: string;
  proId: string;
  orderId: string;
  user: string;
  initials: string;
  rating: number;
  daysAgo: number;
  text: string;
  proReply: string | null;
  flagged: boolean;
}

export interface ChatMessage {
  from: "user" | "pro" | "system";
  t: string;
  text: string;
}

export interface AdminNotification {
  id: string;
  type: "signup" | "edit" | "flag" | "chat" | "order";
  text: string;
  time: string;
  urgent: boolean;
}

export type Actor =
  | "user_anon"
  | "user_logged"
  | "pro"
  | "admin"
  | "super_admin";
