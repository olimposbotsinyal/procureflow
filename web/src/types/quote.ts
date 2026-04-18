// web/src/types/quote.ts

export type QuoteStatus = "DRAFT" | "PENDING" | "SUBMITTED" | "RESPONDED" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface Quote {
  id: number;
  rfq_id?: number;
  title: string;
  amount?: number;
  description?: string;
  project_id?: number;
  user_id?: number;
  status: QuoteStatus;
  version?: number;
  transition_reason?: string;
  created_at?: string;
  updated_at?: string;
  // Additional API response fields
  company_name?: string;
  company_contact_name?: string;
  company_contact_phone?: string;
  company_contact_email?: string;
  total_amount?: number;
  sent_at?: string;
  approved_at?: string;
  created_by_id?: number;
}

export interface QuoteIdentityLike {
  id?: number;
  rfq_id?: number;
}

export function normalizeQuote<T extends QuoteIdentityLike>(quote: T): T & { id: number; rfq_id: number } {
  const normalizedId = quote.rfq_id ?? quote.id;

  if (normalizedId == null) {
    throw new Error("Quote payload is missing both id and rfq_id");
  }

  return {
    ...quote,
    id: normalizedId,
    rfq_id: quote.rfq_id ?? normalizedId,
  };
}

export function normalizeQuotes<T extends QuoteIdentityLike>(quotes: T[]): Array<T & { id: number; rfq_id: number }> {
  return quotes.map(normalizeQuote);
}
