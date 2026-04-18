import { useMemo, useState } from "react";
import { DepartmentCreateModal } from "../../components/DepartmentCreateModal";
import { deleteDepartment, updateDepartment } from "../../services/admin.service";
import type { Department } from "../../services/admin.service";

interface DepartmentsTabProps {
  departments: Department[];
  loadData: () => Promise<void>;
  readOnly?: boolean;
}

export function DepartmentsTab({ departments, loadData, readOnly = false }: DepartmentsTabProps) {
  const [showNewDeptForm, setShowNewDeptForm] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'passive'>('active');

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm("Departmanı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDepartment(id);
      await loadData();
    } catch (err) {
      alert("Silme hatası: " + String(err));
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    if (filter === 'all') return true;
    if (filter === 'active') return dept.is_active;
    if (filter === 'passive') return !dept.is_active;
    return true;
  });

  const stats = useMemo(() => ({
    total: departments.length,
    active: departments.filter((dept) => dept.is_active).length,
    passive: departments.filter((dept) => !dept.is_active).length,
  }), [departments]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {readOnly && (
        <div style={{ padding: 12, borderRadius: 12, background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}>
          Platform personeli departman listesini inceleyebilir; olusturma, guncelleme, aktiflik degistirme ve silme aksiyonlari bu yuzeyde kapatildi.
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        borderRadius: 20,
        background: 'linear-gradient(135deg, #fff7ed 0%, #eef4ff 100%)',
        border: '1px solid #e5e7eb',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: '#92400e', textTransform: 'uppercase' }}>Departman Yönetimi</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>Alt açılımları yönetin</div>
          <div style={{ marginTop: 10, color: '#475569' }}>Her departmanın altında birden fazla iş/hizmet veya alt açılım tanımlayabilirsiniz.</div>
        </div>
        <button
          onClick={() => setShowNewDeptForm(true)}
          disabled={readOnly}
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            cursor: readOnly ? 'not-allowed' : 'pointer',
            fontWeight: 800,
            boxShadow: '0 16px 32px rgba(16, 185, 129, 0.24)',
            opacity: readOnly ? 0.6 : 1,
          }}
        >
          + Yeni Departman
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { key: 'all', label: 'Tümü', value: stats.total, color: '#2563eb' },
          { key: 'active', label: 'Aktif', value: stats.active, color: '#059669' },
          { key: 'passive', label: 'Pasif', value: stats.passive, color: '#dc2626' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as typeof filter)}
            style={{
              textAlign: 'left',
              border: filter === item.key ? `2px solid ${item.color}` : '1px solid #e5e7eb',
              background: 'white',
              borderRadius: 16,
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>{item.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: item.color, marginTop: 8 }}>{item.value}</div>
          </button>
        ))}
      </div>

      <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e7eb', background: 'white', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 18px',
            background: filter === 'all' ? '#3b82f6' : '#f3f4f6',
            color: filter === 'all' ? 'white' : '#222',
            border: 'none',
            borderRadius: 4,
            fontWeight: filter === 'all' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Tümü</button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '6px 18px',
            background: filter === 'active' ? '#10b981' : '#f3f4f6',
            color: filter === 'active' ? 'white' : '#222',
            border: 'none',
            borderRadius: 4,
            fontWeight: filter === 'active' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Aktif</button>
        <button
          onClick={() => setFilter('passive')}
          style={{
            padding: '6px 18px',
            background: filter === 'passive' ? '#ef4444' : '#f3f4f6',
            color: filter === 'passive' ? 'white' : '#222',
            border: 'none',
            borderRadius: 4,
            fontWeight: filter === 'passive' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Pasif</button>
      </div>
      <DepartmentCreateModal
        isOpen={showNewDeptForm}
        onClose={() => setShowNewDeptForm(false)}
        onSuccess={async () => {
          setShowNewDeptForm(false);
          await loadData();
        }}
      />
      <DepartmentCreateModal
        isOpen={!!editDepartment}
        onClose={() => setEditDepartment(null)}
        onSuccess={async () => {
          setEditDepartment(null);
          await loadData();
        }}
        editData={editDepartment}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 12, textAlign: "left" }}>Departman Adı</th>
              <th style={{ padding: 12, textAlign: "left" }}>Açıklama</th>
              <th style={{ padding: 12, textAlign: "left" }}>Alt Açılımlar</th>
              <th style={{ padding: 12, textAlign: "center" }}>Aktif</th>
              <th style={{ padding: 12, textAlign: "center" }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12, textAlign: "left" }}>{dept.name}</td>
                <td style={{ padding: 12, textAlign: "left" }}>{(dept.description || "-").split("\n").find((line) => line.trim() && !line.trim().startsWith("İş/Hizmetler:") && !line.trim().startsWith("- ")) || "-"}</td>
                <td style={{ padding: 12, textAlign: 'left' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(dept.sub_items || []).length === 0 ? (
                      <span style={{ color: '#94a3b8' }}>Alt açılım yok</span>
                    ) : (
                      (dept.sub_items || []).map((subItem) => (
                        <span key={subItem.id} style={{ padding: '4px 10px', borderRadius: 999, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: 12 }}>
                          {subItem.name}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={dept.is_active}
                    disabled={readOnly}
                    onChange={async (e) => {
                      try {
                        await updateDepartment(dept.id, { is_active: e.target.checked });
                        await loadData();
                      } catch (err) {
                        alert("Güncelleme hatası: " + String(err));
                      }
                    }}
                    style={{ width: 18, height: 18 }}
                    title={dept.is_active ? "Aktif" : "Pasif"}
                  />
                </td>
                <td style={{ padding: 12, textAlign: "center", display: "flex", gap: 6, justifyContent: "center" }}>
                  {!readOnly && (
                    <>
                      <button
                        onClick={() => setEditDepartment(dept)}
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
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
