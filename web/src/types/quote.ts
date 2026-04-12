// web/src/types/quote.ts

export type QuoteStatus = "DRAFT" | "PENDING" | "SENT" | "RESPONDED" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface Quote {
  id: number;
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
