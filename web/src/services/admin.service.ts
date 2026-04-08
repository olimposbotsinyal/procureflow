// services/admin.service.ts
import { http } from "../lib/http";
import type { ProjectFile } from "../types/project";

export interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
  tooltip?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  hierarchy_level: number;
  parent_id?: number | null;
  permissions: Permission[];
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  code: string;
  budget?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Personnel {
  id: number;
  email: string;
  full_name: string;
  role: "satinalmaci" | "satinalma_uzmani" | "satinalma_yoneticisi" | "satinalma_direktoru" | "super_admin";
  approval_limit: number;
  department_id?: number;
  is_active: boolean;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// COMPANIES
export async function getCompanies(): Promise<Company[]> {
  const res = await http.get<Company[]>("/admin/companies");
  return res.data;
}

export async function createCompany(data: { name: string; description?: string; is_active?: boolean; color?: string }): Promise<Company> {
  const res = await http.post<Company>("/admin/companies", data);
  return res.data;
}

export async function updateCompany(id: number, data: Partial<Company>): Promise<Company> {
  const res = await http.put<Company>(`/admin/companies/${id}`, data);
  return res.data;
}

export async function deleteCompany(id: number): Promise<void> {
  await http.delete(`/admin/companies/${id}`);
}

// ROLES
export async function getRoles(): Promise<Role[]> {
  const res = await http.get<Role[]>("/admin/roles");
  return res.data;
}

export async function createRole(data: {
  name: string;
  description?: string;
  parent_id?: number;
  permission_ids?: number[];
}): Promise<Role> {
  const res = await http.post<Role>("/admin/roles", data);
  return res.data;
}

export async function updateRole(id: number, data: {
  name?: string;
  description?: string;
  parent_id?: number | null;
  is_active?: boolean;
  permission_ids?: number[];
}): Promise<Role> {
  const res = await http.put<Role>(`/admin/roles/${id}`, data);
  return res.data;
}

export async function deleteRole(id: number): Promise<void> {
  await http.delete(`/admin/roles/${id}`);
}

export async function getPermissions(): Promise<Permission[]> {
  const res = await http.get<Permission[]>("/admin/permissions");
  return res.data;
}

// DEPARTMENTS
export async function getDepartments(): Promise<Department[]> {
  const res = await http.get<Department[]>("/admin/departments");
  return res.data;
}

export async function createDepartment(data: { name: string; description?: string }): Promise<Department> {
  const res = await http.post<Department>("/admin/departments", data);
  return res.data;
}

export async function updateDepartment(id: number, data: Partial<Department>): Promise<Department> {
  const res = await http.put<Department>(`/admin/departments/${id}`, data);
  return res.data;
}

export async function deleteDepartment(id: number): Promise<void> {
  await http.delete(`/admin/departments/${id}`);
}

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const res = await http.get<Project[]>("/admin/projects");
  return res.data;
}

