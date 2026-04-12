// PAGE: web/src/pages/AdminPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { ProjectsTab } from "../components/ProjectsTab";
import { RolesTab } from "../components/RolesTab";
import { SuppliersTab } from "../components/SuppliersTab";
import { SettingsTab } from "../components/SettingsTab";
import { ApprovalDashboard } from "../components/ApprovalDashboard";
import { getAccessToken } from "../lib/token";
import {
  getPersonnel,
  getDepartments,
  getCompanies,
  getRoles,
  createPersonnel,
  createDepartment,
  createCompany,
  deleteDepartment,
  deletePersonnel,
  deleteCompany,
} from "../services/admin.service";
import type { Personnel, Department, Company, Role } from "../services/admin.service";
import { Link, useSearchParams } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"companies" | "roles" | "departments" | "personnel" | "projects" | "suppliers" | "approvals" | "settings">("companies");

  // Personnel state
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showNewPersonnelForm, setShowNewPersonnelForm] = useState(false);
  const [personnelForm, setPersonnelForm] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "",
    approval_limit: 100000,
    department_id: undefined as number | undefined,
  });

  // Departments state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showNewDeptForm, setShowNewDeptForm] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });

  // Companies state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [companyForm, setCompanyForm] = useState<{ name: string; description?: string; is_active: boolean; color: string }>({
    name: "",
    is_active: true,
    color: "#3b82f6",
  });

  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["companies", "roles", "departments", "personnel", "projects", "suppliers", "approvals", "settings"].includes(tab)) {
      setActiveTab(tab as "companies" | "roles" | "departments" | "personnel" | "projects" | "suppliers" | "approvals" | "settings");
    }
  }, [searchParams]);

  async function loadData() {
    try {
      setLoading(true);
      const [personnelData, deptData, companyData, rolesData] = await Promise.all([
        getPersonnel(),
        getDepartments(),
        getCompanies(),
        getRoles(),
      ]);
      setPersonnel(personnelData);
      setDepartments(deptData);
      setCompanies(companyData);
      setRoles(rolesData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  // Check super admin
  if (user?.role !== "super_admin") {
    return (
      <div style={{ padding: 20, color: "red" }}>
        Sadece Super Admin bu sayfaya erişebilir
      </div>
    );
  }

  // Personnel handlers
  const handleAddPersonnel = async () => {
    if (!personnelForm.email || !personnelForm.full_name || !personnelForm.password) {
      alert("Tüm alanları doldurunuz");
      return;
    }
    if (!personnelForm.role) {
      alert("Lütfen bir rol seçiniz");
      return;
    }
    try {
      await createPersonnel(personnelForm);
      await loadData();
      setPersonnelForm({
        email: "",
        full_name: "",
        password: "",
        role: "",
        approval_limit: 100000,
        department_id: undefined,
      });
      setShowNewPersonnelForm(false);
    } catch (err) {
      alert("Personel ekleme hatası: " + String(err));
    }
  };

  const handleDeletePersonnel = async (id: number) => {
    if (!confirm("Personeli silmek istediğinize emin misiniz?")) return;
    try {
      await deletePersonnel(id);
      await loadData();
    } catch (err) {
      alert("Silme hatası: " + String(err));
    }
  };

  // Department handlers
  const handleAddDepartment = async () => {
    if (!deptForm.name) {
      alert("Departman adı gereklidir");
      return;
    }
    try {
      await createDepartment(deptForm);
      await loadData();
      setDeptForm({ name: "", description: "" });
      setShowNewDeptForm(false);
    } catch (err) {
      alert("Departman ekleme hatası: " + String(err));
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm("Departmanı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDepartment(id);
      await loadData();
    } catch (err) {
      alert("Silme hatası: " + String(err));
    }
  };

  // Company handlers
  const handleAddCompany = async () => {
    if (!companyForm.name) {
      alert("Firma adı gereklidir");
      return;
    }
    try {
      await createCompany(companyForm);
      await loadData();
      setCompanyForm({ name: "", description: "", is_active: true, color: "#3b82f6" });
      setShowNewCompanyForm(false);
    } catch (err) {
      alert("Firma ekleme hatası: " + String(err));
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!confirm("Firmayı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteCompany(id);
      await loadData();
    } catch (err) {
      alert("Silme hatası: " + String(err));
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>👩‍💼 Admin Paneli</h1>

      {error && <div style={{ padding: 12, background: "#fecaca", color: "#dc2626", borderRadius: 4, marginBottom: 20 }}>{error}</div>}

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, borderBottom: "2px solid #e5e7eb", paddingBottom: 12 }}>
        {(["companies", "roles", "departments", "personnel", "projects", "suppliers", "approvals", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchParams({ tab });
            }}
            style={{
              padding: "8px 16px",
              background: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "white" : "#666",
              border: "none",
              borderRadius: "4px 4px 0 0",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal",
            }}
          >
            {tab === "personnel" && "👥 Personel"}
            {tab === "departments" && "🏢 Departmanlar"}
            {tab === "companies" && "🏭 Firmalar"}
            {tab === "roles" && "🔐 Roller"}
            {tab === "projects" && "📋 Projeler"}
            {tab === "suppliers" && "🤝 Tedarikçiler"}
            {tab === "approvals" && "⚖️ Onaylar"}
            {tab === "settings" && "⚙️ Ayarlar"}
          </button>
        ))}
      </div>

      {/* Personnel Tab */}
      {activeTab === "personnel" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowNewPersonnelForm(!showNewPersonnelForm)}
              style={{
                padding: "10px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showNewPersonnelForm ? "❌ İptal" : "➕ Yeni Personel"}
            </button>
          </div>

          {showNewPersonnelForm && (
            <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, marginBottom: 20, border: "1px solid #ddd" }}>
              <h3>Yeni Personel Ekle</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={personnelForm.email}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, email: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={personnelForm.full_name}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, full_name: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
                <input
                  type="password"
                  placeholder="Şifre"
                  value={personnelForm.password}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, password: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
                <select
                  value={personnelForm.role}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, role: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                >
                  <option value="">Rol Seçiniz...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleAddPersonnel}
                  style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowNewPersonnelForm(false)}
                  style={{ padding: "8px 16px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Personnel Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Ad Soyad</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Email</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Rol</th>
                  <th style={{ padding: 12, textAlign: "center" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {personnel.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{p.full_name}</td>
                    <td style={{ padding: 12 }}>{p.email}</td>
                    <td style={{ padding: 12 }}>{p.role}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <Link
                        to={`/admin/personnel/${p.id}`}
                        style={{
                          padding: "4px 12px",
                          marginRight: 8,
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeletePersonnel(p.id)}
                        style={{
                          padding: "4px 8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowNewDeptForm(!showNewDeptForm)}
              style={{
                padding: "10px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showNewDeptForm ? "❌ İptal" : "➕ Yeni Departman"}
            </button>
          </div>

          {showNewDeptForm && (
            <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, marginBottom: 20, border: "1px solid #ddd" }}>
              <h3>Yeni Departman Ekle</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Departman Adı"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
                <input
                  type="text"
                  placeholder="Açıklama"
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleAddDepartment}
                  style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowNewDeptForm(false)}
                  style={{ padding: "8px 16px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Departments Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Departman Adı</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Açıklama</th>
                  <th style={{ padding: 12, textAlign: "center" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{dept.name}</td>
                    <td style={{ padding: 12 }}>{dept.description || "-"}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <Link
                        to={`/admin/departments/${dept.id}`}
                        style={{
                          padding: "4px 12px",
                          marginRight: 8,
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        style={{
                          padding: "4px 8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === "companies" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowNewCompanyForm(!showNewCompanyForm)}
              style={{
                padding: "10px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showNewCompanyForm ? "❌ İptal" : "➕ Yeni Firma"}
            </button>
          </div>

          {showNewCompanyForm && (
            <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, marginBottom: 20, border: "1px solid #ddd" }}>
              <h3>Yeni Firma Ekle</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Firma Adı"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={companyForm.is_active}
                        onChange={(e) => setCompanyForm({ ...companyForm, is_active: e.target.checked })}
                        style={{ marginRight: 8 }}
                      />
                      Aktif
                    </label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ marginRight: 8 }}>Renk:</label>
                    <input
                      type="color"
                      value={companyForm.color}
                      onChange={(e) => setCompanyForm({ ...companyForm, color: e.target.value })}
                      style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid #ddd", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Açıklama"
                value={companyForm.description || ""}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 4, border: "1px solid #ddd", fontFamily: "inherit" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleAddCompany}
                  style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowNewCompanyForm(false)}
                  style={{ padding: "8px 16px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Companies Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Firma Adı</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Açıklama</th>
                  <th style={{ padding: 12, textAlign: "center" }}>Durum</th>
                  <th style={{ padding: 12, textAlign: "center" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{company.name}</td>
                    <td style={{ padding: 12 }}>{company.description || "-"}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          background: company.is_active ? "#d1fae5" : "#fee2e2",
                          color: company.is_active ? "#065f46" : "#991b1b",
                          borderRadius: "4px",
                          fontSize: 12,
                        }}
                      >
                        {company.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <Link
                        to={`/admin/companies/${company.id}`}
                        style={{
                          padding: "4px 12px",
                          marginRight: 8,
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        style={{
                          padding: "4px 8px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && <RolesTab />}

      {/* Projects Tab */}
      {activeTab === "projects" && <ProjectsTab />}

      {/* Suppliers Tab */}
      {activeTab === "suppliers" && (
        <SuppliersTab />
      )}

      {/* Approvals Tab */}
      {activeTab === "approvals" && (
        <ApprovalDashboard
          apiUrl={import.meta.env.VITE_API_URL || "http://localhost:8000"}
          authToken={getAccessToken() || ""}
        />
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}
