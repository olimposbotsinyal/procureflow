export interface ApprovalRoleInfo {
  // Canonical source during the transition: clients should prefer required_business_role.
  required_role?: string | null;
  // Compatibility mirror only; may be null once the final cleanup migration lands.
  required_role_mirror?: string | null;
  required_business_role?: string | null;
  required_role_label?: string | null;
  required_business_role_label?: string | null;
}

export interface QuotePendingApprovalLike extends ApprovalRoleInfo {
  id: number;
  level: number;
  status: string;
  requested_at?: string;
  completed_at?: string;
  approver_name?: string | null;
  comment?: string | null;
}

export interface ApprovalDetailLike extends ApprovalRoleInfo {
  level: number;
  status: string;
  requested_at?: string;
  completed_at?: string;
  approved_by_id?: number | null;
  approved_by_name?: string | null;
  comment?: string | null;
}