export async function createProject(data: {
  name: string;
  code: string;
  description?: string;
  budget?: number;
  company_id?: number;
  project_type?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  manager_name?: string;
  manager_phone?: string;
  is_active?: boolean;
}): Promise<Project> {
  const res = await http.post<Project>("/admin/projects", data);
  return res.data;
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const res = await http.put<Project>(`/admin/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id: number): Promise<void> {
  await http.delete(`/admin/projects/${id}`);
}

// PERSONNEL/USERS
export async function getPersonnel(): Promise<Personnel[]> {
  const res = await http.get<Personnel[]>("/admin/users");
  return res.data;
}

export async function createPersonnel(data: {
  email: string;
  full_name: string;
  password: string;
  role: string;
  approval_limit?: number;
  department_id?: number;
}): Promise<Personnel> {
  const res = await http.post<Personnel>("/admin/users", data);
  return res.data;
}

export async function updatePersonnel(id: number, data: Partial<Personnel>): Promise<Personnel> {
  const res = await http.put<Personnel>(`/admin/users/${id}`, data);
  return res.data;
}

export async function deletePersonnel(id: number): Promise<void> {
  await http.delete(`/admin/users/${id}`);
}

export async function assignPersonnelToProject(userId: number, projectId: number): Promise<{ message: string }> {
  const res = await http.post<{ message: string }>(`/admin/users/${userId}/projects/${projectId}`, {});
  return res.data;
}

export async function removePersonnelFromProject(userId: number, projectId: number): Promise<{ message: string }> {
  const res = await http.delete<{ message: string }>(`/admin/users/${userId}/projects/${projectId}`);
  return res.data;
}

// PROJECT FILES
export async function uploadProjectFile(projectId: number, file: File): Promise<ProjectFile> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await http.post(`/admin/projects/${projectId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function getProjectFiles(projectId: number): Promise<ProjectFile[]> {
  const res = await http.get(`/admin/projects/${projectId}/files`);
  return res.data;
}

export async function deleteProjectFile(fileId: number): Promise<{ message: string }> {
  const res = await http.delete(`/admin/files/${fileId}`);
  return res.data;
}

export interface AdminSupplierPaymentAccount {
  id?: number;
  bank_key?: string | null;
  bank_name: string;
  iban: string;
  account_type: "tl" | "doviz";
}

export interface AdminSupplierGuarantee {
  id: number;
  title: string;
  guarantee_type: string;
  amount?: number | null;
  currency?: string;
  issued_at?: string | null;
  expires_at?: string | null;
  status: string;
}

export type AdminSupplierDocCategory = "certificates" | "company_docs" | "personnel_docs" | "guarantee_docs";

export interface AdminSupplierDocumentItem {
  id: number;
  category: AdminSupplierDocCategory;
  original_filename: string;
  stored_filename?: string;
  file_url: string;
  file_size?: number;
  content_type?: string;
  created_at?: string;
}

export interface AdminSupplierUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  email_verified: boolean;
  is_default: boolean;
}

export interface SupplierFinanceContractItem {
  id: number;
  quote_id: number;
  contract_number: string;
  status: string;
  final_amount: number;
  signed_at?: string | null;
  created_at?: string;
}

export interface SupplierFinanceInvoiceItem {
  id: number;
  supplier_id: number;
  contract_id?: number | null;
  title: string;
  invoice_number?: string | null;
  invoice_date?: string | null;
  amount: number;
  currency: string;
  file_url?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface SupplierFinancePaymentItem {
  id: number;
  supplier_id: number;
  contract_id?: number | null;
  title: string;
  payment_date?: string | null;
  amount: number;
  currency: string;
  method?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface SupplierFinancePhotoItem {
  id: number;
  supplier_id: number;
  contract_id?: number | null;
  title: string;
  file_url: string;
  description?: string | null;
  created_at?: string;
}

export interface SupplierFinanceSummary {
  contracts: SupplierFinanceContractItem[];
  invoices: SupplierFinanceInvoiceItem[];
  payments: SupplierFinancePaymentItem[];
  photos: SupplierFinancePhotoItem[];
  totals: {
    contract_total: number;
    invoice_total: number;
    payment_total: number;
    delta_invoice_vs_contract: number;
    delta_payment_vs_contract: number;
    delta_payment_vs_invoice: number;
  };
  alerts: string[];
}

export interface AdminSupplierManagementResponse {
  supplier: {
    id: number;
    company_name: string;
    company_title?: string | null;
    tax_number?: string | null;
    registration_number?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    address_district?: string | null;
    postal_code?: string | null;
    invoice_name?: string | null;
    invoice_address?: string | null;
    invoice_city?: string | null;
    invoice_district?: string | null;
    invoice_postal_code?: string | null;
    tax_office?: string | null;
    notes?: string | null;
    category?: string | null;
    logo_url?: string | null;
    payment_accounts: AdminSupplierPaymentAccount[];
    accepts_checks: boolean;
    preferred_check_term?: string | null;
  };
  users: AdminSupplierUser[];
  users_count: number;
  default_user_id?: number | null;
  guarantees: AdminSupplierGuarantee[];
}

export async function getAdminSupplierManagementDetail(supplierId: number): Promise<AdminSupplierManagementResponse> {
  const res = await http.get<AdminSupplierManagementResponse>(`/suppliers/${supplierId}/management`);
  return res.data;
}

export async function updateAdminSupplierManagementDetail(supplierId: number, payload: Partial<AdminSupplierManagementResponse["supplier"]>): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/management`, payload);
  return res.data;
}

export async function createAdminSupplierGuarantee(
  supplierId: number,
  payload: {
    title: string;
    guarantee_type: string;
    amount?: number | null;
    currency?: string;
    issued_at?: string | null;
    expires_at?: string | null;
  },
): Promise<{ status: string; message: string }> {
  const res = await http.post<{ status: string; message: string }>(`/suppliers/${supplierId}/guarantees`, payload);
  return res.data;
}

export async function updateAdminSupplierGuarantee(
  supplierId: number,
  guaranteeId: number,
  payload: {
    title: string;
    guarantee_type: string;
    amount?: number | null;
    currency?: string;
    issued_at?: string | null;
    expires_at?: string | null;
    status?: string;
  },
): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/guarantees/${guaranteeId}`, payload);
  return res.data;
}

export async function deleteAdminSupplierGuarantee(supplierId: number, guaranteeId: number): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/guarantees/${guaranteeId}`);
  return res.data;
}

export async function updateAdminSupplierUser(
  supplierId: number,
  userId: number,
  payload: { name: string; email: string; phone?: string },
): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/users/${userId}`, payload);
  return res.data;
}

