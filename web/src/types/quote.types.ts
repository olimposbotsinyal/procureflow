// Departments
export const Department = {
  FOOD: "Gıda",
  TECHNICAL: "Teknik",
  INDIRECT: "Endirekt",
  PACKAGING: "Ambalaj",
} as const;

export type Department = typeof Department[keyof typeof Department];

export const DepartmentLabel: Record<Department, string> = {
  Gıda: "Gıda Satın Alma",
  Teknik: "Teknik Satın Alma",
  Endirekt: "Endirekt Satın Alma",
  Ambalaj: "Ambalaj Satın Alma",
};

// Approval Limits per role
export const ApprovalLimits: Record<string, number> = {
  satinalmaci: 10000, // 10K
  satinalma_uzmani: 50000, // 50K
  satinalma_yoneticisi: 250000, // 250K
  satinalma_direktoru: 1000000, // 1M
  super_admin: Infinity,
};

// Quote Status
export type QuoteStatus = "draft" | "submitted" | "approved" | "rejected";

export const QuoteStatusLabel: Record<QuoteStatus, string> = {
  draft: "Taslak",
  submitted: "Onaya Gönderildi",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export const QuoteStatusColor: Record<QuoteStatus, string> = {
  draft: "#f3f4f6",
  submitted: "#fef3c7",
  approved: "#d1fae5",
  rejected: "#fee2e2",
};

// User with extended info
export interface UserWithDept {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_active: boolean;
  department?: Department;
  approval_limit?: number;
}
