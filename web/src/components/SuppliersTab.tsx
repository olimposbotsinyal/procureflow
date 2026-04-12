// web/src/components/SuppliersTab.tsx
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { http } from "../lib/http";
import type { Supplier, SupplierUser } from "../types/supplier";

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail === "string"
  ) {
    return (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

const Container = styled.div`
  padding: 20px;
  min-height: 400px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }
`;

const LogoThumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #dbe3ee;
  background: #f8fafc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Form = styled.form`
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;

  button {
    flex: 1;
  }
`;

const ActionButton = styled.button<{ variant?: "danger" | "success" }>`
  padding: 6px 12px;
  font-size: 12px;
  background-color: ${(props) => props.variant === "danger" ? "#ef4444" : "#10b981"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  h3 {
    margin-top: 0;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export function SuppliersTab() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    company_title: "",
    tax_number: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
    category: "",
  });


  // Supplier user management
  const [selectedSupplier] = useState<Supplier | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [supplierUsers, setSupplierUsers] = useState<SupplierUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedSupplierUser, setSelectedSupplierUser] = useState<SupplierUser | null>(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [userEditForm, setUserEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editForm, setEditForm] = useState({
    company_name: "",
    company_title: "",
    tax_number: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    postal_code: "",
    category: "",
    notes: "",
  });

  const resolveLogoUrl = (logoUrl?: string) => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith("http")) return logoUrl;
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";
    return `${apiBase}${logoUrl}`;
  };

  // Load suppliers
  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[SuppliersTab] Loading suppliers...");
      const response = await http.get("/suppliers");
      console.log("[SuppliersTab] Suppliers loaded:", response.data);
      setSuppliers(response.data);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Tedarikçiler yüklenemedi");
      console.error("[SuppliersTab] Error loading suppliers:", errorMsg, err);
      setError(`❌ Tedarikçiler yüklenemedi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("[SuppliersTab] Component mounted, loading suppliers...");
    loadSuppliers();
  }, [loadSuppliers]);

  // Load supplier users when supplier is selected
  const loadSupplierUsers = useCallback(async (supplierId: number) => {
    try {
      setUsersLoading(true);
      const response = await http.get(`/suppliers/${supplierId}/users`);
      setSupplierUsers(response.data);
    } catch (err: unknown) {
      console.error("Error loading supplier users:", err);
      setSupplierUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const handleEditSupplierUser = (user: SupplierUser) => {
    setSelectedSupplierUser(user);
    setUserEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setShowUserEditModal(true);
  };

  const handleSaveEditSupplierUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !selectedSupplierUser) return;

    try {
      setFormLoading(true);
      setError(null);

      await http.put(
        `/suppliers/${selectedSupplier.id}/users/${selectedSupplierUser.id}`,
        {
          name: userEditForm.name,
          email: userEditForm.email,
          phone: userEditForm.phone,
        }
      );

      setSuccess("Kullanıcı başarıyla güncellendi");
      setShowUserEditModal(false);
      loadSupplierUsers(selectedSupplier.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Güncelleme hatası");
      setError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSupplierUser = async (userId: number) => {
    if (!selectedSupplier) {
      setError("Tedarikçi seçili değil");
      return;
    }
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      setError(null);
      console.log("[SuppliersTab] Deleting user:", userId, "from supplier:", selectedSupplier.id);
      
      const response = await http.delete(`/suppliers/${selectedSupplier.id}/users/${userId}`);
      console.log("[SuppliersTab] Delete response:", response.data);
      
      setSuccess("Kullanıcı başarıyla silindi");
      
      // Kullanıcı listesini yenile
      await loadSupplierUsers(selectedSupplier.id);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Silme hatası");
      console.error("[SuppliersTab] Delete error:", errorMsg, err);
      setError(`❌ Silme hatası: ${errorMsg}`);
    }
  };

  const handleSetDefaultSupplierUser = async (userId: number) => {
    if (!selectedSupplier) return;
    try {
      setError(null);
      await http.post(`/suppliers/${selectedSupplier.id}/users/${userId}/set-default`);
      setSuccess("Varsayılan yetkili güncellendi");
      await loadSupplierUsers(selectedSupplier.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Varsayılan yetkili güncellenemedi");
      setError(`❌ ${errorMsg}`);
    }
  };

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    try {
      setFormLoading(true);
      await http.post("/suppliers", formData);

      setSuccess("Tedarikçi başarıyla eklendi");
      setShowForm(false);
      setFormData({
        company_name: "",
        company_title: "",
        tax_number: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        city: "",
        postal_code: "",
        notes: "",
        category: "",
      });
      
      // Reload suppliers
      loadSuppliers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Tedarikçi eklenemedi"));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteSupplier(supplierId: number) {
    if (!confirm("Bu tedarikçiyi silmek istediğinizden emin misiniz?")) return;

    try {
      await http.delete(`/suppliers/${supplierId}`);

      setSuccess("Tedarikçi başarıyla silindi");
      loadSuppliers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Tedarikçi silinemedi"));
    }
  }

  async function handleAddSupplierUser(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSupplier) return;

    try {
      setFormLoading(true);
      setError(null);
      console.log("[SuppliersTab] Adding supplier user:", userForm);
      
      const payload = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
      };
      
      const response = await http.post(`/suppliers/${selectedSupplier.id}/users`, payload);
      console.log("[SuppliersTab] Added supplier user:", response.data);
      
      setSuccess("✅ Kullanıcı eklendi. Davet emaili gönderilmeye çalışıldı. (SMTP ayarlarını kontrol edin)");
      setShowUserModal(false);
      setUserForm({ name: "", email: "", phone: "" });
      
      // Reload suppliers ve users
      await loadSuppliers();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Kullanıcı ekleme hatası");
      console.error("[SuppliersTab] Supplier User Add Error:", errorMsg, err);
      setError(`❌ ${errorMsg}`);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleSaveEditSupplier(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSupplier) return;

    try {
      setFormLoading(true);
      setError(null);
      
      const payload = {
        company_name: editForm.company_name,
        company_title: editForm.company_title,
        tax_number: editForm.tax_number,
        phone: editForm.phone,
        email: editForm.email,
        website: editForm.website,
        address: editForm.address,
        city: editForm.city,
        postal_code: editForm.postal_code,
        category: editForm.category,
        notes: editForm.notes,
      };
      
      await http.put(`/suppliers/${selectedSupplier.id}`, payload);
      
      setSuccess("Tedarikçi başarıyla güncellendi");
      setShowEditModal(false);
      setEditForm({
        company_name: "",
        company_title: "",
        tax_number: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        city: "",
        postal_code: "",
        category: "",
        notes: "",
      });
      loadSuppliers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Güncelleme hatası");
      console.error("Supplier Update Error:", err);
      setError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) return <Container style={{ textAlign: "center", padding: "40px", color: "#666" }}>⏳ Tedarikçiler yükleniyor...</Container>;

  return (
    <Container>
      {error && <ErrorMessage>❌ {error}</ErrorMessage>}
      {success && <SuccessMessage>✅ {success}</SuccessMessage>}

      <Header>
        <h2>Tedarikçiler</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "İptal" : "+ Yeni Tedarikçi"}
        </Button>
      </Header>

      {showForm && (
        <Form onSubmit={handleAddSupplier}>
          <FormGroup style={{ gridColumn: "1 / -1" }}>
            <Label>Şirket Adı</Label>
            <Input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Ünvanı</Label>
            <Input
              type="text"
              value={formData.company_title}
              onChange={(e) =>
                setFormData({ ...formData, company_title: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Vergi Numarası</Label>
            <Input
              type="text"
              value={formData.tax_number}
              onChange={(e) =>
                setFormData({ ...formData, tax_number: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Telefon *</Label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>E-mail *</Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Web Sitesi</Label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup style={{ gridColumn: "1 / -1" }}>
            <Label>Adres</Label>
            <TextArea
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Şehir</Label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Posta Kodu</Label>
            <Input
              type="text"
              value={formData.postal_code}
              onChange={(e) =>
                setFormData({ ...formData, postal_code: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Kategori</Label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              style={{
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="">-- Seç --</option>
              <option value="Yazılım">💻 Yazılım</option>
              <option value="Donanım">🖥️ Donanım</option>
              <option value="Hizmet">🔧 Hizmet</option>
              <option value="Danışmanlık">📋 Danışmanlık</option>
              <option value="Muhasebe">📊 Muhasebe</option>
              <option value="İnsan Kaynakları">👥 İnsan Kaynakları</option>
            </select>
          </FormGroup>

          <FormGroup style={{ gridColumn: "1 / -1" }}>
            <Label>Notlar</Label>
            <TextArea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </FormGroup>

          <FormActions>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Ekleniyor..." : "Tedarikçi Ekle"}
            </Button>
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ backgroundColor: "#6b7280" }}
            >
              İptal
            </Button>
          </FormActions>
        </Form>
      )}

      <Table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Firma Adı</th>
            <th>E-mail</th>
            <th>Telefon</th>
            <th>Kategori</th>
            <th>Şehir</th>
            <th>Puan</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>
                <LogoThumb>
                  {resolveLogoUrl(supplier.logo_url) ? (
                    <img src={resolveLogoUrl(supplier.logo_url) || ""} alt={`${supplier.company_name} logosu`} />
                  ) : (
                    <span style={{ fontSize: "16px" }}>🏢</span>
                  )}
                </LogoThumb>
              </td>
              <td>{supplier.company_name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.category || "-"}</td>
              <td>{supplier.city || "-"}</td>
              <td>⭐ {supplier.reference_score || "0"}</td>
              <td>{supplier.is_verified ? "✅ Doğrulanmış" : "⏳ Beklemede"}</td>
              <td>
                <ActionButton
                  variant="success"
                  onClick={() => navigate(`/admin/suppliers/${supplier.id}`)}
                >
                  Tedarikçiyi Görüntüle
                </ActionButton>
                {" "}
                <ActionButton
                  variant="danger"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  Sil
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Supplier Modal */}
      {showEditModal && selectedSupplier && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditModal(false);
          }
        }}>
          <ModalContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Tedarikçiyi Düzenle - {selectedSupplier.company_name}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>
            
            {error && <ErrorMessage>❌ {error}</ErrorMessage>}
            
            <Form onSubmit={handleSaveEditSupplier}>
              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Şirket Adı *</Label>
                <Input
                  type="text"
                  required
                  value={editForm.company_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, company_name: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Ünvanı</Label>
                <Input
                  type="text"
                  value={editForm.company_title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, company_title: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Vergi Numarası</Label>
                <Input
                  type="text"
                  value={editForm.tax_number}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tax_number: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Web Sitesi</Label>
                <Input
                  type="url"
                  value={editForm.website}
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Adres</Label>
                <TextArea
                  rows={3}
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Şehir</Label>
                <Input
                  type="text"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Posta Kodu</Label>
                <Input
                  type="text"
                  value={editForm.postal_code}
                  onChange={(e) =>
                    setEditForm({ ...editForm, postal_code: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Kategori</Label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  style={{
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">-- Seç --</option>
                  <option value="Yazılım">💻 Yazılım</option>
                  <option value="Donanım">🖥️ Donanım</option>
                  <option value="Hizmet">🔧 Hizmet</option>
                  <option value="Danışmanlık">📋 Danışmanlık</option>
                  <option value="Muhasebe">📊 Muhasebe</option>
                  <option value="İnsan Kaynakları">👥 İnsan Kaynakları</option>
                </select>
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Notlar</Label>
                <TextArea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                />
              </FormGroup>

              <FormActions>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ backgroundColor: "#6b7280" }}
                >
                  İptal
                </Button>
              </FormActions>
            </Form>

            {/* Supplier Users Section */}
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ margin: 0 }}>Firma Kullanıcıları ({supplierUsers.length})</h4>
                <Button onClick={() => setShowUserModal(true)} style={{ padding: "6px 12px", fontSize: "12px" }}>
                  + Kullanıcı Ekle
                </Button>
              </div>

              {usersLoading ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Yükleniyor...</div>
              ) : supplierUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>Kullanıcı bulunamadı</div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px", textAlign: "left" }}>Ad</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "10px", textAlign: "left" }}>Telefon</th>
                      <th style={{ padding: "10px", textAlign: "center" }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierUsers.map((user) => (
                      <tr key={user.id}>
                        <td style={{ padding: "10px" }}>
                          {user.name} {user.is_default ? "⭐" : ""}
                        </td>
                        <td style={{ padding: "10px" }}>{user.email}{user.email_verified ? " ✅" : " ⏳"}</td>
                        <td style={{ padding: "10px" }}>{user.phone || "-"}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {!user.is_default && (
                            <ActionButton
                              variant="success"
                              onClick={() => handleSetDefaultSupplierUser(user.id)}
                              style={{ marginRight: "5px", backgroundColor: "#f59e0b" }}
                            >
                              Varsayılan Yap
                            </ActionButton>
                          )}
                          <ActionButton
                            variant="success"
                            onClick={() => handleEditSupplierUser(user)}
                            style={{ marginRight: "5px" }}
                            disabled={!!user.is_default}
                          >
                            Düzenle
                          </ActionButton>
                          <ActionButton
                            variant="danger"
                            onClick={() => handleDeleteSupplierUser(user.id)}
                            disabled={!!user.is_default}
                          >
                            Sil
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </ModalContent>
        </Modal>
      )}

      {/* Add User Modal */}
      {showUserModal && selectedSupplier && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowUserModal(false);
          }
        }}>
          <ModalContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Kullanıcı Ekle - {selectedSupplier.company_name}</h3>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>
            
            {error && <ErrorMessage>❌ {error}</ErrorMessage>}
            
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
              Magic link (sihirli bağlantı) kendisinin email adresine gönderilecektir.
            </p>
            
            <Form onSubmit={handleAddSupplierUser}>
              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Adı *</Label>
                <Input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phone: e.target.value })
                  }
                />
              </FormGroup>

              <FormActions>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "⏳ Gönderiliyor..." : "✅ Email'i Gönder"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  style={{ backgroundColor: "#6b7280" }}
                >
                  ❌ İptal
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Supplier User Modal */}
      {showUserEditModal && selectedSupplier && selectedSupplierUser && (
        <Modal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowUserEditModal(false);
          }
        }}>
          <ModalContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Kullanıcıyı Düzenle - {selectedSupplierUser.name}</h3>
              <button
                onClick={() => setShowUserEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>

            {error && <ErrorMessage>❌ {error}</ErrorMessage>}

            <Form onSubmit={handleSaveEditSupplierUser}>
              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Ad *</Label>
                <Input
                  type="text"
                  required
                  value={userEditForm.name}
                  onChange={(e) =>
                    setUserEditForm({ ...userEditForm, name: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Email *</Label>
                <Input
                  type="email"
                  required
                  value={userEditForm.email}
                  onChange={(e) =>
                    setUserEditForm({ ...userEditForm, email: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={userEditForm.phone}
                  onChange={(e) =>
                    setUserEditForm({ ...userEditForm, phone: e.target.value })
                  }
                />
              </FormGroup>

              <FormActions>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowUserEditModal(false)}
                  style={{ backgroundColor: "#6b7280" }}
                >
                  İptal
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
