// web/src/services/quotes.service.ts
import { http } from "../lib/http";
import type { Quote } from "../types/quote";

export interface QuoteListResponse {
  count: number;
  page: number;
  size: number;
  items: Quote[];
}

export async function getQuotes(
  page: number = 1,
  size: number = 100,
  statusFilter?: "draft" | "sent" | "pending" | "responded" | "approved" | "rejected"
): Promise<Quote[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (statusFilter) {
    params.append("status_filter", statusFilter);
  }

  const res = await http.get<QuoteListResponse>(`/quotes?${params.toString()}`);
  return res.data.items;
}

export async function createQuote(data: {
  title: string;
  amount: number;
  project_id?: number;
}): Promise<Quote> {
  const res = await http.post<Quote>("/quotes", data);
  return res.data;
}

export async function updateQuote(id: number, data: Partial<Quote>): Promise<Quote> {
  const res = await http.put<Quote>(`/quotes/${id}`, data);
  return res.data;
}

export async function deleteQuote(id: number): Promise<{ message: string }> {
  const res = await http.delete<{ message: string }>(`/quotes/${id}`);
  return res.data;
}

export async function approveQuote(id: number): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/approve`, {});
  return res.data;
}

export async function rejectQuote(id: number, reason?: string): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/reject`, { reason });
  return res.data;
}
