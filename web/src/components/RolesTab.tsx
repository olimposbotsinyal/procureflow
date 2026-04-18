import { useState, useEffect, useMemo } from "react";
import { getRoles, createRole, updateRole, deleteRole, getPermissions } from "../services/admin.service";
import type { Role, Permission } from "../services/admin.service";
import { useAuth } from "../hooks/useAuth";
import { filterVisibleRoleHierarchy, isPlatformStaffUser } from "../auth/permissions";

export function RolesTab() {
  const { user } = useAuth();
  const readOnly = isPlatformStaffUser(user);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    parent_id: undefined as number | undefined,
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const handleAddRole = async () => {
    if (!roleForm.name.trim()) {
      alert("Rol adı gereklidir");
      return;
    }
    try {
      await createRole({
        name: roleForm.name,
        description: roleForm.description,
        parent_id: roleForm.parent_id,
        permission_ids: selectedPermissions,
      });
      await loadData();
      setRoleForm({ name: "", description: "", parent_id: undefined, is_active: true });
      setSelectedPermissions([]);
      setShowNewRoleForm(false);
    } catch (err) {
      alert("Rol ekleme hatası: " + String(err));
    }
  };

  const handleUpdateRole = async (roleId: number) => {
    try {
      await updateRole(roleId, {
        name: roleForm.name,
        description: roleForm.description,
        parent_id: roleForm.parent_id !== undefined && roleForm.parent_id !== null ? roleForm.parent_id : undefined,
        is_active: roleForm.is_active,
        permission_ids: selectedPermissions,
      });
      await loadData();
      setEditingRoleId(null);
      setRoleForm({ name: "", description: "", parent_id: undefined, is_active: true });
      setSelectedPermissions([]);
    } catch (err) {
      alert("Rol güncelleme hatası: " + String(err));
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Bu rolü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteRole(id);
      await loadData();
    } catch (err) {
      alert("Silme hatası: " + String(err));
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleForm({
      name: role.name,
      description: role.description || "",
      parent_id: role.parent_id || undefined,
      is_active: role.is_active,
    });
    setSelectedPermissions(role.permissions.map((p) => p.id));
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setRoleForm({ name: "", description: "", parent_id: undefined, is_active: true });
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const visibleRoles = useMemo(() => {
    return filterVisibleRoleHierarchy(roles, (user as { role?: string } | null)?.role);
  }, [roles, user]);

  if (loading) {
    return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ padding: 12, background: "#fecaca", color: "#dc2626", borderRadius: 4, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        {readOnly && (
          <div style={{ marginBottom: 12, padding: 12, borderRadius: 12, background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}>
            Platform personeli rol hiyerarsisini inceleyebilir; yeni rol ekleme, duzenleme ve silme aksiyonlari bu yuzeyde kapatildi.
          </div>
        )}
        <button
          onClick={() => {
            setShowNewRoleForm(!showNewRoleForm);
            setEditingRoleId(null);
            setRoleForm({ name: "", description: "", parent_id: undefined, is_active: true });
            setSelectedPermissions([]);
          }}
          disabled={readOnly}
          style={{
            padding: "10px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: readOnly ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: readOnly ? 0.6 : 1,
          }}
        >
          {showNewRoleForm ? "❌ İptal" : "➕ Yeni Rol"}
        </button>
      </div>

      {!readOnly && (showNewRoleForm || editingRoleId !== null) && (
        <div style={{ background: "#f9fafb", padding: 20, borderRadius: 8, marginBottom: 20, border: "1px solid #ddd" }}>
          <h3>{editingRoleId ? "Rolü Düzenle" : "Yeni Rol Ekle"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Rol Adı"
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            />
            <input
              type="text"
              placeholder="Açıklama"
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Parent Rol (Hiyerarşi):
            </label>
            <select
              value={roleForm.parent_id || ""}
              onChange={(e) =>
                setRoleForm({ ...roleForm, parent_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", width: "100%", maxWidth: 300 }}
            >
              <option value="">Yok (Root Role)</option>
              {visibleRoles
                .filter((r) => r.id !== editingRoleId)
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {"  ".repeat(role.hierarchy_level)} {role.name}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              İzinler:
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 8,
                maxHeight: 350,
                overflowY: "auto",
                padding: 12,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            >
              {permissions.map((perm) => (
                <label
                  key={perm.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#f0f0f0",
                  }}
                  title={perm.tooltip || perm.description || ""}
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => handlePermissionChange(perm.id)}
                    style={{ cursor: "pointer", width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>
                      {perm.description || perm.name}
                    </div>
                    {perm.tooltip && (
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{perm.tooltip}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {editingRoleId ? (
              <>
                <button
                  onClick={() => handleUpdateRole(editingRoleId)}
                  style={{
                    padding: "8px 16px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Güncelle
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: "8px 16px",
                    background: "#f3f4f6",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  İptal
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAddRole}
                  style={{
                    padding: "8px 16px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Ekle
                </button>
                <button
                  onClick={() => {
                    setShowNewRoleForm(false);
                    setRoleForm({ name: "", description: "", parent_id: undefined, is_active: true });
                    setSelectedPermissions([]);
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#f3f4f6",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  İptal
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Roles Tree View */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Rol Hiyerarşisi</h3>
        <div style={{ marginLeft: 0 }}>
          {getRoleTree(null).map((role) => (
            <RoleTreeNode
              key={role.id}
              role={role}
              allRoles={visibleRoles}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      {visibleRoles.length === 0 && (
        <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
          Hiç rol yoktur. Yeni bir rol oluşturun.
        </div>
      )}
    </div>
  );

  function getRoleTree(parentId: number | null = null): Role[] {
    return visibleRoles
      .filter((r) => r.parent_id === parentId)
      .sort((a, b) => a.hierarchy_level - b.hierarchy_level);
  }
}

interface RoleNodeProps {
  role: Role;
  allRoles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  readOnly?: boolean;
}

function RoleTreeNode({
  role,
  allRoles,
  onEdit,
  onDelete,
  readOnly = false,
}: RoleNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const children = allRoles.filter((r) => r.parent_id === role.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 8px",
          backgroundColor: role.is_active ? "#f9fafb" : "#fee2e2",
          borderLeft: `4px solid ${role.is_active ? "#3b82f6" : "#dc2626"}`,
          marginBottom: 4,
          borderRadius: "0 4px 4px 0",
          marginLeft: `${role.hierarchy_level * 20}px`,
        }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: 24,
              fontSize: 16,
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        {!hasChildren && <div style={{ width: 24 }} />}

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", color: "#333" }}>{role.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {role.description} {role.permissions.length > 0 && `(${role.permissions.length} izin)`}
          </div>
        </div>

        <span
          style={{
            padding: "4px 12px",
            background: role.is_active ? "#d1fae5" : "#fee2e2",
            color: role.is_active ? "#065f46" : "#991b1b",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {role.is_active ? "Aktif" : "Pasif"}
        </span>

        {!readOnly && (
          <>
            <button
              onClick={() => onEdit(role)}
              style={{
                padding: "4px 12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Düzenle
            </button>

            <button
              onClick={() => onDelete(role.id)}
              style={{
                padding: "4px 12px",
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
          </>
        )}
      </div>

      {isExpanded &&
        children.map((child) => (
          <RoleTreeNode
            key={child.id}
            role={child}
            allRoles={allRoles}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}