export async function deleteAdminSupplierUser(supplierId: number, userId: number): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/users/${userId}`);
  return res.data;
}

export async function setAdminSupplierDefaultUser(supplierId: number, userId: number): Promise<{ status: string; message: string }> {
  const res = await http.post<{ status: string; message: string }>(`/suppliers/${supplierId}/users/${userId}/set-default`);
  return res.data;
}

export async function createAdminSupplierUser(
  supplierId: number,
  payload: { name: string; email: string; phone?: string },
): Promise<{ id: number; name: string; email: string }> {
  const res = await http.post<{ id: number; name: string; email: string }>(`/suppliers/${supplierId}/users`, payload);
  return res.data;
}

export async function listAdminSupplierDocuments(
  supplierId: number,
  category?: AdminSupplierDocCategory,
): Promise<AdminSupplierDocumentItem[]> {
  const res = await http.get<{ documents: AdminSupplierDocumentItem[] }>(`/suppliers/${supplierId}/documents`, {
    params: category ? { category } : undefined,
  });
  return res.data.documents ?? [];
}

export async function deleteAdminSupplierDocument(
  supplierId: number,
  documentId: number,
): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/documents/${documentId}`);
  return res.data;
}

export async function uploadAdminSupplierDocument(
  supplierId: number,
  category: AdminSupplierDocCategory,
  file: File,
): Promise<AdminSupplierDocumentItem> {
  const form = new FormData();
  form.append("file", file);
  const res = await http.post<{ status: string; document: AdminSupplierDocumentItem }>(
    `/suppliers/${supplierId}/documents/${category}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data.document;
}

export async function sendAdminSupplierEmail(
  supplierId: number,
  payload: {
    to_email: string;
    subject: string;
    body: string;
    cc?: string;
    attachments?: File[];
  },
): Promise<{ status: string; message: string }> {
  const form = new FormData();
  form.append("to_email", payload.to_email);
  form.append("subject", payload.subject);
  form.append("body", payload.body);
  if (payload.cc) {
    form.append("cc", payload.cc);
  }
  for (const file of payload.attachments || []) {
    form.append("attachments", file);
  }
  const res = await http.post<{ status: string; message: string }>(
    `/suppliers/${supplierId}/contact-email`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

export async function getAdminSupplierFinanceSummary(
  supplierId: number,
  params?: { query?: string; date_from?: string; date_to?: string },
): Promise<SupplierFinanceSummary> {
  const res = await http.get<SupplierFinanceSummary>(`/suppliers/${supplierId}/finance-summary`, { params });
  return res.data;
}

export async function createAdminSupplierFinanceInvoice(
  supplierId: number,
  payload: {
    title: string;
    amount: number;
    contract_id?: number;
    invoice_number?: string;
    invoice_date?: string;
    currency?: string;
    notes?: string;
    file?: File;
  },
): Promise<{ status: string; message: string }> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("amount", String(payload.amount));
  if (payload.contract_id) form.append("contract_id", String(payload.contract_id));
  if (payload.invoice_number) form.append("invoice_number", payload.invoice_number);
  if (payload.invoice_date) form.append("invoice_date", payload.invoice_date);
  if (payload.currency) form.append("currency", payload.currency);
  if (payload.notes) form.append("notes", payload.notes);
  if (payload.file) form.append("file", payload.file);

  const res = await http.post<{ status: string; message: string }>(
    `/suppliers/${supplierId}/finance/invoices`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

export async function createAdminSupplierFinancePayment(
  supplierId: number,
  payload: {
    title: string;
    amount: number;
    contract_id?: number;
    payment_date?: string;
    currency?: string;
    method?: string;
    notes?: string;
  },
): Promise<{ status: string; message: string }> {
  const res = await http.post<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/payments`, payload);
  return res.data;
}

