# Quote (Teklif) Domain Tasarımı

Bu doküman, teklif (quote) domaininin iş kurallarını, durum akışını, yetkilendirme modelini ve API sözleşme prensiplerini tanımlar.  
Hedef: sürdürülebilir, test edilebilir ve profesyonel bir backend temeli.

---

## 1) Amaç ve Kapsam

Quote domaini aşağıdaki yetenekleri kapsar:

- Teklif oluşturma
- Teklif güncelleme
- Teklif listeleme (filtre + sayfalama)
- Teklif detay görüntüleme
- Durum geçişleri (taslak, gönderildi, onaylandı, reddedildi)
- (Opsiyonel) yumuşak silme (soft delete)

Kapsam dışı (ilk faz):
- Çoklu dil desteği
- İleri seviye raporlama
- Harici ERP senkronizasyonu

---

## 2) Terimler

- **Teklif (Quote):** Satın alma/tedarik bağlamında oluşturulan teklif kaydı.
- **Sahip (Owner):** Teklifi oluşturan kullanıcı.
- **Durum (Status):** Teklifin yaşam döngüsündeki anlık hali.
- **Yumuşak Silme (Soft Delete):** Kayıt fiziksel silinmeden pasife çekilir.

---

## 3) Durum Modeli (State Machine)

Geçerli durumlar:

- `taslak`
- `gonderildi`
- `onaylandi`
- `reddedildi`
- `iptal` (opsiyonel, faz-2)

İzinli geçişler:

1. `taslak -> gonderildi`
2. `gonderildi -> onaylandi`
3. `gonderildi -> reddedildi`
4. `taslak -> iptal` (opsiyonel)
5. `gonderildi -> iptal` (opsiyonel; iş kuralına bağlı)

İzinli olmayan tüm geçişler reddedilir.

Kural:
- `onaylandi` ve `reddedildi` terminal durumdur (ilk fazda geri dönüş yok).

---

## 4) Yetkilendirme Matrisi

Roller (ilk faz):
- `kullanici`
- `admin`

| İşlem | kullanici | admin |
|---|---|---|
| Teklif oluşturma | Kendi adına evet | Evet |
| Teklif güncelleme | Sadece kendi teklifi | Evet |
| Teklif listeleme | Sadece kendi kayıtları | Tüm kayıtlar |
| Teklif detay | Sadece kendi kayıtları | Tüm kayıtlar |
| Durum geçişi | Kural dahilinde kendi kaydı | Evet |

Ek kural:
- Kullanıcı başka kullanıcıya ait kaydı göremez/güncelleyemez.

---

## 5) İş Kuralları

### 5.1 Oluşturma
- Başlık zorunlu
- Para birimi zorunlu ve whitelist içinde olmalı (örn: TRY, USD, EUR)
- Son geçerlilik tarihi geçmişte olamaz
- Kalem listesi boş olamaz (faz-1 tercihi: en az 1 kalem)

### 5.2 Güncelleme
- `taslak` durumunda alanlar güncellenebilir
- `gonderildi` durumunda sadece sınırlı alanlar güncellenebilir (örn: not)
- `onaylandi/reddedildi` durumunda içerik güncellenemez
- Güncelleme yapan kullanıcı bilgisi iz kaydına yazılır

### 5.3 Listeleme
- Varsayılan sıralama: `created_at desc`
- Filtreler:
  - durum
  - tarih aralığı
  - metin arama (başlık/açıklama)
- Sayfalama zorunlu (page/size)

### 5.4 Silme
- İlk faz öneri: fiziksel silme yok
- Soft delete alanı: `silindi_mi`, `silinme_tarihi`
- Silinen kayıtlar varsayılan listede görünmez

---

## 6) API Sözleşme Prensipleri (Türkçe)

Not: Kod seviyesinde alan adları İngilizce kalabilir; açıklamalar ve dokümantasyon Türkçe olacaktır.

Önerilen şema adları:
- `QuoteCreate`
- `QuoteUpdate`
- `QuoteOut`
- `QuoteListOut`
- `MessageOut`
- `QuoteStatus` (enum)

### 6.1 Standart Yanıt Yapısı
- Başarılı yanıtlarda veri modeli dönülür
- Hatalarda standart hata modeli kullanılır:
  - `kod`
  - `mesaj`
  - `detay` (opsiyonel)
  - `iz_id` (opsiyonel, üretim için önerilir)

---

## 7) Hata Kodları ve HTTP Eşlemeleri

- `VALIDATION_ERROR` -> 422
- `UNAUTHORIZED` -> 401
- `FORBIDDEN` -> 403
- `NOT_FOUND` -> 404
- `CONFLICT` -> 409
- `INVALID_STATUS_TRANSITION` -> 409
- `INTERNAL_ERROR` -> 500

Kural:
- Domain kaynaklı beklenen hatalar 4xx ile döner.
- Beklenmeyen hatalar 500 + iz kaydı ile takip edilir.

---

## 8) Gözlemlenebilirlik ve Kayıt (Logging)

- Her kritik işlem için bilgi logu:
  - kullanıcı_id
  - teklif_id
  - işlem_tipi
  - sonuç
- Hatalarda:
  - hata kodu
  - iz_id
  - teknik detay (güvenli maskeleme ile)

---

## 9) Test Stratejisi

### 9.1 Servis Katmanı Testleri
- Teklif oluşturma başarılı/başarısız
- Yetkisiz güncelleme engeli
- Geçersiz durum geçişi engeli
- Listeleme filtre ve sayfalama doğruluğu

### 9.2 API Testleri
- Endpoint sözleşme testleri
- HTTP durum kodu doğrulamaları
- Hata modeli tutarlılığı

Hedef:
- Domain kuralları servis testlerinde korunmalı
- API testleri entegrasyon davranışını doğrulamalı

---

## 10) Faz Planı

### Faz-1 (hemen)
- Durum modeli + yetki matrisi
- create/update/list/get
- temel test seti
- Türkçe dokümantasyon

### Faz-2
- iptal durumu
- soft delete
- audit alanlarını genişletme
- performans iyileştirmeleri

### Faz-3
- çoklu dil desteği (i18n)
- gelişmiş raporlama / dış entegrasyonlar
