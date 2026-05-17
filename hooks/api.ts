"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────────────────────

export type Booking = {
  id: number;
  bookingRef: string;
  clientId: number | null;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  eventType: string;
  eventDate: string;
  endDate: string | null;
  venue: string;
  guestCount: number;
  notes: string | null;
  adminNote: string | null;
  status: string;
  estimatedValue: number | null;
  submittedAt: string;
};

export type Client = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  totalBookings: number;
  createdAt: string;
};

export type ClientWithHistory = Client & { bookings: Booking[] };

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  totalQuantity: number;
  availableQuantity: number;
  status: string;
  dailyRate: number;
  createdAt: string;
};

export type DashboardSummary = {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  upcomingThisMonth: number;
  totalClients: number;
  totalInventoryItems: number;
  availableInventoryItems: number;
  recentBookings: Booking[];
};

export type CalendarEvent = {
  id: number;
  bookingRef: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  endDate: string | null;
  status: string;
};

export type EventPackage = {
  id: string;
  name: string;
  description: string;
  eventTypes: string[];
  startingFrom: number;
  highlight: boolean;
  includes: string[];
};

export type PublicEquipmentItem = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  dailyRate: number;
  availableQuantity: number;
  status: string;
};

export type AuthResult = { username: string; isAdmin: boolean };

// Re-export BookingStatus type for compatibility
export type BookingStatus = "pending" | "approved" | "rejected";

// ── Query key factories ─────────────────────────────────────────────────────

export const getGetMeQueryKey = () => ["/api/auth/me"] as const;
export const getGetDashboardSummaryQueryKey = () => ["/api/dashboard/summary"] as const;
export const getListBookingsQueryKey = (params?: { status?: string; clientId?: number }) =>
  ["/api/bookings", params] as const;
export const getGetBookingQueryKey = (id: number) => ["/api/bookings", id] as const;
export const getGetBookingCalendarQueryKey = (params?: { month?: number; year?: number }) =>
  ["/api/bookings/calendar", params] as const;
export const getListClientsQueryKey = () => ["/api/clients"] as const;
export const getGetClientQueryKey = (id: number) => ["/api/clients", id] as const;
export const getListInventoryQueryKey = () => ["/api/inventory"] as const;
export const getGetPublicEquipmentQueryKey = () => ["/api/public/equipment"] as const;
export const getGetPackagesQueryKey = () => ["/api/public/packages"] as const;
// Alias for packages query key
export const getGetPublicPackagesQueryKey = getGetPackagesQueryKey;

// ── Auth hooks ──────────────────────────────────────────────────────────────

export function useGetMe(options?: { query?: { retry?: boolean; queryKey?: readonly unknown[] } }) {
  return useQuery<AuthResult>({
    queryKey: options?.query?.queryKey ?? getGetMeQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: options?.query?.retry ?? false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<AuthResult, Error, { data: { username: string; password: string } }>({
    mutationFn: async ({ data }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetMeQueryKey() }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetMeQueryKey() }),
  });
}

// ── Booking hooks ───────────────────────────────────────────────────────────

export function useCreateBooking() {
  return useMutation<Booking, Error, { data: Partial<Booking> }>({
    mutationFn: async ({ data }) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
  });
}

export function useListBookings(
  params?: { status?: string; clientId?: number },
  options?: { query?: { queryKey?: readonly unknown[] } },
) {
  return useQuery<Booking[]>({
    queryKey: options?.query?.queryKey ?? getListBookingsQueryKey(params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.status) search.set("status", params.status);
      if (params?.clientId) search.set("clientId", String(params.clientId));
      const res = await fetch(`/api/bookings?${search}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });
}

export function useGetBooking(
  id: number,
  options?: { query?: { queryKey?: readonly unknown[]; enabled?: boolean } },
) {
  return useQuery<Booking>({
    queryKey: options?.query?.queryKey ?? getGetBookingQueryKey(id),
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
    enabled: options?.query?.enabled !== undefined ? options.query.enabled : !!id,
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation<Booking, Error, { id: number; data: Partial<Booking> }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
      qc.invalidateQueries({ queryKey: getListBookingsQueryKey() });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation<
    Booking,
    Error,
    { id: number; data: { status: "approved" | "rejected"; adminNote?: string } }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
      qc.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    },
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      await fetch(`/api/bookings/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getListBookingsQueryKey() }),
  });
}

export function useGetBookingCalendar(
  params?: { month?: number; year?: number },
  options?: { query?: { queryKey?: readonly unknown[] } },
) {
  return useQuery<CalendarEvent[]>({
    queryKey: options?.query?.queryKey ?? getGetBookingCalendarQueryKey(params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.month) search.set("month", String(params.month));
      if (params?.year) search.set("year", String(params.year));
      const res = await fetch(`/api/bookings/calendar?${search}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch calendar");
      return res.json();
    },
  });
}

// ── Dashboard hooks ─────────────────────────────────────────────────────────

export function useGetDashboardSummary(options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<DashboardSummary>({
    queryKey: options?.query?.queryKey ?? getGetDashboardSummaryQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/dashboard/summary", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
  });
}

// ── Inventory hooks ─────────────────────────────────────────────────────────

export function useListInventory(options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<InventoryItem[]>({
    queryKey: options?.query?.queryKey ?? getListInventoryQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/inventory", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return res.json();
    },
  });
}

export function useCreateInventoryItem() {
  const qc = useQueryClient();
  return useMutation<InventoryItem, Error, { data: Partial<InventoryItem> }>({
    mutationFn: async ({ data }) => {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
  });
}

export function useUpdateInventoryItem() {
  const qc = useQueryClient();
  return useMutation<InventoryItem, Error, { id: number; data: Partial<InventoryItem> }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
  });
}

export function useDeleteInventoryItem() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      await fetch(`/api/inventory/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
  });
}

// ── Client hooks ────────────────────────────────────────────────────────────

export function useListClients(options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<Client[]>({
    queryKey: options?.query?.queryKey ?? getListClientsQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/clients", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch clients");
      return res.json();
    },
  });
}

export function useGetClient(id: number, options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<ClientWithHistory>({
    queryKey: options?.query?.queryKey ?? getGetClientQueryKey(id),
    queryFn: async () => {
      const res = await fetch(`/api/clients/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch client");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation<Client, Error, { id: number; data: Partial<Client> }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: getGetClientQueryKey(id) });
      qc.invalidateQueries({ queryKey: getListClientsQueryKey() });
    },
  });
}

// ── Public hooks ────────────────────────────────────────────────────────────

export function useGetPublicEquipment(options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<PublicEquipmentItem[]>({
    queryKey: options?.query?.queryKey ?? getGetPublicEquipmentQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/public/equipment");
      if (!res.ok) throw new Error("Failed to fetch equipment");
      return res.json();
    },
  });
}

export function useGetPublicPackages(options?: { query?: { queryKey?: readonly unknown[] } }) {
  return useQuery<EventPackage[]>({
    queryKey: options?.query?.queryKey ?? getGetPackagesQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/public/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    },
  });
}

// Alias for compatibility
export const useGetPackages = useGetPublicPackages;

export function useGetPublicAvailability(params?: { month?: number; year?: number }) {
  return useQuery<CalendarEvent[]>({
    queryKey: ["public-availability", params],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.month) search.set("month", String(params.month));
      if (params?.year) search.set("year", String(params.year));
      const res = await fetch(`/api/public/availability?${search}`);
      if (!res.ok) throw new Error("Failed to fetch availability");
      return res.json();
    },
  });
}
