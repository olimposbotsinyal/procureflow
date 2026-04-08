// Quote API Service
import { http } from "../lib/http";

export interface Quote {
  id: number;
  project_id: number;
  created_by_id: number;
  title: string;
  description?: string;
  amount?: number; // Backward compat
  total_amount?: number; // Backend dönerseçiliyor
  status: "DRAFT" | "SENT" | "PENDING" | "RESPONDED" | "APPROVED" | "REJECTED" | "draft" | "submitted" | "approved" | "rejected";
  company_name: string;
  company_contact_name: string;
  company_contact_phone: string;
  company_contact_email: string;
  currency?: string;
  version?: number;
  transition_reason?: string;
  created_at: string;
  updated_at?: string;
  sent_at?: string;
  deadline?: string;
  is_active?: boolean;
  items?: Array<{
    id: number;
    quote_id: number;
    line_number: string;
    category_code: string;
    category_name: string;
    description: string;
    group_key?: string;
    is_group_header?: boolean;
    unit: string;
    quantity: number;
    unit_price: number;
    vat_rate?: number;
    total_price: number;
    notes?: string;
  }>;
}

export interface QuoteListResponse {
  items: Quote[];
  total: number;
  page: number;
  size: number;
}

export interface CreateQuoteRequest {
  title: string;
  description?: string;
  project_id: number;
  department_id?: number;
  assigned_to_id?: number;
  company_name: string;
  company_contact_name: string;
  company_contact_phone: string;
  company_contact_email: string;
  amount?: number;
}

export interface QuoteItemPayload {
  line_number: string;
  category_code: string;
  category_name: string;
  description: string;
  group_key?: string;
  is_group_header?: boolean;
  unit: string;
  quantity: number;
  unit_price?: number;
  vat_rate?: number;
  notes?: string;
}

export interface UpdateQuoteRequest {
  title?: string;
  amount?: number;
  description?: string;
  company_name?: string;
  company_contact_name?: string;
  company_contact_phone?: string;
  company_contact_email?: string;
}

export interface QuoteStatusChangeRequest {
  reason?: string;
}

export interface StatusLog {
  id: number;
  quote_id: number;
  from_status: string;
  to_status: string;
  changed_by: number;
  created_at?: string;
  changed_at?: string;
}

export interface DomainEvent {
  event_type: string;
  quote_id: number;
  old_status?: string;
  new_status?: string;
  reason?: string;
  actor_id?: number;
  timestamp: string;
}

// List quotes with filters
export async function getQuotes(
  page: number = 1,
  size: number = 10,
  status?: string
): Promise<QuoteListResponse> {
  // Backend QuoteStatus enum'unda "submitted" yok; UI alias'ını "sent"e çevir.
  const normalizedStatus = status === "submitted" ? "sent" : status;

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (normalizedStatus) params.append("status_filter", normalizedStatus);

  const res = await http.get<QuoteListResponse>(`/quotes?${params}`);
  return res.data;
}

// Get single quote
export async function getQuote(id: number): Promise<Quote> {
  const res = await http.get<Quote>(`/quotes/${id}`);
  return res.data;
}

// Create quote
export async function createQuote(data: CreateQuoteRequest): Promise<Quote> {
  const res = await http.post<Quote>("/quotes/", data);
  return res.data;
}

// Bulk replace quote items
export async function updateQuoteItems(quoteId: number, items: QuoteItemPayload[]): Promise<Quote> {
  const res = await http.put<Quote>(`/quotes/${quoteId}/items`, items);
  return res.data;
}

// Update quote
export async function updateQuote(id: number, data: UpdateQuoteRequest): Promise<Quote> {
  const res = await http.put<Quote>(`/quotes/${id}`, data);
  return res.data;
}

// Delete quote (soft delete)
export async function deleteQuote(id: number): Promise<void> {
  await http.delete(`/quotes/${id}`);
}

// Restore quote
export async function restoreQuote(id: number): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/restore`);
  return res.data;
}

// Quote transitions
export async function submitQuote(
  id: number,
  data?: QuoteStatusChangeRequest
): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/submit`, data || {});
  return res.data;
}

export async function approveQuote(
  id: number,
  data?: QuoteStatusChangeRequest
): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/approve`, data || {});
  return res.data;
}

export async function rejectQuote(
  id: number,
  data?: QuoteStatusChangeRequest
): Promise<Quote> {
  const res = await http.post<Quote>(`/quotes/${id}/reject`, data || {});
  return res.data;
}

// Get status history
export async function getQuoteHistory(id: number): Promise<StatusLog[]> {
  const res = await http.get<StatusLog[]>(`/quotes/${id}/status-history`);
  return res.data;
}

// Get domain events (for admin)
export async function getDomainEvents(): Promise<DomainEvent[]> {
  const res = await http.get<{ events: DomainEvent[] }>("/quotes/internal/events");
  return res.data.events;
}

// ============================================================================
// Revision System APIs
// ============================================================================

export interface SupplierQuoteRevision {
  id: number;
  revision_number: number;
  status: string;
  total_amount: number;
  initial_final_amount?: number;
  submitted_at?: string;
  profitability_amount: number | null;
  profitability_percent: number | null;
  revisions: SupplierQuoteRevision[];
  items?: Array<{
    quote_item_id: number;
    unit_price: number;
    total_price: number;
    original_unit_price?: number;
    original_total_price?: number;
  }>;
}

export interface SupplierQuotesGrouped {
  supplier_id: number;
  supplier_name: string;
  quotes: SupplierQuoteRevision[];
}

// 1. Tedarikçi tekliflerini tedarikçi bazında gruplandırılmış olarak getir
export async function getSupplierQuotesGrouped(quoteId: number): Promise<SupplierQuotesGrouped[]> {
  const res = await http.get<SupplierQuotesGrouped[]>(`/quotes/${quoteId}/suppliers`);
  return res.data;
}

// 2. Tedarikçiden revize iste
export async function requestQuoteRevision(
  quoteId: number,
  supplierQuoteId: number,
  reason: string
): Promise<{ status: string; message: string; quote_id: number }> {
  const res = await http.post<{ status: string; message: string; quote_id: number }>(
    `/quotes/${quoteId}/request-revision/${supplierQuoteId}?reason=${encodeURIComponent(reason)}`
  );
  return res.data;
}

// 3. Revize teklifini gönder (tedarikçi tarafından)
export async function submitRevisionedQuote(
  quoteId: number,
  supplierQuoteId: number,
  revisedPrices: Array<{ quote_item_id: number; unit_price: number; total_price: number }>
): Promise<{ status: string; new_supplier_quote_id: number; profitability: { amount: number; percent: number } }> {
  const res = await http.post(
    `/quotes/${quoteId}/submit-revision`,
    { supplier_quote_id: supplierQuoteId, revised_prices: revisedPrices }
  );
  return res.data;
}