export async function createAdminSupplierFinancePhoto(
  supplierId: number,
  payload: {
    title: string;
    contract_id?: number;
    description?: string;
    file: File;
  },
): Promise<{ status: string; message: string }> {
  const form = new FormData();
  form.append("title", payload.title);
  if (payload.contract_id) form.append("contract_id", String(payload.contract_id));
  if (payload.description) form.append("description", payload.description);
  form.append("file", payload.file);

  const res = await http.post<{ status: string; message: string }>(
    `/suppliers/${supplierId}/finance/photos`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

export async function updateAdminSupplierFinanceInvoice(
  supplierId: number,
  invoiceId: number,
  payload: { title?: string; invoice_number?: string; invoice_date?: string; amount?: number; currency?: string; notes?: string },
): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/invoices/${invoiceId}`, payload);
  return res.data;
}

export async function deleteAdminSupplierFinanceInvoice(supplierId: number, invoiceId: number): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/invoices/${invoiceId}`);
  return res.data;
}

export async function updateAdminSupplierFinancePayment(
  supplierId: number,
  paymentId: number,
  payload: { title?: string; payment_date?: string; amount?: number; currency?: string; method?: string; notes?: string },
): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/payments/${paymentId}`, payload);
  return res.data;
}

export async function deleteAdminSupplierFinancePayment(supplierId: number, paymentId: number): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/payments/${paymentId}`);
  return res.data;
}

export async function updateAdminSupplierFinancePhoto(
  supplierId: number,
  photoId: number,
  payload: { title?: string; description?: string },
): Promise<{ status: string; message: string }> {
  const res = await http.put<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/photos/${photoId}`, payload);
  return res.data;
}

export async function deleteAdminSupplierFinancePhoto(supplierId: number, photoId: number): Promise<{ status: string; message: string }> {
  const res = await http.delete<{ status: string; message: string }>(`/suppliers/${supplierId}/finance/photos/${photoId}`);
  return res.data;
}

export async function getFinanceMismatches(limit = 10): Promise<{
  items: Array<{
    supplier_id: number;
    supplier_name: string;
    alerts: string[];
    totals: {
      contract_total: number;
      invoice_total: number;
      payment_total: number;
      delta_invoice_vs_contract: number;
      delta_payment_vs_contract: number;
      delta_payment_vs_invoice: number;
    };
  }>;
}> {
  const res = await http.get(`/suppliers/finance-mismatches`, { params: { limit } });
  return res.data;
}

export interface QuotePriceRules {
  max_markup_percent: number;
  max_discount_percent: number;
  tolerance_amount: number;
  block_on_violation: boolean;
  updated_at?: string | null;
}

export async function getQuotePriceRules(): Promise<QuotePriceRules> {
  const res = await http.get<QuotePriceRules>("/supplier-quotes/price-rules");
  return res.data;
}

export async function updateQuotePriceRules(payload: Omit<QuotePriceRules, "updated_at">): Promise<QuotePriceRules> {
  const res = await http.put<QuotePriceRules>("/supplier-quotes/price-rules", payload);
  return res.data;
}
