// web/src/components/DemoDataTab.tsx
import React, { useState } from "react";
import { http } from "../lib/http";

function getErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail === "string"
  ) {
    return (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || "Demo veri yükleme hatası";
  }
  return "Demo veri yükleme hatası";
}

export const DemoDataTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadDemoData = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await http.post("/admin/load-demo-data", {});
      
      setMessage({
        type: "success",
        text: response.data.message || "Demo verileri başarıyla yüklendi",
      });
      setShowConfirm(false);
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Demo Verileri Yönet</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sistem test verileriyle doldurulabilir. Yeni veriler eklenirse buraya eklenir.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Demo Data Content */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Users Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">👤 Personel</h3>
                <p className="text-sm text-blue-700 mt-1">
                  5 satın alma personeli<br/>
                  (Uzman, Yönetici, Müdür, Direktör)
                </p>
              </div>
              <span className="text-3xl">5</span>
            </div>
            <p className="text-xs text-blue-600 mt-3">
              🔐 Şifre: Test123!
            </p>
          </div>

          {/* Departments Card */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900">🏢 Departmanlar</h3>
                <p className="text-sm text-purple-700 mt-1">
                  5 departman<br/>
                  (Personel rolleriyle eşleştirilmiş)
                </p>
              </div>
              <span className="text-3xl">5</span>
            </div>
          </div>

          {/* Companies Card */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900">🏭 Firmalar</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  5 firma ile renkli kodlar<br/>
                  (Mor, Mavi, Sarı, Yeşil, Kırmızı)
                </p>
              </div>
              <span className="text-3xl">5</span>
            </div>
          </div>

          {/* Projects Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">📊 Projeler</h3>
                <p className="text-sm text-green-700 mt-1">
                  25 proje (5 per firma)<br/>
                  @ 5.500.000 TL bütçe
                </p>
              </div>
              <span className="text-3xl">25</span>
            </div>
          </div>
        </div>

        {/* More Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
          <p>✅ <strong>Tedarikçiler:</strong> 6 örnek tedarikçi (kategorileriyle)</p>
          <p>✅ <strong>SMTP Ayarları:</strong> olimposyapi.com:465 (SSL)</p>
          <p>✅ <strong>Proje Sorumlusu E-mail:</strong> serkaneryilmazz@gmail.com</p>
        </div>

        {/* Confirmation Dialog */}
        {!showConfirm ? (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Yükleniyor..." : "📥 Demo Verileri Yükle"}
            </button>
            <p className="mt-2 text-xs text-gray-600">
              Bu işlem mevcut verileri etkilemeyecektir. Zaten mevcut kayıtlar atlanacaktır.
            </p>
          </div>
        ) : (
          <div className="border-t pt-4 bg-red-50 p-4 rounded-lg space-y-3">
            <p className="font-semibold text-red-700">⚠️ Onay Gereklidir</p>
            <p className="text-sm text-gray-700">
              Demo verilerini yükleyeceksiniz. Bu işlem hızlı ve güvenlidir. 
              Zaten mevcut olan kayıtlar yeniden oluşturulmayacaktır.
            </p>
            <div className="flex gap-3">
              <button
                onClick={loadDemoData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? "⏳ Yükleniyor..." : "✅ Evet, Yükle"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-medium"
              >
                ❌ İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Versioning Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-amber-900">💡 Nasıl Kullanılır?</p>
        <ul className="mt-2 text-amber-800 space-y-1 list-disc list-inside">
          <li>Yeni demo veri eklemek istediğinizde: <code className="bg-amber-100 px-1 rounded">create_projects_only.py</code> gibi scripte ekleyin</li>
          <li>Scripti yazın ve buraya ekleyin</li>
          <li>Backend endpointi <code className="bg-amber-100 px-1 rounded">/admin/load-demo-data</code>'ya entegre edin</li>
          <li>Hesap ve şifreler: test@example.com / Test1234!</li>
        </ul>
      </div>
    </div>
  );
};
