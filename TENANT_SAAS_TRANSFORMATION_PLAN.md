# ProcureFlow Stratejik Partner SaaS Donusum Plani

Bu dokuman, ProcureFlow'un Buyera Asistans altinda calisan cok kiracili
satin alma platformuna donusumu icin ana referanstir.

Amac:

- Buyera Asistans'i platform sahibi olarak konumlandirmak
- Musteri sirketleri Stratejik Partner olarak modelllemek
- Stratejik Partner yoneticisi, personel ve tedarikci rollerini net ayirmak
- Satin alma, teklif, proje, onay ve tedarikci akislarini Stratejik Partner merkezli hale getirmek
- Yapilanlari isaretleyerek surekli ilerleme kaydi tutmak

Terminoloji karari:
- Is dilinde `tenant` yerine `Stratejik Partner` terimi kullanilir.
- Teknik uyumluluk nedeniyle kod, tablo ve kolon adlarinda `tenant` isimleri korunabilir.
- Kullaniciya gorunen buton, sekme, baslik, aciklama, bos-durum, toast ve rapor etiketi metinleri Turkce yazilir.
- Teknik uyumluluk veya geriye donuk entegrasyon gereken API alanlari, query parametreleri, migration adlari, tablo ve kolon adlari Ingilizce veya mevcut teknik adiyla korunabilir.
- RFQ, API, SMTP, webhook, JSON ve CSV gibi yerlesik teknik veya sektor terimleri gerekli oldugu yerde korunabilir; bunlarin kullaniciya gorunen aciklama metinleri yine Turkce yazilir.
- Ayrintili karsilik listesi ve tekrar kullanilabilir dil notlari Terminoloji_karari.md dosyasinda tutulur.

Rol/departman/personel izinleri referans notu:
- Rol siniflandirma, menu-agaci yetkileri, kisiye ozel izin override kurallari ve personel bilgi mimarisi akisi
	icin ana calisma dosyasi `docs/ROL_DEPARTMAN_PERSONEL_IZINLERI.md` olarak tanimlandi.
- Rol/izin veya personel sekmesiyle ilgili yeni bir gelistirme yapilacaginda once bu referans dosya guncellenir,
	sonra kod degisikligi uygulanir.

## 0. Nihai Platform Mimarisi (2026-04-16 Mutabik Kalinmis)

### 0.1 Dort Ana Scope

Sistem 4 kanonik scope ile calisir. Her kullanici bu dortluden birine aittir.
Yetki karari: scope -> role_profile -> izin katalogu -> override -> delegation

- platform : Buyera Asistans operasyon ve yonetim ekibi
- partner  : Satinalma operasyonu yuruten stratejik partner sirketleri ve personeli
- supplier : Teklif veren / urun-hizmet satan tedarikci sirketleri ve personeli
- channel  : Platforma partner veya tedarikci getiren; komisyon/hakediş/sayi bazli caliṡan is gelistirme ortaklari

### 0.2 Kanonik Profil Tablosu

| Scope    | Profil Kodu                  | Gorsel Ad                        | Hesap Tipi   | Ozel Rol Uretir mi |
|----------|------------------------------|----------------------------------|--------------|---------------------|
| platform | platform.super_admin         | Super Admin                      | sistem       | hayir               |
| platform | platform.portal_admin        | Portal Admini                    | sistem       | hayir               |
| platform | platform.support_agent       | Destek Temsilcisi                | sistem       | hayir               |
| platform | platform.finance_officer     | Finans Sorumlusu                 | sistem       | hayir               |
| partner  | partner.account_owner        | Partner Ana Yoneticisi           | owner        | evet                |
| partner  | partner.org_admin            | Partner Yoneticisi               | admin        | evet (sinirli)      |
| partner  | partner.procurement_manager  | Satin Alma Muduru                | custom       | hayir               |
| partner  | partner.technical_specialist | Teknik Uzman / Mimar             | custom       | hayir               |
| partner  | partner.auditor              | Denetci / Finansal Izleyici (RO) | custom       | hayir               |
| partner  | partner.custom_role          | Ozel Partner Rolu                | custom       | hayir               |
| supplier | supplier.account_owner       | Tedarikci Ana Yoneticisi         | owner        | evet                |
| supplier | supplier.org_admin           | Tedarikci Yoneticisi             | admin        | evet (sinirli)      |
| supplier | supplier.sales_senior        | Kidemli Satis Temsilcisi         | custom       | hayir               |
| supplier | supplier.pricing_specialist  | Fiyatlandirma / Maliyet Uzmani   | custom       | hayir               |
| supplier | supplier.custom_role         | Ozel Tedarikci Rolu              | custom       | hayir               |
| channel  | channel.account_owner        | Kanal Ana Yoneticisi             | owner        | evet                |
| channel  | channel.team_lead            | Ekip Lideri                      | admin        | hayir               |
| channel  | channel.agent                | Kanal Temsilcisi                 | staff        | hayir               |
| channel  | channel.finance_viewer       | Komisyon / Hakediş Izleyici      | custom       | hayir               |
| channel  | channel.auditor              | Salt Okunur Denetci              | custom       | hayir               |

### 0.3 Mevcut Role/System_Role -> Yeni Profil Eslemesi (Gecis Tablosu)

Mevcut role ve system_role alanlari Faz A boyunca korunur.
Yeni role_profile_code ek kolon olarak Faz B ile eklenir.

| business_role        | system_role        | Yeni Profil                  |
|----------------------|--------------------|------------------------------|
| super_admin          | super_admin        | platform.super_admin         |
| admin                | platform_operator  | platform.portal_admin        |
| admin                | platform_support   | platform.support_agent       |
| admin                | tenant_owner       | partner.account_owner        |
| admin                | tenant_admin       | partner.org_admin            |
| satinalma_direktoru  | tenant_member      | partner.procurement_manager  |
| satinalma_yoneticisi | tenant_member      | partner.procurement_manager  |
| satinalma_uzmani     | tenant_member      | partner.technical_specialist |
| satinalmaci          | tenant_member      | partner.custom_role (staff)  |
| supplier             | supplier_user      | supplier.sales_senior        |

### 0.4 Channel Scope Modeli

Channel nedir:
Platforma yeni partner veya tedarikci getiren gercek kisi veya organizasyondur.
Kendi ozel paneli vardir. Partner veya supplier ic is akisini goremez.

Ekip kurma:
- channel.account_owner kendi ekibini kurar ve yonetir.
- Super admin tum kanal organizasyonlarini ve uyeleri gorur.
- Super admin kanal hesabina izin verebilir veya kaldirabilir.
- Super admin yetki verdigi platform personeli de kanal ekranlarini yonetebilir.

Kanal panel modulleri:
- Kanal Dashboard: aktif lead, donusen lead, aktif portfoy, bekleyen hakediş
- Portfoyum: getirdigim partner ve tedarikçiler, durumları
- Lead Yonetimi: aday ekleme, durum izleme, atama
- Ekip Yonetimi: temsilci davet etme, rol verme
- Komisyon / Hakediş: oran, tahakkuk, odeme gecmisi, bekleyen kalemler
- Sozlesmelerim: platform ile calisma ile termleri, oranlar, hedef sayilar
- Raporlar: donusum orani, aktif-pasif portfoy, aylik hakediş ozeti

### 0.5 Hakediş Modeli

Iki hakedis modu:

1. Komisyon modu:
   - Getirilen her partner veya tedarikci icin oran bazli sur komisy
   - Partner komisyonu ve supplier komisyonu birbirinden bagimsiz ayarlanir
   - Abonelik seviyesine gore oran farklilasabilir

2. Sabit + Sayi modu:
   - Belirli sayida partner/tedarikci baglandiginda sabit odeme tetiklenir
   - Sayi sarti sağlanınca ödeme otomatik tahakkuk eder

Ortak kurallar:
- Fiyat ve oranlari super_admin gunceller
- Yetki verilmisse platform.finance_officer veya yetkilendirilmis admin de gorur ve yonetir
- Attribution kalicidir: getiren kanalin kaydina baglanir, degismez
- Partner komisyon orani ve supplier komisyon orani bağımsız tanim yapılır

### 0.6 Ozel Liste / Vitrin Modeli

- Platform genel listesinde gorunmek ucretlidir.
- Hakedisini kazanmamis kanal uyesi getirdiklerini sadece kendi portfoyunde gorur.
- Hakediş sarti saglandiktan sonra getirdigi tedarikci/partner platform listesinde gorunmeye baslar.
- Stratejik partner teklif aldiginda ozel teklif secenegi aktifse, ilgili tedarikci ozel konumda listelenir.
- Bu akis ekstra ucrete tabidir; fiyat super_admin tarafindan yonetilir.

### 0.7 Izin Katalogu Taslagi: Hangi Modullere Hangi Profil Erişir

| Modul                         | platform SA | portal admin | destek | finans | partner owner | partner manager | partner tech | partner RO | supplier owner | supplier sales | channel owner | channel agent |
|-------------------------------|:-----------:|:------------:|:------:|:------:|:-------------:|:---------------:|:------------:|:----------:|:--------------:|:--------------:|:-------------:|:--------------|
| Global Dashboard              | ✓           | ✓            | -      | ✓      | -             | -               | -            | -          | -              | -              | -             | -             |
| Organizasyon (tenant) Yonetimi| ✓           | ✓            | -      | -      | -             | -               | -            | -          | -              | -              | -             | -             |
| Global Finans / Faturalama    | ✓           | -            | -      | ✓      | -             | -               | -            | -          | -              | -              | -             | -             |
| Sistem Ayarlari               | ✓           | -            | -      | -      | -             | -               | -            | -          | -              | -              | -             | -             |
| Master Log / Denetim          | ✓           | ✓            | -      | -      | -             | -               | -            | ✓ RO       | -              | -              | -             | -             |
| Merkez Rol Yonetimi           | ✓           | -            | -      | -      | -             | -               | -            | -          | -              | -              | -             | -             |
| Operasyon Dashboard           | ✓           | ✓            | ✓      | -      | ✓             | -               | -            | -          | ✓              | -              | -             | -             |
| Destek / Ticket               | ✓           | ✓            | ✓      | -      | -             | -               | -            | -          | -              | -              | -             | -             |
| Ihtilaf / Sikayet             | ✓           | ✓            | ✓      | -      | -             | -               | -            | -          | -              | -              | -             | -             |
| Personel Yonetimi             | ✓           | ✓            | -      | -      | ✓             | -               | -            | RO         | ✓              | -              | ✓             | -             |
| Rol / Izin Yonetimi           | ✓           | ✓            | -      | -      | ✓             | -               | -            | -          | ✓              | -              | ✓             | -             |
| Butce Yonetimi                | ✓           | -            | -      | -      | ✓             | -               | -            | RO         | -              | -              | -             | -             |
| Teklif / RFQ                  | ✓           | -            | -      | -      | ✓             | ✓               | ✓ (teknik)   | RO         | ✓              | ✓              | -             | -             |
| Teklif Karsilastirma          | ✓           | -            | -      | -      | ✓             | ✓               | -            | -          | -              | -              | -             | -             |
| AI Pazarlik                   | ✓           | -            | -      | -      | ✓             | ✓               | -            | -          | -              | -              | -             | -             |
| Onay / PO / Sozlesme          | ✓           | -            | -      | -      | ✓             | taslak          | -            | RO         | ✓              | SO             | -             | -             |
| Teknik Dosyalar / CAD-BOM     | -           | -            | -      | -      | ✓             | -               | ✓            | RO         | -              | -              | -             | -             |
| Sartname Kutuphanesi          | -           | -            | -      | -      | ✓             | -               | ✓            | RO         | -              | -              | -             | -             |
| Sirket Profili / Belgeler     | -           | -            | -      | -      | ✓             | -               | -            | RO         | ✓              | -              | ✓             | -             |
| Katalog / Fiyat               | -           | -            | -      | -      | -             | -               | -            | -          | ✓              | ✓              | -             | -             |
| Banka / Cari Hesaplar         | -           | -            | -      | -      | -             | -               | -            | -          | ✓              | -              | ✓             | -             |
| Kanal Dashboard               | ✓           | -            | -      | ✓      | -             | -               | -            | -          | -              | -              | ✓             | ✓             |
| Portfoy / Lead Yonetimi       | ✓           | -            | -      | -      | -             | -               | -            | -          | -              | -              | ✓             | ✓             |
| Komisyon / Hakediş            | ✓           | -            | -      | ✓      | -             | -               | -            | -          | -              | -              | ✓             | ✓ RO          |
| Ozel Liste / Vitrin Yonetimi  | ✓           | -            | -      | ✓      | -             | -               | -            | -          | -              | -              | -             | -             |
| Abonelik / Paket Yonetimi     | ✓           | ✓            | -      | ✓      | ✓ kendi       | -               | -            | -          | ✓ kendi        | -              | ✓ kendi       | -             |

Not: RO = salt okunur, SO = satis siparisi, taslak = nihai onay olmadan

### 0.8 Odeme Platformu (Zorunlu Alt Yapi)

Platformin odeme alabilmesi icin asagidaki entegrasyonlar gereklidir.

Kabul edilecek odeme yontemleri:
- Kredi / banka karti : Iyzico veya Sipay (Turkiye lokali, oncelikli)
- Havale / EFT        : Manuel akis ile baslayip banka API ile otomatize edilecek
- PayTR               : Yedek yerel saglayici
- PayPal              : Uluslararasi odemeler (Turkiye'de alici sinirlamasi dikkate alinmali)
- Kripto              : NOWPayments veya CoinPayments; BTC, ETH, USDT baz alinabilir

Oneri mimari:
- Her saglayici icin ayri adaptör
- Merkez payment_transactions tablosu
- Fatura ve makbuz otomasyonu
- Hakediş ve komisyon akisi odeme motoru ile entegre
- Kanal hakedis odemeleri odeme motorundan tetiklenir

Uygulama oncelik sirasi:
1. Iyzico (kredi karti)
2. Havale / EFT (manuel -> API)
3. PayTR (yedek yerel)
4. NOWPayments / CoinPayments (kripto)
5. PayPal (uluslararasi)

Detay is akisi: Paket odeme-infra — Odeme Alt Yapisi ve Entegrasyon

## 1. Hedef Urun Konumu

Buyera Asistans, sirketlerin su ihtiyaclarini yoneten cok kiracili bir
platform olmalidir:

- Tenant onboarding
- Firma yapisi, departman, rol ve personel yonetimi
- Proje, RFQ, teklif toplama, revizyon ve onay akislarinin dijital yonetimi
- Tedarikci yonetimi ve ileride platform tedarikci havuzu
- Paketleme, moduler kullanim ve abonelik bazli hizmet modeli

Referans urunlerden cikan yonler:
- PratisPro: talepten siparise moduler satin alma omurgasi
- Promena: enterprise procurement suite + hizmet modeli
- Ihalebul: dis ihale kesfi ve firsat havuzu mantigi

## 2. Ana Mimari Karar

Temel ilke:
- Admin bir personel tipi degildir.
- Admin, tenant sahibi veya tenant yoneticisi hesabidir.
- Personel, tenant icindeki operasyonel kullanicidir.
- Tedarikci, tenant disi ama sistemle etkilesen ayri aktordur.

Bu nedenle sistemin ana kok varligi artik user degil, tenant olmalidir.

## 3. Hedef Domain Modeli

### 3.1 Platform Katmani

Bu katman Buyera Asistans tarafindan yonetilir.

#### platform_users
- id
- full_name
- email
- password_hash
- role
- is_active
- created_at
- updated_at

Kullanim:
- super_admin
- destek / operasyon ekibi

#### subscription_plans
- id
- code
- name
- tier
- monthly_price
- yearly_price
- max_users
- max_suppliers
- max_projects
- feature_flags_json
- is_active

#### platform_features
- id
- code
- name
- description
- is_active

#### platform_supplier_pool
- id
- legal_name
- display_name
- tax_number
- categories_json
- regions_json
- website
- email
- phone
- onboarding_status
- score
- is_active

#### platform_email_templates
- id
- code
- name
- subject_template
- body_template
- is_active

### 3.2 Tenant Katmani

Bu katman musteri sirket hesabinin kok yapisidir.

#### tenants
- id
- slug
- legal_name
- brand_name
- logo_url
- tax_number
- tax_office
- country
- city
- address
- subscription_plan_id
- owner_user_id
- status
- onboarding_status
- created_at
- updated_at

Not:
- Sistemdeki tum operasyonel kayitlar tenant_id ile ayrismalidir.

#### tenant_settings
- id
- tenant_id
- primary_color
- secondary_color
- smtp_mode
- default_system_email_id
- custom_domain
- support_email
- support_phone
- locale
- timezone
- quote_terms_template
- approval_policy_json
- is_active

#### tenant_modules
- id
- tenant_id
- feature_code
- enabled
- limits_json

### 3.3 Tenant Kimlik ve Organizasyon Katmani

#### tenant_users
- id
- tenant_id
- full_name
- email
- password_hash
- system_role
- is_active
- is_invited
- invitation_token
- invitation_expires_at
- created_by_user_id
- created_at
- updated_at

System roller:
- tenant_owner
- tenant_admin
- tenant_member
- supplier_user

#### tenant_departments
- id
- tenant_id
- name
- description
- parent_department_id
- is_active
- created_by_user_id

#### tenant_roles
- id
- tenant_id
- name
- description
- is_system
- hierarchy_level
- parent_role_id
- is_active
- created_by_user_id

#### tenant_role_permissions
- id
- tenant_role_id
- permission_code

#### tenant_user_assignments
- id
- tenant_user_id
- company_id
- department_id
- role_id
- title
- is_primary
- is_active

### 3.4 Tenant Operasyon Katmani

#### tenant_companies
- id
- tenant_id
- name
- logo_url
- address
- email
- phone
- is_active
- created_by_user_id

## 4. Canli Gecis Notlari

14 Nisan 2026 itibariyla canli veritabani uzerinde asagidaki gecis sirasi
gercek hayatta calistirildi ve dogrulandi:

1. Quote approval gecisi icin `required_business_role` kolonu eklendi.
2. Approval mirror preview calistirildi ve duzeltilecek kayit cikmadi.
3. Final approval migration uygulanarak `required_business_role` zorunlu hale getirildi.
4. Canli DB'de eksik kalan tenant/system_role kolonlari ve tenant tabloları idempotent bir foundation adimiyla tamamlandi.
5. Guvenli `system_role` eslestirmeleri audit preview/apply ile veritabanina yazildi.
6. Aktif admin zincirinden tenant bootstrap calistirildi.
7. Ortam tek tenantli oldugu icin kalan legacy tenant-scoped kayitlar ayni tenant'a kontrollu sekilde backfill edildi.
8. Final audit sonucu:
	- role/system_role issue: 0
	- quote approval transition issue: 0

Bu nokta itibariyla sistem, tenant_id ve system_role alanlari acisindan canli
veritabani seviyesinde minimum calisir tenant omurgasina ulasmistir.

## 5. Operasyonel Kararlar

- `required_business_role`, approval semantiginin ana kaynagidir.
- `required_role`, compatibility mirror olarak tutulur.
- `system_role`, platform ve tenant yetki sinirlarinin ana kaynagidir.
- `business_role`, satin alma operasyon semantigi icin kullanilir.
- Tek tenantli legacy ortamlarda toplu `tenant_id` backfill yalnizca veritabaninda tam olarak 1 tenant varsa guvenli kabul edilir.
- Cok tenantli ortamlarda ayni backfill mantigi otomatik uygulanmamalidir; sahiplik ve bagliliklar tenant bazinda tek tek dogrulanmalidir.

Not:
- Kucuk musteri tek firma ile calisabilir.
- Buyuk musteri birden fazla bagli sirket veya sube tutabilir.

#### tenant_projects
- id
- tenant_id
- company_id
- name
- code
- description
- status
- budget
- currency
- created_by_user_id
- start_date
- end_date

#### tenant_suppliers
- id
- tenant_id
- source_type
- platform_supplier_id
- name
- email
- phone
- tax_number
- category_json
- status
- score
- created_by_user_id

source_type:
- private
- platform_network

#### tenant_rfqs
- id
- tenant_id
- project_id
- company_id
- title
- rfq_type
- status
- revision_no
- deadline_at
- created_by_user_id
- approval_policy_id

#### tenant_rfq_items
- id
- rfq_id
- line_no
- item_name
- quantity
- unit
- spec_text
- target_price

#### tenant_rfq_suppliers
- id
- rfq_id
- supplier_id
- invite_status
- invited_at
- last_response_at

#### tenant_supplier_quotes
- id
- tenant_id
- rfq_id
- supplier_id
- status
- total_amount
- currency
- submitted_at

#### tenant_approvals
- id
- tenant_id
- entity_type
- entity_id
- approval_step
- approver_user_id
- decision
- decided_at
- note

## 4. Mevcut Yapidan Yeni Yapiya Gecis Plani

### Faz 1 - Tenant omurgasi
- [x] tenants tablosunu ekle
- [x] tenant_settings tablosunu ekle
- [x] mevcut admin kullanicilar icin tenant kayitlarini olustur
- [x] mevcut sirketleri tenant ile iliskilendir
- [x] users tablosunu tenant mantigina gore ayir
- [x] departments icin sahiplik alanini baslat
- [x] roles icin sahiplik alanini baslat
- [x] tum kritik tablolara tenant_id ekleme envanterini cikar

### Faz 2 - Kimlik ve yetki ayrimi
- [x] system_role ile business_role ayrimini uygula
- [x] admin kavramini personelden ayir
- [x] tenant_owner ve tenant_admin akisini netlestir
- [x] personel olusturma akisini tenant kullanici olusturma akisina cevir
- [x] supplier_user akisini tenant auth'tan bagimsizlastir

### Faz 3 - Onboarding ve UI
- [x] yeni musteri onboarding akisini tasarla
- [x] plan secimi + tenant olusturma ekranlarini tasarla
- [x] ilk tenant admin hesabi akisini tasarla
- [x] ilk kurulum sihirbazi olustur (self-serve public onboarding `/onboarding`)
- [x] login ekranini platform markasina gore guncelle
- [x] activation ekraninda tenant kimligi goster
- [x] ust bar ve dashboard'da tenant branding goster

### Faz 4 - Operasyonel domain tasinmasi
- [x] projects icin tenant zorunlulugu getir
- [x] suppliers icin tenant zorunlulugu getir
- [x] approvals icin tenant zorunlulugu getir
- [x] quote / rfq domainini tenant-rfq modeline tasi
- [x] private supplier ve platform supplier ayrimini ekle

Uygulanan hizli kapanislar:
- [x] project create akisina tenant bootstrap zorunlulugu icin runtime guard eklendi
- [x] supplier create akisina private supplier tenant guard eklendi
- [x] approval request akisina quote tenant readiness guard eklendi
- [x] AdminPage icinde Onboarding Studio sekmesi ile onboarding iskeleti yayinlandi
- [x] quote / rfq gecisi oncesi tenant tutarliligini olcen `api/scripts/audit_tenant_rfq_readiness.py` eklendi

### Faz 5 - Ticari SaaS yetenekleri
- [x] paketler ve moduller ekranini ekle
- [x] tenant kullanim limitlerini uygula
- [x] faturalama / abonelik altyapisini planla
- [x] super admin tenant yonetim panelini ayir

## 5. Migrasyon Stratejisi

### Adim 1 - Veri envanteri
- Mevcut tablolarin hangi tenant'a ait olacagini tek tek haritala
- user, company, department, role, project, supplier, quote, approval alanlarini tenant perspektifiyle siniflandir

### Adim 2 - Geriye donuk veri kurallari
- Her mevcut admin icin bir tenant olustur
- Adminin olusturdugu company, project, user, department, role kayitlarini o tenant'a bagla
- Eger kayit super_admin tarafindan olusturulmus ama aslinda belli bir musteriyi temsil ediyorsa manuel esleme listesi cikar

### Adim 3 - Ikili gecis donemi
- Bir sure hem created_by_id hem tenant_id beraber kullanilsin
- Okuma tarafinda tenant_id varsa onu tercih et
- Eksik eski kayitlar icin fallback kuralini gecici olarak koru

### Adim 4 - Tam gecis
- Tum sorgular tenant_id tabanli hale gelsin
- created_by_id sadece audit amacli kalsin veya uygun tablolardan kaldirilsin
- Admin paneli tenant yonetim paneline donussun

## 6. Ekran Agaci ve Menu Mimarisi

### 6.1 Platform Public Alan
- [x] Ana sayfa
- [x] Cozumler
- [x] Fiyatlandirma
- [x] Demo talebi
- [x] Musteri girisi
- [x] Tedarikci girisi

### 6.2 Musteri Onboarding
- [x] Plan secimi (self-serve akis)
- [x] Tenant kaydi (self-serve akis)
- [x] Ilk admin hesabi olusturma (super admin api + AdminPage)
- [x] E-posta dogrulama (invitation_token sistemi)
- [x] Kurulum sihirbazi (self-serve public wizard)

### 6.3 Tenant Admin Menusu
- [x] Genel Bakis
- [x] Firma Yapisi
- [x] Departmanlar
- [x] Roller ve Yetkiler
- [x] Personeller
- [x] Tedarikciler
- [x] Projeler
- [x] RFQ / Teklifler
- [x] Onay Akislari
- [x] Raporlar
- [x] Ayarlar
- [x] Paket ve Kullanim

### 6.4 Personel Menusu
- [x] Dashboard (QuoteList + proje bazli giris)
- [x] Gorevli oldugu projeler (ProjectsTab filtrelemesi)
- [x] RFQ ve teklif akisleri (QuoteList + QuoteDetailPage)
- [x] Onay bekleyen isler (ApprovalDashboard)
- [x] Tedarikci iletisim kayitlari (SuppliersTab)
- [x] Profil ve bildirim ayarlari (SettingsTab profil)

### 6.5 Super Admin Menusu
- [x] Tenantlar
- [x] Planlar ve Moduller
- [x] Platform tedarikci havuzu
- [x] Kampanyalar / landing yonetimi
- [x] SMTP / bildirim altyapisi (tenant_settings.smtp_mode + email_service)
- [x] Kullanici ve destek kayitlari
- [x] Finans / abonelik / faturalama
- [x] Platform analitikleri

## 7. UX ve Iletisim Ilkeleri

Platform sadece teknik olarak guclu degil, kullanirken rahat hissettiren bir deneyim sunmalidir.

Ilkeler:
- Kullanici sisteme girdiginde ne yapacagini anlamali
- Kritik akislar sihirbaz mantigiyla ilerlemeli
- Hata mesajlari teknik degil yol gosterici olmali
- Tedarikci ve musteri iletisimi sade, sicak ve guven veren bir dille kurulmalı
- Yogun satin alma operasyonlari icinde stresi azaltan sade ekran dili kullanilmali

## 8. Hemen Sonraki Uygulama Adimlari

- [x] Hedef tablo envanterini mevcut modellerle birebir eslestir
- [x] tenant modelini ve temel migration dosyalarini hazirla
- [x] auth akislarini tenant_owner / tenant_admin / tenant_member olarak ayir
- [x] AdminPage bilgi mimarisini tenant admin paneli mantigina gore yeniden kur
- [x] super admin ile tenant admin navigasyonunu ayir
- [x] tenant scope envanterini otomatik dogrulayan `api/scripts/audit_tenant_scope_inventory.py` scriptini ekle
- [x] `api/scripts/bootstrap_tenants.py` scripti ile mevcut adminlerden tenant olusturma, company baglama ve tenant user system_role normalizasyonunu tek akista calistirilabilir hale getir

Bugunden sonraki uygulama backlog'u, soyut baslik yerine teslim paketi mantigiyla izlenmelidir.

### Paket 1 - Auth ve Kimlik Sertlestirme

Durum notu:

- Teknik helper/guard cleanup ve hedefli backend/frontend regresyon turlari bu paket icin yesil duruma getirildi.
- Kalan [~] maddeler agirlikli olarak urun semantigi, UX ayrimi veya dokumantasyon seviyesindeki tamamlayici isler olarak okunmali.
- Bir sonraki uygulama diliminde Paket 1 altinda yeni auth helper dagitimi yerine urun akislarinda kalan owner/admin/member davranis farklari veya sonraki paket gecisleri hedeflenebilir.

- [x] login / refresh / me akislari icin role alanini sadece compatibility fallback seviyesine indir
- [x] tenant_owner / tenant_admin / tenant_member ayrimini tum auth guard, menu ve redirect kararlarinda tamamla
- [x] supplier_user akisini tenant ic kullanici oturumundan net sekilde ayir
- [x] bu paket sonunda auth payload orneklerini README ve test fixture'larinda tek formatta sabitle
- [x] tenant_owner branding ve workspace kimligini tenant_admin'den ayri hale getir
- [x] tenant_owner icin tenant kimligi ve temel ayarlar yazma yetkisini tenant_admin'den ayir
- [x] tenant governance aksiyonlarini helper ve test seviyesinde super_admin odakli sinirla
- [x] backend tenant governance authz helper'ini admin router tenant endpointlerinde standartlastir
- [x] sqlite tabanli backend regresyon paketinde tenant governance + settings + auth birlikte tekrar yesile dondu
- [x] advanced settings icinde paylasilan SMTP profil yonetimini helper bazli hale getir
- [x] advanced settings router icindeki ham admin role kontrollerini shared authz helper'larina tasi
- [x] admin ve advanced settings router icindeki tekrar eden rol kumelerini shared authz sabitlerinde topla
- [x] report router icindeki quote erisim guard'larini ortak authz helper mantigina yaklastir
- [x] supplier router icindeki creator veya super_admin guard tekrarlarini yardimci fonksiyonda birlestir
- [x] supplier router icindeki tenant veya creator tabanli query scope filtrelerini ortak yardimcida topla
- [x] admin router icindeki proje olusturma ve global gorunum rol kumelerini authz helper katmanina tasi
- [x] admin router icindeki son super_admin silme koruma dallarini isimli helper'lara ayir
- [x] admin router icindeki kullanici system_role cozumleme ve reserved role mantigini authz katmanina tasi
- [x] admin router icindeki admin-managed account ayrimini authz helper ve query helper katmanina tasi
- [x] frontend auth helper katmaninda platform workspace label ve platform staff ayrimini ortaklastir
- [x] AdminPage icindeki platform staff ayrimini frontend auth helper ile standartlastir
- [x] PersonnelCreateModal icindeki privileged role ve varsayilan system_role kararlarini frontend auth helper katmanina tasi
- [x] rol ikonu fallback mantigini frontend auth helper katmaninda ortaklastir
- [x] RolesTab icindeki rol hiyerarsisi ve normalize fallback mantigini frontend auth helper katmanina tasi
- [x] frontend auth/route/settings/admin helper refactorlari icin genisletilmis Vitest paketi tekrar yesile dondu
- [x] backend auth/settings/governance ve frontend auth/routing/settings/admin hedefli dogrulama turlari birlikte tekrar yesile dondu
- [x] sqlite tabanli izole backend authz paketindeki cyclic FK teardown warning'i kaldir
- [x] sqlite tabanli daha genis backend auth/settings/authz paketi tekrar yesile dondu
- [x] admin router icindeki kalan dusuk seviyeli legacy role guard'lari shared authz helper ve sabitlerine bagla
- [x] user profile router icindeki ham admin profile erisim rol kumesini shared authz helper'a tasi ve authz testi ekle
- [x] system email router icindeki ham admin erisim rol kumesini shared authz helper'a tasi ve authz testi ekle
- [x] approval router icindeki admin bypass kontrolunu ortak authz helper'a indir ve pending approval gorunurlugunu test et
- [x] admin router icindeki tekrar eden super_admin veya tenant_admin yuzey kontrolunu dar kapsamli authz helper'a tasi
- [x] frontend workspace fallback etiketlerini owner/admin/member semantigine yaklastir ve DashboardPage'i ortak helper'a bagla
- [x] frontend auth session katmaninda legacy user payload'larini business_role ve system_role fallback'lariyla normalize et
- [x] settings yuzeyinde super_admin, tenant_owner, tenant_admin ve platform_support ayrimini backend ve frontend testleriyle sabitle
- [x] admin tenant governance formunu platform support veya operator icin gercek salt-okunur moda getir ve super_admin edit akisini koru
- [x] backend tenant governance lifecycle endpointlerinde listeleme disinda create ve update guard'larini da super_admin odakli testlerle sabitle
- [x] platform staff icin personel sekmesini salt-okunur moda al ve yazma aksiyonlarini gizle veya kilitle
- [x] platform staff icin companies, departments ve roles sekmelerini de salt-okunur moda getir
- [x] platform staff icin projects sekmesini de salt-okunur moda getir ve yeni proje veya silme aksiyonlarini kapat
- [x] platform staff icin suppliers sekmesini de salt-okunur moda getir; inceleme akisini koruyup create-delete-user-management aksiyonlarini kapat
- [x] platform staff helper semantiginde super_admin'i ayir ve AdvancedSettingsTab icinde tum yazma aksiyonlarini gercek salt-okunur moda kilitle

	- 2026-04-15 kapanis notu: Paket 1 altindaki kalan owner/admin/member semantik maddeleri de hedefli regresyon turlariyla kapatildi. Backendte tests/test_auth.py + tests/test_tenant_governance_authz.py paketi 20/20 yesil dondu; tenant_owner workspace_label ayrimi, tenant identity write izni ve tenant governance endpointlerinin super_admin odakli guard'lari tekrar dogrulandi. Frontendte src/test/settings-tab.test.tsx + src/test/permissions.test.ts + src/test/auth-routing.test.tsx + src/test/admin-page-tenant-governance.test.tsx paketi 20/20 yesil dondu; boylece menu, redirect, workspace label ve salt-okunur governance davranislari tenant_owner/tenant_admin/platform_staff ekseninde sabitlendi.

### Paket 2 - Approval Business Role Sonlandirma
- [x] Tum backend okuma/yazma noktalarinda required_business_role birincil olsun
- [x] Frontend approval ekranlarinda required_role fallbackleri sadece gecis emniyeti icin kalsin
- [x] Approval endpointleri icin required_role_mirror alaninin dokumantasyonunu ve test beklentilerini tamamla
- [x] audit script ile son kez bos veya drift eden approval kaydi olmadigini raporla

### Paket 3 - Tenant Admin Operasyon Akisi
- [~] personel olusturma akisindaki legacy admin/personnel varsayimlarini tenant user odakli API kontratina cevir
	- 2026-04-15 ilerleme: backend davetli kullanici olusturma akisinda password zorunlulugu kaldirildi; frontend admin servisinde TenantUser alias katmani eklendi ve PersonnelCreateModal, AdminPage, PersonnelTab ana akislari create/update/list/write tarafinda bu alias'lari kullanmaya basladi. Bu adim sirasinda super_admin'in platform governance sekmelerinden dusmesi regresyonu da kapatildi.
	- 2026-04-15 ilerleme: tenant-user alias gecisi PersonnelDetailPage, ProjectCreateModal, ProjectDetailPage ve QuoteCreatePage okuma katmanina genisletildi; bu ekranlar artik getTenantUsers/TenantUser kontratini kullaniyor. Ilgili frontend regresyon paketi admin-page-tenant-governance + personnel-create-modal-permissions + personnel-tab-permissions + projects-tab-permissions olarak 8/8 yesil kaldi.
	- 2026-04-15 ilerleme: proje sorumlusu atama/kaldirma akisi da tenant-user diline yaklastirildi. web/src/services/project.service.ts icine addProjectTenantUser/removeProjectTenantUser aliaslari eklendi ve ProjectDetailPage bu yeni isimleri kullanmaya basladi. Iliskili proje/admin frontend regresyon paketi 6/6 yesil kaldi.
	- 2026-04-15 ilerleme: kullaniciya gorunen admin UI metinleri tenant-user semantigine yaklastirildi. PersonnelCreateModal, PersonnelTab ve PersonnelDetailPage icindeki temel basliklar, bildirimler ve hata mesajlari "Kullanici" diliyle guncellendi; ilgili frontend regresyon paketi personnel-create-modal-permissions + personnel-tab-permissions + admin-page-tenant-governance olarak 7/7 yesil dondu.
	- 2026-04-15 ilerleme: tenant admin scope sertlestirmesinde proje dosya yuzeyi kapatildi. api/routers/admin.py icindeki proje dosyasi listeleme, yukleme ve silme endpointleri _ensure_project_scope + _ensure_project_member_or_global guard'larina baglandi; boylece tenant admin baska tenant projesinin dosyalarini goremez veya yukleyemez. tests/test_project_file_authz.py eklendi ve test_project_file_authz + test_admin_user_management_authz paketi 5/5 yesil dondu.
	- 2026-04-15 ilerleme: admin proje uye atama/kaldirma endpointleri yalnizca proje uyeligine dayali olmaktan cikarildi. /admin/users/{user_id}/projects/{project_id} POST/DELETE endpointleri require_admin_user guard'ina baglandi; artik siradan tenant member proje uyesi olsa bile admin yuzeyi uzerinden kullanici atayamaz veya cikarmaz. tests/test_project_membership_authz.py eklendi; project_membership_authz + project_file_authz + admin_user_management_authz backend paketi 7/7 yesil dondu.
	- 2026-04-15 ilerleme: kullanici firma atamalari listeleme endpointi de admin yuzeyi olarak sertlestirildi. /admin/users/{user_id}/company-assignments GET endpointi require_admin_user guard'ina baglandi; artik tenant_member admin API uzerinden baska kullanicinin firma assignment bilgisini cekemez. tests/test_company_assignment_authz.py eklendi; company_assignment_authz + project_membership_authz + project_file_authz + admin_user_management_authz backend paketi 8/8 yesil dondu.
	- 2026-04-15 ilerleme: admin permission katalogu da admin guard altina alindi. /admin/permissions GET endpointi require_admin_user guard'ina baglandi; artik tenant_member role/permission katalogunu admin API uzerinden okuyamaz. tests/test_permission_catalog_authz.py eklendi; permission_catalog_authz + company_assignment_authz + project_membership_authz + project_file_authz + admin_user_management_authz backend paketi 9/9 yesil dondu.
	- 2026-04-15 ilerleme: admin role katalogu da admin guard altina alindi. /admin/roles GET endpointi require_admin_user guard'ina baglandi; artik tenant_member rol katalogunu admin API uzerinden okuyamaz. tests/test_role_catalog_authz.py eklendi; role_catalog_authz + permission_catalog_authz + company_assignment_authz + project_membership_authz + project_file_authz + admin_user_management_authz backend paketi 10/10 yesil dondu.
	- 2026-04-15 ilerleme: admin company katalogu da admin guard altina alindi. /admin/companies GET endpointi require_admin_user guard'ina baglandi; artik tenant_member firma katalogunu admin API uzerinden okuyamaz. tests/test_company_catalog_authz.py eklendi; company_catalog_authz + role_catalog_authz + permission_catalog_authz + company_assignment_authz + project_membership_authz + project_file_authz + admin_user_management_authz backend paketi 11/11 yesil dondu.
	- 2026-04-15 ilerleme: tenant admin own-tenant scope senaryosu backend seviyesinde butunlu olarak dogrulandi. tests/test_tenant_admin_scope_scenario.py tenant admin'in yalnizca kendi tenant'indaki company/role/user kataloglarini gordugunu ve baska tenant firmasini guncelleyemedigini sabitledi. Bu senaryo company_catalog_authz + role_catalog_authz + permission_catalog_authz + company_assignment_authz + project_membership_authz + project_file_authz + admin_user_management_authz paketiyle birlikte 13/13 yesil dondu.
	- 2026-04-15 ilerleme: ayni own-tenant scope senaryosu department ve company-assignment akislarina da genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in yalnizca kendi tenant departmanlarini gordugunu ve baska tenant firmasina assignment olusturamadigini sabitledi; focused backend scope paketi 7/7 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant scope coverage department ve company-assignment mutate akislarina da genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant departmanini guncelleyip silemedigini ve baska tenant kullanicisinin company-assignment kaydini guncelleyip kaldiramadigini sabitledi; genisletilmis backend scope paketi 17/17 yesil dondu.
	- 2026-04-15 ilerleme: tenant admin icin minimum calisir own-tenant operasyon zinciri de senaryo testiyle sabitlendi. tests/test_tenant_admin_scope_scenario.py tenant admin'in admin API uzerinden kendi tenant'i icinde company, department, role, user ve company-assignment olusturabildigini; assignment ve company kayitlarini yine kendi tenant scope'unda guncelleyebildigini dogruladi. Genisletilmis backend scope paketi 18/18 yesil dondu.
	- 2026-04-15 ilerleme: company, department ve role isim benzersizligi global kalmaktan cikarildi; modellerde tenant_id + name bilesik unique kisitlarina gecildi, admin create/update duplicate kontrolleri tenant scope'a cekildi. tests/test_tenant_admin_scope_scenario.py iki farkli tenant admin'in ayni isimlerle ayri tenant kayitlari acabildigini dogruladi; focused backend paketi 13/13 yesil dondu.
	- 2026-04-15 ilerleme: role create akisindaki parent role scope sizintisi kapatildi. api/routers/admin.py artik yeni child role olustururken parent_id icin _ensure_role_scope cagiriyor; tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant parent role'u altina child role acamadigini, kendi tenant parent rolunde ise hierarchy_level=1 ile olusturabildigini dogruladi. Focused backend paketi 14/14 yesil dondu.
	- 2026-04-15 ilerleme: user update akisindaki tenant tasima ve system_role escalation aciklari kapatildi. api/routers/admin.py tenant_admin icin update_user icinde tenant_id'nin baska tenant'a cekilmesini ve system_role payload'i ile admin-managed sistem rollerine gecisi 403 ile engelliyor; tests/test_admin_user_management_authz.py her iki payload tabanli bypass denemesini de sabitledi. Focused backend paketi 16/16 yesil dondu.
	- 2026-04-15 ilerleme: frontend personel detay sayfasi backend kontratiyla hizalandi. web/src/pages/PersonnelDetailPage.tsx tenant admin icin own-tenant tenant_member kayitlarinda temel bilgi ve firma atamasi duzenlemeyi aciyor; platform staff ve admin-managed hedefler read-only kaliyor. web/src/test/personnel-detail-page-permissions.test.tsx eklendi; personnel-detail-page-permissions + personnel-create-modal-permissions + personnel-tab-permissions + admin-page-tenant-governance Vitest paketi 10/10 yesil dondu.
	- 2026-04-15 ilerleme: frontend admin tab coverage tenant_admin editable akislarini da acikca kapsayacak sekilde genisletildi. web/src/test/admin-readonly-tabs.test.tsx artik CompaniesTab, DepartmentsTab ve RolesTab icin tenant_admin modunda yeni kayit, duzenleme ve silme aksiyonlarinin gorundugunu dogruluyor; admin/personnel Vitest paketi 16/16 yesil dondu.
	- 2026-04-15 ilerleme: company-assignment create/update akislarinda tenant tutarliligi zorunlu hale getirildi. api/routers/admin.py firma atamasinda kullanici, firma, rol ve departman referanslarinin ayni tenant kapsaminda olmasini artik 400 ile dayatiyor; tests/test_tenant_admin_scope_scenario.py super_admin payload'i ile karisik-tenant assignment create/update denemelerini de kapsiyor. Focused backend paketi 19/19 yesil dondu.
	- 2026-04-15 ilerleme: frontend company ve department modal workflow coverage eklendi. web/src/test/admin-modal-workflows.test.tsx CompanyCreateModal ve DepartmentCreateModal icin basarili submit ve backend hata mesaji yuzeylerini dogrudan dogruluyor; admin/personnel/modal Vitest paketi 20/20 yesil dondu.
	- 2026-04-15 ilerleme: frontend role create workflow coverage da eklendi. web/src/test/admin-modal-workflows.test.tsx RolesTab icin tenant_admin create submit akisini ve backend hata mesajinin alert olarak yansitilmasini dogrudan dogruluyor; genisletilmis admin/personnel/modal Vitest paketi 22/22 yesil dondu.
	- 2026-04-15 ilerleme: PersonnelTab detay modalinda readOnly yuzeyden sifre sifirlama aksiyonu siziyordu. web/src/pages/admin/PersonnelTab.tsx readOnly modda onResetPassword callback'ini artik gecmiyor; web/src/test/personnel-tab-permissions.test.tsx editable modda reset-password akisinin acildigini, readOnly modda ise gizli kaldigini dogrudan dogruluyor. Hedefli Vitest paketi 4/4 yesil dondu.
	- 2026-04-15 ilerleme: kullanici-hassas admin aksiyonlari icin dogrudan backend authz kapsamasi eklendi. tests/test_admin_user_management_authz.py tenant admin'in users.reset_password izniyle kendi tenant'indaki kullanicinin sifresini sifirlayabildigini, baska tenant kullanicisinda ise reddedildigini; contact-email endpointinin de own-tenant kapsami disina cikmadigini sabitledi. Bu turda reset-password endpointinin kullandigi Role.company_roles ORM iliskisi de api/models/role.py icinde tamamlandi. Hedefli backend paketi 9/9 yesil dondu.
	- 2026-04-15 ilerleme: admin proje create/update akislarinda responsible_user_ids icin sessiz tenant filtreleme kaldirildi. api/routers/admin.py proje sorumlularinin ayni tenant kapsaminda aktif kullanicilar olmasini artik 400 ile dayatiyor; tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant kullanicisini proje sorumlusu olarak create/update payload'i ile gonderemeyecegini sabitledi. Focused backend scope paketi 18/18 yesil dondu.
	- 2026-04-15 ilerleme: proje kodu benzersizligi de tenant scope'a cekildi. api/models/project.py ve api/routers/admin.py artik duplicate proje kodunu tenant bazinda dogruluyor; farkli tenant'lar ayni code ile proje acabilirken ayni tenant icindeki update/create duplicate denemeleri 400 ile reddediliyor. tests/test_tenant_admin_scope_scenario.py bu iki kontrati sabitledi, focused backend scope paketi 20/20 yesil dondu.
	- 2026-04-15 ilerleme: frontend proje dosya sayfasi read-only kontratiyla hizalandi. web/src/pages/ProjectFilesPage.tsx icindeki platform staff silme aksiyonu hem kartlardan hem gorsel modalindan kaldirildi; bozuk JSX parcasi temizlenerek sayfa derlenir hale getirildi. web/src/test/project-files-page-permissions.test.tsx eklendi ve hedefli Vitest paketi 1/1 yesil dondu.
	- 2026-04-15 ilerleme: frontend proje detay sayfasinda franchise teklif kartlarindaki Revize write aksiyonu platform staff icin kapatildi. web/src/pages/ProjectDetailPage.tsx artik salt okunur modda supplier tekliflerinde yalnizca Göster aksiyonunu birakiyor; web/src/test/project-detail-page-permissions.test.tsx franchise senaryosu ile genisletildi ve hedefli Vitest paketi 1/1 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant CRUD kenar durumlari company delete ve assignment create yuzeyinde de genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant firmasini silemedigini ve baska tenant kullanicisini kendi tenant firmasina assignment payload'i ile baglayamadigini acikca sabitledi; focused backend scope senaryo dosyasi 22/22 yesil dondu.
	- 2026-04-15 ilerleme: payload tabanli own-tenant referans denial coverage role update ve assignment update akislarina da genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in kendi rolunu baska tenant parent role altina tasiyamadigini ve mevcut company-assignment kaydini baska tenant role ile guncelleyemedigini sabitledi; focused backend scope senaryo dosyasi 24/24 yesil dondu.
	- 2026-04-15 ilerleme: assignment CRUD kenar durumlari other-tenant department referanslariyla da tamamlandi. tests/test_tenant_admin_scope_scenario.py tenant admin'in kendi tenant kullanicisini baska tenant departmani ile assignment create/update payload'i uzerinden baglayamadigini acikca sabitledi; focused backend scope senaryo dosyasi 26/26 yesil dondu.
	- 2026-04-15 ilerleme: user create/update akislarinda other-tenant department payload denial coverage da eklendi. tests/test_admin_user_management_authz.py tenant admin'in yeni kullanici olustururken veya mevcut kullaniciyi guncellerken baska tenant departmanini department_id ile referanslayamadigini sabitledi; hedefli backend user-management authz paketi 13/13 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant ekran/endpoint kontrati company-assignment listeleme yuzeyinde de genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant kullanicisinin company-assignment listesini admin API uzerinden goremedigini acikca sabitledi; focused backend scope senaryo dosyasi 27/27 yesil dondu.
	- 2026-04-15 ilerleme: broad own-tenant mutate kontrati proje CRUD yuzeyinde de acikca sabitlendi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant projesini admin API uzerinden dogrudan guncelleyip silemedigini sabitledi; focused backend scope senaryo dosyasi 28/28 yesil dondu.
	- 2026-04-15 ilerleme: broad own-tenant ekran kontrati proje katalog gorunurlugu ile de butunlestirildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in admin API proje listesinden yalnizca kendi tenant projesini gordugunu, diger tenant proje kodlarinin filtrelendiginin acikca sabitledi; focused backend scope senaryo dosyasi 28/28 yesil kaldi.
	- 2026-04-15 ilerleme: own-tenant proje dosya silme kontrati da broad scope senaryosuna tasindi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant projesine ait dosyayi admin API uzerinden silemedigini acikca sabitledi; focused backend scope senaryo dosyasi 28/28 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant proje dosya listeleme ve yukleme denial coverage da broad scope senaryosuna tasindi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant projesinin dosyalarini admin API uzerinden listeleyemedigini ve ayni projeye dosya yukleyemedigini acikca sabitledi; focused backend scope senaryo dosyasi 29/29 yesil dondu.
	- 2026-04-15 ilerleme: user-management yan yuzeylerindeki own-tenant denial coverage da broad scope senaryosuna tasindi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant kullanicisi icin reset-password ve contact-email admin endpointlerini kullanamadigini acikca sabitledi; focused backend scope senaryo dosyasi 30/30 yesil dondu.
	- 2026-04-15 ilerleme: user CRUD escalation guard'lari da broad scope senaryosuna tasindi. tests/test_tenant_admin_scope_scenario.py tenant admin'in personnel flow uzerinden tenant_admin/tenant_owner seviyesinde kullanici olusturamadigini, tenant_owner hesabi guncelleyemedigini, member kullaniciyi yonetici system_role'e tasiyamadigini ve baska tenant'a move edemedigini acikca sabitledi; focused backend scope senaryo dosyasi 32/32 yesil dondu.
	- 2026-04-15 ilerleme: tenant admin'in tenant governance yuzeyine erisemedigi kontrat da dogrudan sabitlendi. tests/test_tenant_governance_authz.py tenant admin'in /api/v1/admin/tenants listeleme, tenant olusturma ve tenant guncelleme endpointlerine erisemediğini acikca dogruladi; hedefli tenant governance authz paketi 9/9 yesil dondu.
	- 2026-04-15 ilerleme: departman katalogu admin API yuzeyinde kalan son acik listelerden biriydi. api/routers/admin.py icindeki GET /admin/departments endpointi require_admin_user guard'ina baglandi; boylece tenant_member artik departman katalogunu admin API uzerinden okuyamiyor. tests/test_department_catalog_authz.py eklendi ve department/company/role katalog authz paketi 3/3 yesil dondu.
	- 2026-04-15 ilerleme: org katalog endpointlerinin yalnizca admin paneli tarafindan degil quote/project operasyon akislarinda da kullanildigi dogrulandi; bu nedenle dar admin guard yerine amaca uygun workspace yetki modeli getirildi. api/core/authz.py icine can_access_quote_workspace helper'i eklendi, api/routers/admin.py icindeki GET /admin/users ve GET /admin/departments endpointleri require_org_catalog_user + own-tenant filtreleri ile guncellendi; generic tenant_member reddedilirken procurement rolleri gerekli kataloglari okuyabiliyor. tests/test_org_catalog_workspace_authz.py eklendi ve yeni org-catalog + department authz paketi 3/3 yesil dondu.
	- 2026-04-15 ilerleme: platform_support/operator icin read-only admin ekranlariyla backend katalog kontrati hizalandi. api/core/authz.py icine can_read_admin_catalog helper'i eklendi; api/routers/admin.py icindeki GET /admin/companies, /admin/roles, /admin/permissions ile org katalog filtreleri bu helper'a baglandi. Boylece platform staff read-only admin kataloglarini okuyabilirken generic tenant_member hala engelli, procurement tenant_member ise own-tenant users/departments ile sinirli kaliyor. tests/test_admin_catalog_readonly_authz.py eklendi; readonly admin katalog + org katalog authz paketi 6/6 yesil dondu.
	- 2026-04-15 ilerleme: proje liste yuzeyi de ayni workspace yetki modeline hizalandi. api/routers/admin.py icindeki GET /admin/projects endpointi require_project_workspace_user guard'ina baglandi; api/core/authz.py icindeki can_view_all_projects helper'i platform staff read-only portfoy gorunurlugunu da kapsayacak sekilde genisletildi. Boylece platform_support/operator tum portfoyu gorebilirken procurement tenant_member yalnizca atandigi projeleri, generic tenant_member ise hicbir proje katalogunu goremez. tests/test_project_catalog_workspace_authz.py eklendi; project catalog authz + auth helper paketi 14/14 yesil dondu.
	- 2026-04-15 ilerleme: proje dosya yazma akislarinda platform staff read-only kontrati backend ve frontend tarafinda sabitlendi. api/routers/admin.py icindeki proje dosyasi yukleme endpointi artik can_create_project tabanli yazma guard'i uyguluyor; platform staff dosya listesini okuyabilse de yukleme yapamiyor, silme ise mevcut require_admin_user giris guard'inda reddediliyor. web/src/pages/ProjectDetailPage.tsx ve web/src/pages/ProjectFilesPage.tsx platform_support/operator icin write aksiyonlarini gizleyip salt-okunur bilgilendirme gosteriyor. tests/test_project_file_authz.py ve web/src/test/project-detail-page-permissions.test.tsx ile davranis sabitlendi; hedefli backend paketi 3/3 ve frontend Vitest paketi 1/1 yesil dondu.
	- 2026-04-15 ilerleme: proje yazma endpointleri de rol kontratiyla sabitlendi. tests/test_project_catalog_workspace_authz.py platform_support icin create/update/delete yasagini ve satinalma_uzmani icin own-scope create/update/delete akisini dogruluyor. Bu turda api/routers/admin.py icindeki create_project endpointinin HTTPException'lari genis Exception blogunda 500'e sarmasi da duzeltildi; artik 403 gibi authz hatalari oldugu gibi donuyor. Hedefli project workspace authz paketi 5/5 yesil dondu.
	- 2026-04-15 ilerleme: ProjectDetailPage icindeki quote yazma aksiyonlari da platform staff read-only kontratiyla hizalandi. web/src/components/QuoteTab.tsx readOnly prop'u ile yeni teklif, duzenle, gonder ve sil aksiyonlarini kapatabiliyor; web/src/pages/ProjectDetailPage.tsx bu durumu platform_support/operator icin aktariyor. web/src/test/project-detail-page-permissions.test.tsx quote yazma aksiyonlarinin da gizli kaldigini dogrulayacak sekilde genisletildi ve hedefli Vitest paketi 1/1 yesil dondu.
	- 2026-04-15 ilerleme: quote backend yazma yuzeyi de platform staff read-only kontratiyla hizalandi. api/routers/quotes.py ve api/routers/quote_router.py icinde platform_support/operator kullanicilari icin create/update/items/delete/restore/submit/approve/reject/send-to-suppliers gibi quote write akislarina salt-okunur guard eklendi; quote approval admin kapisi da can_access_admin_surface ile tenant-admin odakli hale getirildi. tests/test_quote_readonly_platform_authz.py yeni regresyon paketiyle platform staff write denial ve satinalma_uzmani own-scope create+submit akislarini dogruladi; ek olarak mevcut tests/test_quote_approval_permissions.py paketi 7/7 yesil kaldi.
	- 2026-04-15 ilerleme: quote frontend yuzeyleri de ayni read-only kontratla hizalandi. web/src/auth/permissions.ts icindeki canManageQuoteWorkspace helper'i platform_support/operator icin write semantiginden cikarildi; web/src/components/QuoteList.tsx, web/src/pages/QuoteCreatePage.tsx ve web/src/pages/QuoteDetailPage.tsx platform staff icin yeni teklif, duzenleme, silme, onaya gonderme ve supplier comparison write aksiyonlarini gizleyip bilgilendirme mesaji gosteriyor. web/src/test/quote-page-permissions.test.tsx ile yeni frontend regresyon paketi, web/src/test/permissions.test.ts ile helper semantigi birlikte 12/12 yesil dondu.
	- 2026-04-15 ilerleme: quote comparison report sayfasi da ayni frontend kontrat altina alindi. web/src/pages/QuoteComparisonReportPage.tsx platform_support/operator icin salt-okunur bilgilendirme mesaji gosteriyor; is onayi ve tedarikci secimi aksiyonlari helper semantigiyle kapali kalirken Excel indirme ve detay inceleme korunuyor. web/src/test/quote-page-permissions.test.tsx comparison report coverage'i ile genisletildi; quote permission frontend paketi 14/14 yesil dondu.
	- 2026-04-15 ilerleme: tenant admin own-tenant mutate coverage role yuzeyine de genisletildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant rolunu guncelleyip silemedigini acikca sabitledi; focused backend scope senaryo dosyasi 13/13 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant company dosya yuzeyi de admin CRUD zincirine dahil edildi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant firmasina logo yukleyemedigini acikca sabitledi; genisletilmis backend scope senaryo dosyasi 14/14 yesil dondu.
	- 2026-04-15 ilerleme: own-tenant personel arsivleme yuzeyi de dogrudan authz kapsamasi altina alindi. tests/test_admin_user_management_authz.py tenant admin'in baska tenant kullanicisini silemedigini ve kendi tenant'indaki pasif kullaniciyi listeden kaldirirken arsiv alanlarinin dogru set edildigini sabitledi; hedefli backend user-management authz paketi 11/11 yesil dondu.
	- 2026-04-15 ilerleme: project membership admin endpointleri icin de capraz-tenant denial coverage eklendi. tests/test_tenant_admin_scope_scenario.py tenant admin'in baska tenant kullaniciyi kendi projesine atayamadigini ve kendi tenant kullanicisini baska tenant projesinden cikararak mutate edemedigini sabitledi; genisletilmis backend scope senaryo dosyasi 16/16 yesil dondu.
- [x] tenant admin'in yalnizca kendi tenant organizasyonunu yonettigi ekran/endpoint kontratini tamamla
- [x] firma, departman, rol ve assignment CRUD akislarinda tenant zorunlulugunu kalan kenar durumlarla kapat
- [x] bu paket sonunda tenant admin icin minimum calisir operasyon senaryosunu test ile sabitle

	- 2026-04-15 kapanis notu: Paket 3 kapsamindaki tenant-admin own-tenant kontrati; broad scope senaryosu, user-management authz paketi, tenant governance authz paketi ve ilgili katalog/project authz regresyonlariyla ekran/endpoint seviyesinde yeterli kapsama esigine geldi. Company, department, role, assignment, user, project, project-file ve user-management yan yuzeylerinde hem own-tenant mutasyon akislarinin hem de cross-tenant denial/tenant-tutarliligi kontratlarinin testle sabitlenmesi nedeniyle bu iki backlog maddesi tamamlandi olarak isaretlendi.

### Paket 4 - Quote/RFQ Domain Ayrisma
- [~] quote modelinin tenant-rfq hedef modeline nasil evrilecegini kod seviyesinde parcali migration backlog'una cevir
- [x] project, supplier, approval ve quote baglarinda tenant zorunlulugunu kalan fallback sorgulardan temizle
- [x] private supplier ve platform supplier ayrimini domain servisleri ve UI filtrelerinde gorunur hale getir
- [x] bu paket sonunda quote import, dispatch, approval ve supplier karsilastirma akislarini tenant bazli smoke test ile tekrar dogrula

	- 2026-04-15 analiz: quote modelinin tenant-rfq hedefi icin parcali migration backlog'u cikarildi. Mevcut api/models/quote.py yapisi hem RFQ basligini hem legacy quote kolonlarini ayni tabloda tasiyor; supplier teklifleri api/models/supplier.py icindeki supplier_quotes tablosuna, approval zinciri ise api/models/quote_approval.py tablosuna quote_id uzerinden bagli. Tenant bazli RFQ ayrismasi icin asagidaki parcali backlog izlenecek:
	1. RFQ aggregate sinirini netlestir: quotes tablosunu kod seviyesinde RFQ olarak adlandiran servis/schama adapter katmani ekle; legacy Quote ismi ORM seviyesinde gecici kalsin ama router/service seviyesinde rfq terimi birincil hale gelsin.
	2. Kimlik ve tenant zorunlulugu: quotes.tenant_id, supplier_quotes.quote_id, quote_approvals.quote_id, quote_status_logs.quote_id ve quote_comparisons.quote_id zincirinde null/fallback baglari raporla; null tenant kayitlari icin audit script ve backfill migration hazirla.
	3. Legacy kolon ayirma plani: quotes.user_id ile created_by_id, amount ile total_amount, created_by/updated_by/deleted_by integer alanlari ve company_* snapshot kolonlarini hedef modelde korunacak snapshot vs kaldirilacak legacy alan olarak siniflandir; once okuma adapter'i sonra write-path sadeleştirmesi yap.
	4. Supplier teklif baglari: supplier_quotes ve supplier_quote_items icin tenant kolon ihtiyacini belirle; quote.tenant_id ve supplier.tenant_id/project_suppliers/project_company baglariyla tutarlilik denetimi yapan domain guard ekle.
	5. Approval baglari: quote_approvals.required_role fallback'ini tamamen required_business_role odagina tasiyacak ikinci faz migration taslagi cikar; approval kayitlarinda tenant_id backfill ve quote/supplier_quote tenant consistency denetimi ekle.
	6. Schema ve endpoint gecisi: api/schemas/quote.py icinde QuoteCreate/Update/Out adlarinin yanina RFQ alias katmani planla; router cevaplarinda geriye uyumlu alanlari korurken yeni istemci icin rfq merkezli payload sozlesmesi tasarla.
	7. Rapor ve karsilastirma baglari: api/models/report.py altindaki quote_id/supplier_quote_id referanslari icin tenant-aware join backlog'u ayir; comparison/report olusturma akislarinda quote tenant'i tek kaynak olsun.
	8. Migration sirasi: once audit/backfill scriptleri, sonra nullability-constraint migration'lari, sonra router/service refactor'u, en sonda schema/isimlendirme temizligi olacak sekilde parcali release sirasi izlenmeli.

	- 2026-04-15 analiz: Paket 4 madde 2 icin ilk fallback sorgu envanteri cikarildi. Oncelikli refactor hedefleri:
	1. api/routers/quotes.py icindeki _get_quote_or_404 sadece id ile kayit aliyor; tenant kontrolu ayri helper'a birakiliyor. quote, supplier_quote, quote_status_log ve quote_approval lookup'larinda id + tenant bagini tek helper katmaninda birlestiren scoped-get desenine gecilmeli.
	2. api/routers/quotes.py ve api/routers/quote_router.py icinde quote create/import akislarinda tenant_id=project.tenant_id or current_user.tenant_id fallback'i var. Hedef modelde project.tenant_id zorunlu kaynak olmali; fallback path audit edilip kaldirilmali.
	3. api/routers/quotes.py icinde approval/status-history/full-audit-trail ve supplier grouped listeleri quote_id uzerinden cekiliyor; parent quote scope once kontrol edilse de alt sorgular tenant kolonu uzerinden dogrudan sinirlanmiyor. quote_approvals, quote_status_logs ve supplier_quotes sorgulari quote.tenant_id ile zincirli helper'a alinmali.
	4. api/routers/quote_router.py icindeki project/{project_id}, items, send-to-suppliers, select-supplier ve history akislarinda quote/supplier_quote kayitlari cogunlukla id veya quote_id ile aliniyor. project/quote/supplier ucgeninde tenant-consistency assert'leri ortak helper'a tasinmali.
	5. api/services/quote_approval_service.py yalnizca quote_id + supplier_quote_id null filtreleriyle calisiyor; tenant-aware approval repository katmani eklenmeden approval zinciri dogrudan quote_id uzerinden kalmaya devam ediyor. Bu servis, quote nesnesi veya tenant-scoped aggregate root uzerinden cagrilacak sekilde yeniden sekillendirilmeli.
	6. api/services/quote_service.py icindeki revision ve grouped supplier quote akislarinda SupplierQuote lookup'lari supplier_quote_id/quote_id ile yapiliyor; tenant veya quote-parent tutarliligi servis seviyesinde garanti edilmiyor. SupplierQuote scoped lookup ve revision olusturma sirasinda quote/supplier tenant tutarlilik guard'i eklenmeli.
	7. Sonraki uygulama sirasi: once audit scripti ile null tenant ve cross-tenant bag ihtimallerini raporla, sonra scoped lookup helper/refactor katmanini quotes.py + quote_router.py icine ekle, en sonda service katmanini bu helper'lara bagla.

	- 2026-04-15 ilerleme: Paket 4 madde 2 icin ilk router refactor'u uygulandi. api/routers/quotes.py icinde quote lookup'lari tenant-scoped helper'a toplandi; api/routers/quote_router.py icinde scoped project/quote helper'lari eklendi ve project quote listeleme, item CRUD, import, send-to-suppliers, select-supplier ve history akislarinda dogrudan kullanildi. Import akisindaki tenant_id=project.tenant_id or current_user.tenant_id fallback'i ilk adim olarak kaldirildi ve project tenant'i tek kaynak haline getirildi. tests/test_quote_router_tenant_scope_authz.py yeni regresyon paketiyle cross-tenant project quote listeleme ve quote item erisimi denial kontratini sabitledi; hedefli quote router + quote regression paketi 10/10 yesil dondu.

	- 2026-04-15 ilerleme: Paket 4 madde 2 icin service-layer parent scope refactor'u da uygulandi. api/services/quote_service.py supplier quote revision ve grouped-list akislarini parent quote nesnesi uzerinden scoped helper ile calisacak sekilde guncellendi; api/services/quote_approval_service.py quote nesnesi destekli tenant-aware approval scope filtreleri ekledi ve yeni approval kayitlari quote.tenant_id ile olusur hale geldi. Router cagrilari bu yeni imzalara tasindi; ek olarak tests/test_quote_router_tenant_scope_authz.py submit-revision akisinda baska RFQ'ya ait supplier_quote_id gonderildiginde istegin reddedildigini sabitledi. Hedefli quote router + approval + quote regression paketi 18/18 yesil dondu.

	- 2026-04-15 ilerleme: Paket 4 madde 2 icin audit/backfill zemini de hazirlandi. api/scripts/audit_quote_tenant_consistency.py eklendi; script quotes, supplier_quotes, quote_approvals, quote_status_logs ve report zincirindeki parent-child tenant tutarliligini, null tenant baglarini ve supplier_quote-parent mismatch durumlarini tek raporda denetliyor. JSON ve CSV rapor ciktilari destekleniyor; boylece sonraki backfill migration'i veriye dayali olarak planlanabilecek.

	- 2026-04-15 ilerleme: audit_quote_tenant_consistency.py mevcut veri uzerinde calistirildi; quotes=23, supplier_quotes=20, quote_approvals=6, quote_status_logs=34 ve report_chain=0 satir taramasinda issue_counts bos dondu. Bu sonuc Paket 4 madde 2 icin acil bir backfill gereksinimi olmadigini dogruladi ve sonraki adim olarak supplier ayrimini API filtre seviyesinde gorunur hale getirme isine gecildi.

	- 2026-04-15 ilerleme: Paket 4 madde 3 icin ilk gecis katmani eklendi. api/models/supplier.py ve api/schemas/supplier.py uzerinden SupplierOut artik gecici source_type alanini private/platform_network olarak uretir hale geldi; api/routers/supplier_router.py list_suppliers endpoint'i source_type=private|platform_network|all filtresi ile tenant private supplier listesi ve platform agi supplier listesini ayri gosterir hale getirildi. Bu ayrim simdilik tenant_id tabanli bir gecis kurali kullaniyor; hedef source_type kolonu migration'i geldiginde ayni API sozu korunarak kalici modele tasinacak.

	- 2026-04-15 ilerleme: supplier ayrimi quote dispatch/secim akislarina da baglandi. api/routers/supplier_router.py icine quote kullanimina ozel gorunur-supplier helper'i eklendi; api/routers/quote_router.py send-to-suppliers ve select-supplier akislari artik tenant private supplier'lari ve platform_network supplier'lari kabul ederken baska tenant'in private supplier kaydini reddediyor. Boylece supplier listesinde gorunen kaynaklar ile quote islem katmaninin kabul ettigi supplier scope'u uyumlu hale geldi.

	- 2026-04-15 ilerleme: supplier source_type gorunurlugu quote gonderim UI'ina tasindi. api/routers/supplier_router.py icindeki project supplier payload'i source_type doner hale getirildi; web/src/components/SendQuoteModal.tsx, QuoteList.tsx ve QuoteTab.tsx tarafinda private/platform_network ayrimi kaynak sekmeleri ve satir rozetleri ile gorunur kilindi. Boylece Paket 4 madde 3 icin domain servislerinde baslayan ayrim quote dispatch ekraninda da kullaniciya acik hale geldi.

	- 2026-04-15 ilerleme: Paket 4'te acik kalan tenant bazli smoke test halkasi da sabitlendi. tests/test_quote_router_tenant_scope_authz.py icine ayni tenant icinde import/excel -> submit -> iki seviyeli approval -> send-to-suppliers -> supplier response -> reports/comparison zincirini dogrulayan uc tan uca regresyon eklendi; farkli tenant kullanicisinin comparison raporuna 403 aldigi da ayni testte dogrulandi. Smoke test sirasinda ortaya cikan api/routers/report_router.py icindeki legacy supplier.name referanslari company_name alanina tasinarak comparison route gercek veriyle calisir hale getirildi. Hedefli quote router + report authz paketi 5/5 yesil dondu.

	- 2026-04-15 ilerleme: report yuzeyindeki tenant-aware erişim deseni de merkezilestirildi. api/routers/report_router.py icine scoped quote helper'i eklendi; price-analysis, comparison, comparison/export-xlsx, comparison/detailed, rate-supplier ve dashboard endpoint'leri tekrar eden id+authz kontrolleri yerine bu helper'i kullanir hale geldi. tests/test_report_router_authz.py comparison yaninda detailed ve export-xlsx yuzeylerinde de cross-tenant 403 kontratini dogrulayacak sekilde genisletildi.

	- 2026-04-15 ilerleme: project supplier yonetim yuzeylerinde de supplier visibility guard'i kapatildi. api/routers/supplier_router.py icindeki add_suppliers_to_project ve resend_supplier_invitation artik _get_visible_supplier_or_404 helper'i uzerinden tenant private supplier ile platform_network supplier ayrimini koruyor; baska tenant'in private supplier kaydi id ile projeye eklenemiyor ve resend-invite de ayni scope kurali ile proje uyelerine acildi. tests/test_supplier_auth_helpers.py hedefli API regresyonlariyla project member'in gorunur platform supplier icin resend yapabildigi ve cross-tenant private supplier ekleyemedigi kontratini 6/6 yesil sabitledi.

	- 2026-04-15 ilerleme: Paket 4 madde 1 icin ilk RFQ adapter katmani schema seviyesinde baslatildi. api/schemas/quote.py icine RfqCreate, RfqUpdate, RfqOut ve RfqListOut alias tipleri eklendi; QuoteOut, QuoteItemOut ve QuoteApprovalOut payload'lari rfq_id hesaplanan alanini da doner hale geldi. Bu adim mevcut quote sozu bozulmadan istemci ve router katmaninin RFQ terimine parcali gecisini mumkun kiliyor. tests/test_rfq_schema_aliases.py ile alias tiplerin mevcut contract ile uyumlu kaldigi 3/3 yesil dogrulandi.

	- 2026-04-15 ilerleme: RFQ adapter katmani artik API cevap kontratinda da dogrulandi. tests/test_quotes.py create/get/list ve project quote list yuzeylerinde rfq_id alaninin QuoteOut response modeli uzerinden disari aktigini sabitledi; tests/test_quotes.py + tests/test_rfq_schema_aliases.py hedefli paketi 12/12 yesil dondu. Boylece Paket 4 madde 1 icin schema alias'i yalnizca tip tanimi olarak degil, aktif endpoint sozu olarak da calisir hale geldi.

	- 2026-04-15 ilerleme: RFQ terminolojisi router response_model katmanina da tasindi. api/routers/quotes.py icindeki create/get/update/restore/submit/approve/reject akislarinin response_model tanimlari ve api/routers/quote_router.py icindeki project quote listeleme endpoint'i QuoteOut yerine RfqOut alias'i kullanir hale getirildi. Runtime payload ayni kalirken OpenAPI ve kod sozlugu RFQ merkezli adapter katmanina bir adim daha yaklasti; hedefli quote + rfq schema paketi 12/12 yesil kaldi.

	- 2026-04-15 ilerleme: RFQ adapter katmani request payload yuzeyine de tasindi. api/routers/quotes.py icindeki create ve update endpoint imzalari QuoteCreate/QuoteUpdate yerine RfqCreate/RfqUpdate alias tiplerini kullanir hale getirildi; boylece Paket 4 madde 1 icin RFQ terminolojisi hem request hem response katmaninda gorunur oldu. Mevcut quote API davranisi korunarak tests/test_quotes.py + tests/test_rfq_schema_aliases.py paketi 12/12 yesil kaldi.

	- 2026-04-15 ilerleme: RFQ adapter katmani frontend servis ve liste yuzeylerine de baglandi. web/src/types/quote.ts icine rfq_id uyumlu normalize yardimcilari eklendi; web/src/services/quote.service.ts ve web/src/services/quotes.service.ts gelen payload'larda id/rfq_id alanlarini tek kimlikte toplar hale getirildi. Buna ek olarak web/src/components/QuoteList.tsx ve QuoteTab.tsx liste satirlarinda RFQ kimligi gorunur kilindi ve QuoteTab'in dogrudan fetch ettigi project quote listesi de ayni normalize yardimcisini kullanmaya basladi. web/src/test/quote-page-permissions.test.tsx RFQ #id gorunurlugunu dogrulayacak sekilde guncellendi.

	- 2026-04-15 ilerleme: RFQ gorunurlugu quote detay ve comparison raporu yuzeylerine de tasindi. web/src/pages/QuoteDetailPage.tsx ust baslikta RFQ #id bilgisini legacy Teklif ID ile birlikte gostermeye basladi; web/src/pages/QuoteComparisonReportPage.tsx ise report quote payload'inda opsiyonel rfq_id alip rapor basliginda RFQ referansini gorunur kildi. web/src/test/quote-page-permissions.test.tsx bu iki yuzey icin yeni RFQ referans assert'leriyle 7/7 yesil kaldi.

	- 2026-04-15 ilerleme: RFQ terminolojisi create form yuzeyine de tasindi. web/src/pages/QuoteCreatePage.tsx basligi Yeni RFQ / Teklif Talebi olarak ikili terminoloji kullanmaya basladi ve aktif adapter gecisini aciklayan yardimci metin eklendi; mevcut route ve create davranisi korunurken kullaniciya RFQ gecisinin kademeli oldugu gosterildi. web/src/test/quote-page-permissions.test.tsx create sayfasi icin bu yeni metinleri assert ederek hedefli frontend paketin kapsamını genisletti.

	- 2026-04-15 ilerleme: RFQ sozlugu export yuzeyine de tasindi. web/src/pages/QuoteDetailPage.tsx ve web/src/pages/QuoteComparisonReportPage.tsx comparison Excel indirme aksiyonlarinda dosya adini rfq_<id>_karsilastirma_raporu.xlsx formatina gecirdi; boylece kullanicinin disari aldigi artefakt adlari da backend'deki RFQ adapter gecisiyle uyumlu hale geldi. web/src/test/quote-page-permissions.test.tsx comparison export akisi icin RFQ bazli dosya adi kontratini dogrulayacak sekilde genisletildi.

	- 2026-04-15 ilerleme: Frontend servis katmaninda da RFQ isimlendirme alias'i acildi. web/src/services/quote.service.ts icine Rfq, RfqListResponse, CreateRfqRequest, UpdateRfqRequest ve getRfq/getRfqs/createRfq/updateRfq gibi geriye uyumlu alias tip ve fonksiyonlari eklendi; boylece sonraki UI refactor'lari quote adlarina bagli kalmadan RFQ merkezli servis API'sine gecebilir. web/src/test/quote-service-rfq-aliases.test.ts yeni hedefli servis testleriyle RFQ alias cagrilarinin rfq_id normalize davranisini korudugunu sabitledi.

	- 2026-04-15 ilerleme: Ilk UI cagri gecisi de RFQ alias servislerine baglandi. web/src/pages/QuoteCreatePage.tsx, web/src/components/QuoteList.tsx, web/src/pages/QuoteDetailPage.tsx ve web/src/pages/QuoteComparisonReportPage.tsx artik dogrudan quote.service icindeki createRfq/getRfqs/getRfq/updateRfq/updateRfqItems/getRfqComparisonDetailedReport gibi alias fonksiyonlari kullanmaya basladi. Bu adim davranisi degistirmeden frontend'in bir sonraki RFQ rename/refactor turunu hizlandiracak ortak cagrı tabanini olusturdu.

	- 2026-04-15 ilerleme: Ikinci frontend servis hatti da RFQ alias semantigine yaklasti. web/src/services/quotes.service.ts icine getRfqs/createRfq/updateRfq/deleteRfq/approveRfq/rejectRfq alias'lari eklendi; web/src/pages/ProjectDetailPage.tsx proje bazli quote listesini artik getRfqs uzerinden yukler hale geldi. Boylece frontend'teki her iki quote servis modulu de RFQ merkezli cagri adlarini sunar hale geldi ve sonraki ekran refactor'lari icin ek adaptor ihtiyaci azaldi.

	- 2026-04-15 ilerleme: quote modelindeki legacy kolon ayrimi kod seviyesinde daha gorunur hale getirildi. api/models/quote.py icine LEGACY_MIRROR_COLUMNS ve SNAPSHOT_COLUMNS sabitleri ile rfq_id, canonical_created_by_id, canonical_total_amount ve company_snapshot helper'lari eklendi; boylece user_id/amount/company_* alanlarinin migration niyeti model ustunde acik sekilde belgelenmis oldu. tests/test_quote_model_transition_contract.py bu helper ve sabitleri hedefli olarak dogruladi.

	- 2026-04-15 ilerleme: legacy quote kolon temizliginin operasyon sirasi da somutlastirildi. migrations/2026_04_15_quote_rfq_legacy_cleanup_plan.sql preflight drift sorgulari, mirror alignment update'leri ve sonraki drop adaylarini ayri fazlar halinde tanimlar hale geldi; README icine de bu planin hangi sirayla calistirilacagina dair Quote/RFQ Legacy Cleanup Final Faz notu eklendi. Boylece Paket 4 madde 1 altindaki son acik konu da uygulama/operasyon seviyesinde net bir execution planina baglandi.

	- 2026-04-15 ilerleme: execution plan artik arac seviyesinde de calisiyor. api/scripts/audit_quote_rfq_legacy_cleanup.py eklendi; quotes tablosundaki user_id <-> created_by_id ve amount <-> total_amount mirror drift'ini, company_* snapshot eksiklerini ve supplier_quote tenant/revision uyumsuzluklarini raporlayip JSON/CSV cikti uretebiliyor. Script guvenli dry-run/apply modu ile yalnizca legacy mirror alanlarini canonical alanlardan hizaliyor; tests/test_quote_legacy_cleanup_audit.py hedefli paketi 2/2 yesil dogruladi.

	- 2026-04-15 ilerleme: Paket 4 madde 1 icin app-layer write-path sadeleştirmesi de tamamlandi. api/routers/quotes.py create/update/items akislari artik dogrudan user_id ve amount mirror kolonlarina yazmiyor; canonical kaynak created_by_id ve total_amount ile sinirlandi. Buna paralel olarak migrations/2026_04_15_finalize_quote_rfq_legacy_drop.sql dosyasi eklendi; bu final faz migration'i audit temiz olduktan sonra quotes.user_id ve quotes.amount kolonlarini kaldiracak sekilde hazirlandi. tests/test_quotes.py + test_quote_model_transition_contract.py + test_quote_legacy_cleanup_audit.py hedefli backend paketi 13/13 yesil dogrulandi.

	- 2026-04-15 ilerleme: quote legacy cleanup auditi mevcut veri uzerinde de temiz dondu. api/scripts/audit_quote_rfq_legacy_cleanup.py audit-quote-rfq-legacy-cleanup.json ve audit-quote-rfq-legacy-cleanup.csv ciktilariyla calistirildi; quotes=23 ve supplier_quotes=20 taramasinda issue_counts bos kaldi, guvenli fix adayi 0 bulundu. Boylece Paket 4 madde 1 icin teknik kapanis kriteri artik yalnizca final drop migration'in uygun release penceresinde uygulanmasina indi.

### Paket 5 - SaaS Ticari Katman
- [x] paketler ve moduller ekranini super admin yuzeyinde ac
- [x] tenant kullanim limitlerini ayar ve olusturma akislarinda enforcement seviyesine getir
- [x] abonelik/faturalama altyapisi icin veri modeli ve webhook entegrasyon backlog'unu ayir
- [x] platform operasyon rolleri icin super admin disi izleme/destek ekranlarini netlestir

	- 2026-04-15 ilerleme: Paket 5 icin ilk calisan dikey acildi. api/routers/admin.py icine super_admin ile sinirli /admin/subscription-catalog endpoint'i eklendi; starter/growth/enterprise planlari ve modul-limit katalogu statik olarak doner hale geldi. Frontendte web/src/services/admin.service.ts ve web/src/pages/AdminPage.tsx super admin icin yeni "Paket ve Kullanim" sekmesini acti; boylece paket/modul matrisi ve varsayilan plan omurgasi artik platform yuzeyinde gorunur. Hedefli backend authz ve frontend AdminPage testleri ile bu ilk iskelet dogrulanacak.

	- 2026-04-15 ilerleme: Paket 5 madde 2 icin ilk enforcement baglandi. Subscription katalog mantigi api/services/subscription_service.py icine tasindi; boylece tenant create/update akislari yalnizca tanimli starter/growth/enterprise plan kodlarini kabul eder hale geldi. Ayni servis, admin proje olusturma akisinda starter plan tenant'lar icin aktif proje sayisini 5 ile sinirlayan gercek bir runtime kontrolu de sagliyor; growth ve enterprise tenant'lar ise bu ilk limitten etkilenmiyor.

	- 2026-04-15 ilerleme: Paket 5 madde 2 ikinci enforcement noktasina da baglandi. Admin personel olusturma akisi artik tenant planina gore aktif ic kullanici limitini runtime seviyesinde denetliyor; starter plan 10 aktif kullanici ile sinirlanirken growth bu esigin ustunde de yeni kullanici ekleyebiliyor. tests/test_admin_user_management_authz.py, tests/test_tenant_governance_authz.py ve tests/test_project_catalog_workspace_authz.py hedefli regresyon paketi 35/35 yesil dogruladi.

	- 2026-04-15 ilerleme: Paket 5 madde 2 ucuncu enforcement noktasina da baglandi. api/routers/supplier_router.py ozel tedarikci olusturma akisinda tenant planina gore aktif private supplier limitini runtime seviyesinde denetliyor; growth plan 250 aktif ozel tedarikci esiginde bloklanirken enterprise bu esigin ustunde de yeni tedarikci ekleyebiliyor. tests/test_supplier_auth_helpers.py dahil hedefli subscription enforcement regresyon paketi 43/43 yesil dogruladi.

	- 2026-04-15 ilerleme: Paket 5 gorunurluk katmani da acildi. /admin/subscription-catalog endpoint'i artik yalnizca plan katalogunu degil, tenant bazli canli kullanim snapshot'ini da donduruyor; aktif proje, aktif ic kullanici ve aktif private supplier sayaçlari plan limitleriyle birlikte tek payload icinde geliyor. Frontendte web/src/pages/AdminPage.tsx "Paket ve Kullanim" sekmesine tenant bazli canli limit izleme kartlari eklendi. tests/test_tenant_governance_authz.py 13/13 ve web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil dogruladi.

	- 2026-04-15 ilerleme: Tenant portfoyu tablosu da canli kullanim ozetini kullanir hale geldi. web/src/pages/AdminPage.tsx tenant governance tablosu artik proje/kullanici/tedarikci sayaçlarini satir icinde kompakt rozetlerle gosteriyor; limit baskisina giren tenant'lar sari, asimda olanlar kirmizi onceliklendirme ile ustte siralaniyor. web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil kaldı.

	- 2026-04-15 ilerleme: Tenant portfoyu gorunumu operasyon filtresi de kazandi. Tenant governance tablosuna Tum Tenantlar / Limit Baskisi / Limit Asimi filtreleri ile risk onceligi veya ada gore siralama secimi eklendi; boylece super admin ekibi yalnizca baskidaki tenant'lara hizli sekilde odaklanabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil dogruladi.

	- 2026-04-15 ilerleme: Paket ve Kullanim sekmesi artik ust seviye KPI kartlari da sunuyor. Riskteki tenant sayisi, limit asimindaki tenant sayisi ve tum metriklerdeki en yuksek doluluk orani ozet kartlarla gosteriliyor; tenant bazli kullanim kartlarina da yuzde doluluk progress barlari eklendi. web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil kaldi.

	- 2026-04-15 ilerleme: Paket 5 madde 3 icin veri modeli omurgasi acildi. api/models/billing.py icine subscription_plans, tenant_subscriptions, billing_invoices ve billing_webhook_events modelleri eklendi; tenant iliskileri api/models/tenant.py ve model export listesi api/models/__init__.py uzerinden baglandi. migrations/2026_04_15_add_billing_subscription_foundation.sql dosyasi bu tablolarin idempotent SQL kurulumunu, temel plan seed'lerini ve mevcut tenant'lar icin ilk tenant_subscriptions bootstrap'ini hazirliyor. Boylece webhook isleme ve provider entegrasyonu artik ayri backlog adimlari olarak bu omurgaya oturabilecek.

	- 2026-04-15 ilerleme: Billing omurgasi artik ilk islenebilir API akisina da sahip. api/routers/billing_router.py icine /billing/webhooks/{provider} ingest endpoint'i ve super admin icin /billing/overview ozet endpoint'i eklendi; api/services/billing_service.py webhook olayini idempotent sekilde billing_webhook_events tablosuna yaziyor, tenant_subscriptions kaydini upsert ediyor ve tenant.subscription_plan_code alanini tek yonlu senkronize ediyor. Admin tenant create/update akislari da ayni ensure_tenant_subscription_for_plan yardimcisini kullanir hale geldi. tests/test_tenant_governance_authz.py 15/15 yesil dogruladi.

	- 2026-04-15 ilerleme: Billing overview artik super admin UI'a da baglandi. web/src/services/admin.service.ts uzerinden /billing/overview cekiliyor; web/src/pages/AdminPage.tsx Paket ve Kullanim sekmesine aktif subscription kayitlari ve son webhook olaylarini gosteren Billing Operasyonlari paneli eklendi. tests/test_tenant_governance_authz.py 17/17 ve web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil dogruladi.

	- 2026-04-15 ilerleme: Billing webhook akisina invoice senkronizasyonu da eklendi. api/services/billing_service.py payload icindeki invoice nesnesini billing_invoices tablosuna upsert ediyor; api/routers/billing_router.py /billing/overview cevabina son faturalari da dahil ediyor. Frontendte web/src/pages/AdminPage.tsx Billing Operasyonlari paneli acik fatura KPI'i, bekleyen tahsilat toplami ve son fatura kartlarini gosterir hale geldi. tests/test_tenant_governance_authz.py 17/17 ve web/src/test/admin-page-tenant-governance.test.tsx 4/4 yesil dogrulandi.

	- 2026-04-15 ilerleme: Billing Operasyonlari paneli fatura durum filtresi de kazandi. web/src/pages/AdminPage.tsx Paket ve Kullanim sekmesinde Tum Faturalar / Acik / Odendi / Diger sayaç dugmeleri eklendi; boylece super admin son fatura listesini durum bazli daraltip tahsilat akisina daha hizli odaklanabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

	- 2026-04-15 ilerleme: Billing Operasyonlari paneli webhook durum filtresi de kazandi. web/src/pages/AdminPage.tsx artik Tum Olaylar / Islendi / Hatali / Diger sayaç dugmeleriyle son webhook listesini processing_status bazli daraltabiliyor; boylece super admin event ingest akisini fatura listesinden bagimsiz sekilde hizla inceleyebiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

	- 2026-04-15 ilerleme: Billing Operasyonlari paneli abonelik durum filtresi de kazandi. web/src/pages/AdminPage.tsx artik Tum Abonelikler / Aktif / Deneme / Diger sayaç dugmeleriyle subscription portfoyunu status bazli daraltabiliyor; boylece super admin fatura ve webhook listelerine gecmeden once hangi tenant kayitlarinin trial, aktif veya sorunlu oldugunu hizlica ayirabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

	- 2026-04-15 ilerleme: Paket ve Kullanim sekmesindeki canli tenant portfoyu plan filtresi de kazandi. web/src/pages/AdminPage.tsx artik Tum Planlar ve katalogdaki planlar arasinda hizli gecis yapip kullanim kartlarini plan bazli daraltabiliyor; boylece super admin starter/growth/enterprise kiriliminda limit baskisini billing detayina inmeden once ayirabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

	- 2026-04-15 ilerleme: Paket ve Kullanim sekmesindeki canli tenant portfoyu risk filtresiyle de derinlesti. web/src/pages/AdminPage.tsx artik plan filtresine ek olarak Tum Riskler / Limit Baskisi / Limit Asimi dugmeleriyle ayni kullanim kartlarini risk seviyesine gore daraltabiliyor; boylece super admin plan kirilimi ile limit baskisini birlikte okuyabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

	- 2026-04-15 ilerleme: Paket 5 madde 4 icin ilk operasyon workspace'i acildi. web/src/pages/AdminPage.tsx platform_overview sekmesi artik platform_support ve platform_operator rolleri icin onboarding kuyrugu, owner aksiyonu, branding eksigi, pasif tenant KPI'lari ve oncelikli tenant operasyon listesi gosteriyor; boylece super admin disi platform personeli tenant governance yazma yetkisi olmadan gercek bir izleme/destek yuzeyi kullanabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 5/5 yesil dogrulandi.

	- 2026-04-15 ilerleme: Paket 5 madde 4 icin ikinci adim da acildi. web/src/pages/AdminPage.tsx icine ayri bir Platform Operasyonlari sekmesi eklendi; bu sekme onboarding takibi, owner atama kuyrugu, branding eksikleri ve duraklatilan tenantlar icin kategori bazli triage kartlari ile hizli Tenant Yonetimi gecis aksiyonlari sunuyor. web/src/test/admin-page-tenant-governance.test.tsx 6/6 yesil dogrulandi.

	- 2026-04-15 ilerleme: Platform Operasyonlari sekmesi hafif workflow katmaniyla genisletildi. web/src/pages/AdminPage.tsx queue kartlari icine operasyon sahibi, son temas ve destek notu alanlari eklendi; bu alanlar backend ticket modeli gelmeden once platform destek ekibine oturum ici triage takibi sagliyor. web/src/test/admin-page-tenant-governance.test.tsx 7/7 yesil dogrulandi.
	- 2026-04-15 ilerleme: Platform Operasyonlari workflow'u artik kalici tenant destek kaydina baglandi. api/models/tenant.py, api/schemas/tenant.py ve api/routers/admin.py tenant bazli support_owner_name, support_last_contacted_at ve support_notes alanlarini ve daraltilmis support-workflow patch endpoint'ini ekledi; platform_support ve platform_operator rolleri tenant listesini salt-okunur gorebilirken yalnizca bu destek workflow alanlarini guncelleyebiliyor. Frontendte web/src/services/admin.service.ts ve web/src/pages/AdminPage.tsx destek notu kaydet aksiyonunu bu endpoint'e bagladi. tests/test_tenant_governance_authz.py 20/20 ve web/src/test/admin-page-tenant-governance.test.tsx 8/8 yesil dogrulandi.
	- 2026-04-15 ilerleme: Platform Operasyonlari workflow'u destek durumu ile bir kademe daha netlestirildi. Tenant support workflow kontratina support_status alani eklendi; platform ekibi artik tenant kartlarini Yeni / Islemde / Owner Bekleniyor / Cozuldu durumlariyla isaretleyip ayni dar patch endpoint'i uzerinden kalici olarak saklayabiliyor. Bu adim destek triage'inin sadece not metniyle degil operasyonel durumla da izlenmesini sagladi. tests/test_tenant_governance_authz.py 20/20 ve web/src/test/admin-page-tenant-governance.test.tsx 8/8 yesil kaldi.
	- 2026-04-15 ilerleme: Platform Operasyonlari sekmesine destek durumu KPI ve filtre katmani eklendi. web/src/pages/AdminPage.tsx artik Tum Kayitlar / Yeni / Islemde / Owner Bekleniyor / Cozuldu sayaç kartlariyla queue portfoyunu ozetliyor; platform personeli secilen destek durumuna gore tum triage kuyruklarini anlik filtreleyebiliyor. web/src/test/admin-page-tenant-governance.test.tsx bu filtre davranisini 9/9 yesil sabitledi.
	- 2026-04-15 ilerleme: Cozulen destek kayitlari icin kapanis nedeni zorunlulugu getirildi. Tenant support workflow kontratina support_resolution_reason alani eklendi; backend resolved durumuna geciste bos kapanis nedeni payload'ini 400 ile reddediyor, frontend ise Platform Operasyonlari kartinda yalnizca Cozuldu secildiginde Kapanis Nedeni alanini gosterip payload'a ekliyor. tests/test_tenant_governance_authz.py 21/21 ve web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil dogrulandi.
	- 2026-04-15 ilerleme: Platform overview katmani da destek workflow sinyalleriyle hizalandi. web/src/pages/AdminPage.tsx platform_overview sekmesinde artik destek durumu ve kapanis bilgisi kullanilarak operasyon KPI'lari ile oncelikli tenant etiketleri ayni veri modelinden besleniyor; boylece ust seviye izleme paneli ile Platform Operasyonlari sekmesi arasindaki durum resmi tutarli hale geldi. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldı.
	- 2026-04-15 ilerleme: Platform overview icindeki destek resmi owner kapasite gorunumuyle derinlestirildi. web/src/pages/AdminPage.tsx artik ownersiz aktif destek kaydi sayisini ve en yogun destek owner ozetini de gosteriyor; bu sayede platform_support rolu triage dagilimini detay sekmesine gecmeden gorebiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.
	- 2026-04-15 ilerleme: Platform overview destek KPI'larina temas tazeligi sinyali de eklendi. web/src/pages/AdminPage.tsx artik uc gun ve uzeri temas edilmeyen aktif destek kayitlarini ayri bir ozet kartinda gosteriyor; bu sayede platform ekibi yalnizca durum ve owner dagilimini degil, sessiz kalan queue birikimini de ilk bakista gorebiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.
	- 2026-04-15 ilerleme: Platform Operasyonlari sekmesine owner bazli hizli filtre de eklendi. web/src/pages/AdminPage.tsx status sayaçlarinin yanina Tum Owner'lar / Atanmamis Kayitlar / secili owner bazli filtre ekleyerek queue gorunumunu birlestik status+owner kiriliminda daraltabilir hale geldi; platform destek ekibi artik sorumluluk dagilimini detay kartlar arasinda kaybolmadan hizlica ayirabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.
	- 2026-04-15 ilerleme: Atanmamis destek kayitlari icin tek tik owner atama quick-action'i eklendi. web/src/pages/AdminPage.tsx Platform Operasyonlari kartinda owner alani bosaldiginda "Beni Ata" aksiyonunu gosteriyor; platform_support kullanicisi bu butonla kaydi kendi adi veya e-postasi ile aninda sahiplenebiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.
	- 2026-04-15 ilerleme: Platform Operasyonlari queue kartlari toplu sahiplenme quick-action'i da kazandi. web/src/pages/AdminPage.tsx owner alani bos olan gorunur queue kayitlari icin "Gorunenleri Bana Ata" aksiyonunu ekleyerek ilk dort karti tek tikla mevcut platform kullanicisina atayabiliyor; bu da triage baslangicini tek tek kart acmadan hizlandiriyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.
	- 2026-04-15 ilerleme: Queue kartlarina toplu durum baslatma aksiyonu da eklendi. web/src/pages/AdminPage.tsx gorunur kayitlari tek tikla Islemde durumuna ceken "Gorunenleri Isleme Al" quick-action'i ile platform ekibi triage kartlarini tek tek degistirmeden aktif is akisini baslatabiliyor. web/src/test/admin-page-tenant-governance.test.tsx 10/10 yesil kaldi.

### Paket 6 - Rol/Departman/Personel Izinleri ve Personel IA
- [x] Rol/departman/personel izinleri icin tek referans dokumani olustur ve ana plana bagla
- [x] Personeller bilgi mimarisini 3 ana segmente ayir: Portal Personelleri, Stratejik Partnerler, Tedarikciler
- [x] Stratejik Partner ve Tedarikci listelerinde satir bazli personel sayaci goster
- [x] Stratejik Partner/Tedarikci satirina tiklayinca alt personel listesini acilan detayda goster
- [x] Menu agacini Turkce adlarla kesinlestir (tenant/governance gibi metinleri is dilinde kaldir)
- [x] Rol tabanli menu gorunurluk matrisi + aksiyon matrisi + scope kurallarini kodda tek kaynaktan besle
- [x] Kisiye ozel izin override (Acik/Kapali toggle) veri modelini ve API kontratini ekle
- [x] Canli yetki onizlemesini kisiye ozel override ile entegre et (yesil onay / kirmizi X)
- [x] Menu alt acilimlari icin granular izin secimi ekle (menu bazli alt yetkiler)
- [x] Ust rolun alt roller icin izin ac/kapat yapabildigi delege modeli ekle
- [x] Bu paketi backend + frontend test paketleriyle yesile sabitle

	- 2026-04-16 plan notu: Bu paketin detayli is akisi, kararlar, veri modeli ve durum takibi
	  `docs/ROL_DEPARTMAN_PERSONEL_IZINLERI.md` dosyasinda yonetilir.
	- 2026-04-16 ilerleme: web/src/pages/admin/PersonnelTab.tsx personel bilgi mimarisi 3 segmente ayrildi.
	  Portal Personelleri mevcut tablo akisiyla, Stratejik Partner Personeli grup satirlari + personel sayaci
	  + acilir alt listeyle, Tedarikci Personeli ise /suppliers ve /suppliers/{id}/users kaynakli grup satiri +
	  personel sayaci + acilir alt listeyle calisir hale geldi.
	- 2026-04-16 ilerleme: api/models/permission_override.py ile user_permission_overrides ve
	  role_permission_delegations tablolari eklendi; api/routers/admin.py yeni permission-catalog,
	  user permission override ve delegation endpointleriyle guncellendi. web/src/components/PersonnelCreateModal.tsx
	  canli yetki onizlemesinde menu ve alt-menu bazli Acik/Kapali toggle'lari kalici hale getirildi.
	- 2026-04-16 ilerleme: Paket 6 test paketi yesile sabitlendi. tests/test_paket6_permission_override_authz.py
	  (14/14) permission-catalog, role-permission-matrix, user permission override ve delegation endpointlerinin
	  erisim kontrolunu dogruluyor. web/src/test/paket6-permission-matrix.test.ts (13/13)
	  resolveMatrixProfileKey ve buildMenuPreviewFromMatrix fonksiyonlarini, override map uygulama
	  mantigini ve super_admin/satinalmaci/bilinmeyen profil senaryolarini kapsiyor. Paket 6 tamamen tamamlandi.
	- 2026-04-16 ilerleme: 4-scope mimari implementasyon baslangici tamamlandi. api/models/channel.py
	  (ChannelOrganization, ChannelMember, CommissionContract, CommissionLedger, ChannelReferral),
	  api/models/payment.py (PaymentTransaction, PaymentWebhookEvent), api/models/user.py
	  (scope_type + role_profile_code), api/routers/channel.py, api/routers/payment.py,
	  api/services/payment/base.py ve api/services/payment/iyzico_adapter.py eklendi; api/main.py ile
	  api/models/__init__.py bu modeller/routerlar icin guncellendi.
	- 2026-04-16 ilerleme: iyzipay paketi aktif ortama kuruldu ve payment provider katalogu genisletildi.
	  api/services/payment/provider_catalog.py ile iyzico, PayTR, ParamPOS, Sipay, Havale/EFT ve PayPal
	  readiness gorunumu eklendi; /api/v1/payment/providers endpoint'i 200 donuyor. bank_transfer akisi
	  uygulanabilir fallback olarak eklendi; PayTR ve Sipay adapterlari iskelet seviyesinde hazirlandi.
	- 2026-04-16 ilerleme: campaign/referral odul sistemi ilk calisir surume geldi. api/models/campaign.py,
	  api/schemas/campaign.py, api/services/campaign_service.py ve api/routers/campaign_admin.py ile kampanya,
	  kural, event, participant ve reward grant veri modeli kuruldu. web/src/components/admin/CampaignsTab.tsx
	  admin ekranina baglandi; kampanya olusturma, test event basma, odul goruntuleme ve apply-grant akisi
	  smoke test ile dogrulandi.

## 8B. Kalan Bilincli Legacy Role Kullanımlari

Bu bolum, system_role gecisi devam ederken bilincli olarak korunan role bagimliliklarini ayirir.

Gecici ama bilincli korunan alanlar:
- Auth payloadlarinda role alani halen tasiniyor; mevcut istemci ve eski token akislariyla uyumluluk icin korunuyor.
- Satin alma onay zinciri ve required_role alanlari halen business role mantigiyla calisiyor; bunlar system_role degil operasyonel gorev roludur.
- Test/seed verilerinde satinalma_* rolleri halen uretiliyor; bu alanlar procurement is akislarini populate etmek icin gerekli.
- Gecis scriptlerinde legacy role kontrolu, eski veriyle geriye uyumluluk icin ikinci kaynak olarak korunuyor.

Sonraki temizlik adaylari:
- Auth response ve token tuketen frontend kodunda role alaninin ne kadar daha gerekli oldugunu azaltmak.
- [x] Quote approval zincirini business_role semantigine gecis icin hazirlamak: required_business_role alani eklendi, payload ve migration taslagi olusturuldu.
- [x] legacy role ile system_role birlikteligini raporlayan bir migration denetim komutu eklemek. Dosya: api/scripts/audit_role_system_role_consistency.py
- [x] role/system_role denetim aracina guvenli auto-fix dry-run/apply modu eklemek.
- [x] denetim aracina JSON ve CSV dosya cikti destegi eklemek; terminal cikisi olmasa da workspace icinde rapor alinabilsin.

Required_role kaldirma son faz checklisti:
- [x] Tum backend okuma/yazma noktalarinda required_business_role birincil olsun.
- [x] Frontend approval ekranlarinda required_role fallbackleri sadece gecis emniyeti icin kalsin.
- [x] Veritabani denetimi ile required_business_role bos kayit kalmadigi dogrulansin.
- [x] required_role icin yazim durdurulsun, sadece okuma fallbacki kalsin.
- [x] Son-faz migration taslagi hazirlansin: required_business_role NOT NULL, required_role nullable compatibility mirror olsun.
- [x] Son migration ile required_role kaldirilsin veya compatibility view seviyesine indirilsin.

	- 2026-04-15 ilerleme: Paket 2 icin approval write-path canonical alana daraltildi. api/services/quote_approval_service.py yeni approval kayitlarinda artik required_role mirror yazmiyor; sync fonksiyonu yalnizca legacy kayitlardan required_business_role backfill etmek icin kullaniliyor. Hedefli backend approval paketleri tests/test_approval_workflow.py + tests/test_approval_authz.py + tests/test_quote_approval_permissions.py + tests/test_quote_readonly_platform_authz.py olarak 14/14 yesil dogrulandi.

	- 2026-04-15 ilerleme: approval transition auditi mevcut veri uzerinde temiz dondu. api/scripts/audit_role_system_role_consistency.py approval-transition-audit.json ve approval-transition-audit.csv ciktilariyla calistirildi; total_quote_approvals=6, quote_approvals_with_issues=0 ve repair_preview.preview_rows=0 dogrulandi. Boylece Paket 2 icin veritabani drift dogrulamasi tamamlandi; geriye esasen endpoint/payload dokumantasyonunu netlestirme ve son compatibility drop migration'i kaldi.

	- 2026-04-15 ilerleme: approval endpoint payload sozlesmesi de sabitlendi. api/routers/approval_router.py icindeki /approvals/user/pending ve /approvals/{quote_id}/pending response'lari required_business_role ve required_business_role_label alanlarini birincil, required_role_mirror alanini compatibility veri olarak doner hale getirildi; web/src/types/approval.ts ve tests/test_approval_authz.py bu kontrati acikca belgeleyip dogruladi. Hedefli approval regresyon paketi tekrar 14/14 yesil dondu.

	- 2026-04-15 ilerleme: Paket 2 final compatibility migration'i de hazirlandi. migrations/2026_04_15_finalize_quote_approval_required_role_compat_cleanup.sql eklendi; bu faz required_business_role dolu kayitlarda required_role mirror alanini null'a cekerek DB tarafinda compatibility seviyesine indiriyor, API ise required_role degerini response'ta required_business_role uzerinden sentezlemeye devam ediyor. tests/test_approval_authz.py null mirror senaryosuyla genisletildi ve hedefli approval regresyon paketi 15/15 yesil dogrulandi.

## 8A. Mevcut Model -> Hedef Model Esleme Envanteri

Bu bolum mevcut kod tabanindaki modellerin yeni tenant mimarisindeki karsiligini
ve uygulanacak donusum tipini tanimlar.

### Kimlik ve Organizasyon

#### users -> platform_users + tenant_users

Mevcut durum:
- Tum ic kullanicilar ayni users tablosunda
- role alani hem sistem erisimini hem is rolunu tasiyor
- created_by_id tenant izini dolayli olarak tasiyor
- invitation_token ve invitation_accepted ic kullanici aktivasyonunda kullaniliyor

Hedef donusum:
- super_admin ve platform operasyon hesaplari platform_users katmanina ayrilacak
- musteri kullanicilari tenant_users yapisina alinacak
- role alani ikiye ayrilacak:
	- system_role: tenant_owner, tenant_admin, tenant_member, supplier_user
	- business_role: satin_alma_direktoru, satin_alma_yoneticisi, finans_onayci vb.

Donusum tipi:
- [ ] tablo bolunmesi
- [ ] auth mantiginin yeniden yazimi
- [ ] eski role verilerinin map edilmesi

#### departments -> tenant_departments

Mevcut durum:
- artik created_by_id var
- isim su an global unique davranisina yakin kurgulanmis

Hedef donusum:
- tenant_id zorunlu olacak
- isim unique olmaktan cikacak, tenant icinde unique olacak
- parent_department_id ile hiyerarsi desteklenecek

Donusum tipi:
- [ ] tenant_id ekle
- [ ] unique indexleri tenant bazina cek

#### roles -> tenant_roles

Mevcut durum:
- artik created_by_id var
- permission iliskileri global role_permissions tablosu ile kurulu
- admin ve super_admin gibi sistem rolleriyle operasyon rolleri ayni kavramda bulusuyor

Hedef donusum:
- tenant_roles sadece tenant icindeki is rollerini tutsun
- sistem rolleri role tablosundan cikarilsin
- permission atamalari capability bazli korunabilir ama tenant bagli hale gelsin

Donusum tipi:
- [ ] sistem rolleri ile is rollerini ayir
- [ ] tenant_id ekle
- [ ] role_permissions iliskisini tenant rollerine bagla

#### company_roles -> tenant_user_assignments

Mevcut durum:
- user, company, role, department baglantisini ayni tabloda tutuyor
- sub_items_json ile departman alt kirilimlari tasiniyor

Hedef donusum:
- tenant_user_assignments ana atama tablosuna donusecek
- title, is_primary ve gerekirse scope alanlari eklenecek

Donusum tipi:
- [ ] tablo yeniden adlandirma veya yeni tabloya tasima
- [ ] tenant_id zincirini company veya user uzerinden dogrulama

### Tenant Varliklari

#### companies -> tenant_companies

Mevcut durum:
- created_by_id var
- user_company ve company_department ile iliski kuruluyor
- musterinin firma kaydi ile tenant kavrami birbirine karismis durumda

Hedef donusum:
- tenant kavrami company ustune binmeyecek
- company tenant icindeki firma/sube kaydi olacak
- tenant ana musteri kimligi, company ise org birimi olacak

Donusum tipi:
- [ ] tenant_id ekle
- [ ] owner mantigini tenant uzerine tasi
- [ ] mevcut ana firma kayitlarini tenant default company olarak esle

#### projects -> tenant_projects

Mevcut durum:
- created_by_id var
- company_id ile bagli
- user_projects ve project_permissions ile operasyonel erisim tanimlaniyor

Hedef donusum:
- tenant_id zorunlu olacak
- company_id tenant icindeki org birimini gosterecek
- proje yetkileri tenant role/capability modeliyle uyumlu hale getirilecek

Donusum tipi:
- [ ] tenant_id ekle
- [ ] project_permissions tablosunu tenant yetki modeline uyarla

#### suppliers -> tenant_suppliers

Mevcut durum:
- created_by_id uzerinden admin sahipligi var
- supplier_users ayri tabloda
- project_suppliers ile projeye baglaniyor

Hedef donusum:
- tenant_suppliers iki kaynagi desteklemeli:
	- private supplier
	- platform network supplier
- supplier_users supplier portal kullanicisi olarak korunmali

Donusum tipi:
- [ ] tenant_id ekle
- [ ] source_type ekle ve platform_supplier_id opsiyonunu tanimla
- [ ] supplier auth portalini tenant bagindan ayri ama iliskili tut

### RFQ / Teklif / Onay Zinciri

#### quotes -> tenant_rfqs

Mevcut durum:
- project_id ve created_by_id bagli
- company alanlari denormalized olarak quote icinde tutuluyor
- durum makinesi RFQ mantigina yakin ama isimlendirme quote merkezli

Hedef donusum:
- quotes yapisi tenant_rfqs olarak yeniden adlandirilmali
- tenant_id, company_id ve project_id ile acik tenant baglanti kurulmalı
- company_name ve contact alanlari zamanla tenant company referansina veya snapshot mantigina cekilmeli

Donusum tipi:
- [ ] tablo adlandirma karari ver
- [ ] tenant_id ekle
- [ ] denormalize company alanlari icin snapshot stratejisi belirle

#### quote_items -> tenant_rfq_items

Mevcut durum:
- quote'a bagli satir kalemleri mevcut

Hedef donusum:
- buyuk olcude ayni mantik korunabilir
- sadece tenant_rfq baglantisi uzerinden devam eder

Donusum tipi:
- [ ] isimlendirme ve foreign key guncellemesi

#### supplier_quotes + supplier_quote_items -> tenant_supplier_quotes + tenant_supplier_quote_items

Mevcut durum:
- revize sistemi, skor, ticari alanlar zaten var

Hedef donusum:
- tenant_id eklenecek
- rfq odakli isimlendirme netlestirilecek
- supplier portal akisi korunacak

Donusum tipi:
- [ ] tenant_id ekle
- [ ] rfq tabanli isimlendirme sadeleştirmesi yap

#### quote_approvals -> tenant_approvals

Mevcut durum:
- quote bazli ve supplier_quote opsiyonlu calisiyor
- required_role string alaninda duruyor

Hedef donusum:
- entity_type + entity_id mantigina gecilmeli
- approval_step, approver_user_id, decision ile daha genel bir approval engine kurulmalı

Donusum tipi:
- [ ] generic approval tablosuna gecis
- [ ] role string yerine role/capability veya policy referansi ekle

### Yardimci Modeller

#### system_emails -> tenant_settings + tenant scoped sender accounts

Mevcut durum:
- owner_user_id ile kullanici bazli sahiplik var

Hedef donusum:
- tenant bazli gonderici hesaplari olmali
- super admin default hesaplari ayri kalmali

Donusum tipi:
- [ ] owner_user_id mantigini tenant_id + optional platform scope yapisina cevir

## 8B. Ilk Teknik Uygulama Paketi

Ilk kod fazinda asagidaki teknik isler yapilmali:

- [x] Tenant SQLAlchemy modelini ekle
- [x] tenant_settings modelini ekle
- [x] users tablosuna gecici tenant_id ekleme stratejisini belirle
- [x] companies, projects, suppliers, quotes icin tenant_id migration envanterini cikar
- [x] mevcut admin kayitlarindan tenant bootstrap scripti tasarla
- [x] auth response modeline system_role kavramini ekle
- [x] AdminPage'i tenant admin workspace mantigina gore parcala
- [x] super admin ile tenant admin navigasyonunu ayir
- [x] super admin icin temel tenant CRUD yuzeyi baslat
- [x] tenant olustururken ilk tenant admin hesabi kurulumunu ekle
- [x] tenant admin'in personel akisindan admin veya super admin uretmesini engelle
- [x] super admin icin tenant owner yeniden atama ve aktif/pasif tenant aksiyonlarini ekle
- [x] frontend permission ve yonlendirme kararlarini system_role farkindali hale getir
- [x] admin router icinde temel create/list/update scope'unu tenant_id merkezli hale getir
- [x] auth branding katmanini tenant ve tenant settings oncelikli hale getir
- [x] quote ve approval router ana akislarina tenant scope ekle
- [x] supplier router temel CRUD ve yonetim girislerine tenant scope ekle
- [x] quotes.py icindeki ikinci quote akisini tenant-aware hale getir
- [x] super admin tam yetkiyi korurken platform destek/operasyon personeli icin system_role omurgasi ekle

## 8C. Aktif Sprint Backlogu (3'lu Icra Batchleri)

16 Nisan 2026 itibariyla aktif odak:
- Paket 2 kapanis sertlestirmesi (required_business_role birincilligi)
- Paket 5 kapanis sertlestirmesi (SaaS ticari katman [~] maddeleri)
- Paket 4 release penceresi hazirligi (final migration + operasyon runbook)

### Batch A - Approval Finalizasyonu (Paket 2)
- [x] Backend endpoint taramasi: approval okuma/yazma yuzeylerinde required_business_role disi karar noktalari kalmadi dogrula
- [x] Frontend approval ekranlari: required_role kullanimini yalnizca compatibility fallback seviyesinde sinirla
- [x] Kapanis kaniti: hedefli approval regresyon + transition audit ciktilarini tek tarihli not ile plana isle

	- 2026-04-16 ilerleme: approval_router.py ve quotes.py response/payload yuzeylerinde required_business_role birincilligi dogrulandi; required_role yalnizca compatibility alan olarak birakildi. web/src/auth/permissions.ts canonical-first resolver'lara daraltildi, web/src/pages/AdminPage.tsx approval gorunumleri ortak helper uzerinden ayni fallback zincirini kullanir hale getirildi ve web/src/test/admin-page-tenant-governance.test.tsx fixture'lari required_business_role + required_role_mirror kontratina yaklastirildi. Transition audit, api/scripts/audit_role_system_role_consistency.py ile yeniden calistirildi ve approval-transition-audit-2026-04-16.json + approval-transition-audit-2026-04-16.csv ciktilarinda quote_approvals_with_issues=0 dogrulandi. Frontendte npm --prefix web run test:run -- src/test/admin-page-tenant-governance.test.tsx + src/test/permissions.test.ts paketi 57/57 yesil ile kapanis kaniti olarak eklendi.

Tamamlanma kriteri:
- Paket 2 altindaki iki [~] madde [x] olur ve required_role sadece compatibility okuma alani olarak kalir.

### Batch B - SaaS Ticari Kapanis (Paket 5)
- [x] Paket/Modul ekrani: super admin operasyonunda plan, limit ve billing ozeti tek akisda tutarli hale getir
- [x] Limit enforcement kapsamasi: tenant olusturma/guncelleme ve kritik write akislarinda plan-limit ihlali tek policy katmanindan uygulanir
- [x] Billing backlog parcalama: webhook, faturalama, reconciliation ve hata-iyilestirme adimlarini teslim edilebilir alt backlog maddelerine ayir

	- 2026-04-16 backlog parcasi (Paket 5 / Billing):
	1. Webhook Ingest Hardening
	   - Kapsam: provider signature dogrulama, duplicate event idempotency, failed event retry-state alanlari.
	   - Kod hedefi: api/routers/billing_router.py + api/services/billing_service.py
	   - Test hedefi: tests/test_tenant_governance_authz.py icine webhook failure/replay senaryolari.
	2. Invoice Lifecycle Standardizasyonu
	   - Kapsam: draft/open/paid/voided status map'i, due-date gecikme sinyali ve panel KPI tutarliligi.
	   - Kod hedefi: api/services/billing_service.py + web/src/pages/AdminPage.tsx
	   - Test hedefi: web/src/test/admin-page-tenant-governance.test.tsx fatura status filtreleri + KPI assertleri.
	3. Reconciliation Raporu
	   - Kapsam: tenant_subscriptions, billing_invoices ve webhook_events arasinda mismatch denetimi.
	   - Kod hedefi: api/scripts/audit_billing_reconciliation.py (yeni) + JSON/CSV cikti.
	   - Test hedefi: script unit testi (yeni test dosyasi) ve ornek rapor artefakti.
	4. Operasyonel Hata Iyilestirme
	   - Kapsam: failed webhook eventleri icin "yeniden isle" admin aksiyonu ve hata mesaji standardi.
	   - Kod hedefi: billing webhook endpoint + AdminPage Billing Operasyonlari paneli.
	   - Test hedefi: backend retry endpoint authz + frontend quick-action gorunurluk testleri.

	- 2026-04-16 notu: Bu alt backlog parcasi tamamlandi; sonraki uygulama turunde sirayla 1 -> 2 -> 3 -> 4 uygulanacak.
	- 2026-04-16 ilerleme (Batch B / Adim 1): Billing webhook ingest hardening uygulandi. api/services/billing_service.py icine resolve_billing_provider_event_id + stripe signature dogrulama helper'i eklendi; api/routers/billing_router.py ham webhook body uzerinden imza dogrular ve provider_event_id zorunlulugunu endpoint girisinde netlestirir hale getirildi. tests/test_tenant_governance_authz.py icine shared-secret rejection ve stripe-signature validation regresyonlari eklendi; billing webhook hedefli test turu 3/3 yesil dondu.
	- 2026-04-16 ilerleme (Batch B / Adim 2): Invoice lifecycle standardizasyonu AdminPage uzerinde tamamlandi. web/src/pages/AdminPage.tsx icinde open/paid/other KPI ve filtreleri artik raw status yerine normalize edilmis lifecycle bucket'lar (open + past_due + unpaid + uncollectible => acik tahsilat) uzerinden hesaplanir hale getirildi; fatura etiketleri de lifecycle'a gore gorunurlestirildi. web/src/test/admin-page-tenant-governance.test.tsx fatura fixture'i past_due + paid statuslarini kapsayacak sekilde genisletildi ve filtre assertleri (acik/odendi) yeni davranisa gore guncellendi. Hedefli frontend regresyon turu: npm --prefix web run test:run -- src/test/admin-page-tenant-governance.test.tsx sonucu 48/48 yesil.
	- 2026-04-16 ilerleme (Batch B / Adim 3): Reconciliation rapor omurgasi eklendi. api/scripts/audit_billing_reconciliation.py tenant_subscriptions, billing_invoices ve billing_webhook_events zincirinde tenant-plan uyumsuzlugu, subscription bagi kopuklugu, tenant drift ve failed webhook hata-mesaji boslugu gibi tutarsizliklari section bazli denetleyip JSON/CSV cikti uretecek sekilde eklendi. tests/test_billing_reconciliation_audit.py ile issue collector ve section aggregate davranisi birim test seviyesinde sabitlendi (4/4 yesil). Script audit-billing-reconciliation.json ve audit-billing-reconciliation.csv artefaktlariyla calistirildi; mevcut ortamda issue_counts=0 raporlandi.
	- 2026-04-16 ilerleme (Batch B / Adim 4): Failed webhook eventleri icin yeniden-isleme aksiyonu eklendi. api/services/billing_service.py icine retry_billing_webhook_event fonksiyonu eklendi; event payload_json uzerinden subscription + invoice senkronizasyonunu tekrar dener ve ayni event kaydini pending -> processed/failed seklinde gunceller. api/routers/billing_router.py icinde super_admin ile sinirli POST /billing/webhooks/events/{event_id}/retry endpoint'i ve BillingWebhookRetryOut cevabi eklendi. web/src/services/admin.service.ts retryBillingWebhookEvent API cagrisi ile genisletildi; web/src/pages/AdminPage.tsx Billing Operasyonlari > Son Webhook Olaylari panelinde failed event kartlari icin hata metni + "Yeniden Isle" quick-action butonu ve loading durumu eklendi. Hedefli dogrulama: backend pytest (test_tenant_governance_authz.py -k billing_webhook_retry...) 2/2 yesil, frontend vitest (admin-page-tenant-governance) 49/49 yesil.

Tamamlanma kriteri:
- Paket 5 altindaki dort [~] madde icin en azindan biri [x] kapanir, kalanlar icin testli ve tarihli alt-adimlar netlesir.

	- 2026-04-16 kapanis notu: Bu batch altindaki iki acik teslim maddesi de tamamlandi. Super admin Paket ve Kullanim sekmesi plan/modul matrisi, canli tenant kullanim snapshot'i ve billing operasyon panellerini tek akisda birlestiriyor; runtime limit enforcement ise api/services/subscription_service.py altinda proje, ic kullanici ve private supplier write-path'lerinde ortak policy katmanindan uygulaniyor. Paket 5 ust basligindaki dort [~] madde bu nedenle [x] olarak guncellendi.

### Batch C - Release Hazirligi (Paket 4 Son Faz)
- [x] Legacy drop preflight: quote/rfq legacy cleanup ve approval compatibility migration'lari icin canli-oncesi kontrol listesini yaz
- [x] Operasyon runbook: apply, rollback, dogrulama ve rapor artefakt adimlarini tek dokumanda sabitle
- [x] Release penceresi cikti seti: JSON/CSV audit raporlari + hedefli test ciktilarini release notu formatinda toparla

	- 2026-04-16 ilerleme (Batch C): Release hazirligi dokumantasyonu tamamlandi. docs/release/tenant-saas-final-migration-preflight.md canli-oncesi GO/NO-GO checklistini, docs/release/tenant-saas-final-migration-runbook.md apply/rollback/dogrulama sirasini, docs/release/release-window-2026-04-16.md ise audit artefaktlari ve hedefli test ciktilarini tek release notu formatinda sabitledi.

Tamamlanma kriteri:
- Paket 4 kapanisinda teknik riskler dokumante edilir, migration karari release penceresinde uygulanabilir hale gelir.

Not:
- Icra sirasi A -> B -> C olarak izlenecek.
- Her batch sonunda ilgili paket satirlari ve bu bolumdeki checklist guncellenecek.

## 8D. `required_role` Legacy Cleanup Envanteri

Bu bolum, `required_role` alani icin kalan uyumluluk (compatibility) kodlarinin nerede oldugunu ve ne zaman kaldirilabilecegini belgelemektedir.

### Mevcut Durum (Dogru Yapilandirilmis — Dokunma)

| Dosya | Nokta | Aciklama |
|---|---|---|
| `api/models/quote_approval.py` | `required_role` DB kolonu | Drop migration hazir; henuz uygulanmamali |
| `api/schemas/quote.py` | `required_role: Optional[str]` response alani | Geriye-uyumlu API sozlesmesi; istemci migrate olana dek kaldir |
| `api/routers/quotes.py` | `"required_role": resolve_required_business_role(a)` | Uyumluluk key altinda kanonik deger; dogru |
| `api/routers/approval_router.py` | `"required_role": resolve_required_business_role(a)` | Ayni sekilde dogru |
| `api/services/quote_approval_service.py` | `resolve_required_business_role()` fallback zinciri | Kanonik-oncelikli; dogru |
| `web/src/types/approval.ts` | `required_role`, `required_role_mirror`, `required_role_label` | Frontend uyumluluk sozlesmesi; dogru |
| `web/src/auth/permissions.ts` | `resolveApprovalLegacyRole` | Son zincir halkasi; kasitli |

### Gelecekte Kaldirilabilecek Noktalar (Drop Migration Sonrasi)

- [ ] **`api/services/quote_approval_service.py` — `pending_approval_matches_business_role` ikinci OR kosulu**
  Konum: `QuoteApproval.required_business_role.is_(None) & (QuoteApproval.required_role == normalized_role)`
  Ne zaman: Tum kayitlara `required_business_role` backfill tamamlandiktan ve DB drop migration uygulanaildiktan sonra bu ikinci OR kolu kaldirilabilir.

- [ ] **`api/models/quote_approval.py` — `required_role` DB kolonu**
  Ne zaman: Drop migration uygulanaildiktan sonra; `api/alembic.ini` migration dosyasi mevcuttu.

- [ ] **`api/schemas/quote.py` ve router response `"required_role"` key**
  Ne zaman: Tum istemciler (frontend + harici entegrasyon) `required_business_role` alanina gecirildiginde; breaking change penceresi gerektirir.

- [ ] **`web/src/types/approval.ts` — `required_role`, `required_role_mirror`, `required_role_label` alanlari**
  Ne zaman: Backend `required_role` response keyini kaldirdigindan sonra frontend tiplerinden de kaldirilir.

- [ ] **`web/src/auth/permissions.ts` — `resolveApprovalLegacyRole` ve son OR kolu**
  Ne zaman: Frontend tipler temizlendikten sonra; `resolveApprovalBusinessRole` ve `resolveApprovalRoleLabel` zaten kanonik.

### Cleanup Siralama Kurali

1. Tum DB kayitlari `required_business_role` dolu oldugunda `sync_required_role_mirror` backfill adimini kapat
2. DB drop migration uygula (`required_role` kolonunu kaldir)
3. Backend OR kosulunu ve schema alanini kaldir
4. Frontend tip ve resolver zincirini temizle

---

## 9. Degisiklik Kaydi

Bu bolum her calisma sonunda guncellenecektir.
- [x] 2026-04-16 BUYER ASISTANS branding + public yeniden duzenleme: uploads/Buyer_Asistans_Logolar logo ailesi web/public/brand altina tasindi, deneme logolari kaldirildi; ana sayfa/akislarda yeni logolar kullanildi, AdminPage'e Public Fiyatlandirma sekmesi eklendi, infra/nginx + infra/cloudflare altinda canliya alinabilir domain-SEO config dosyalari olusturuldu
- [x] 2026-04-16 BUYER ASISTANS public web domain-SEO kurallari ve is akis detayi BUYER_ASISTANS_PUBLIC_WORKFLOW.md dosyasina tasindi; bu alandaki uygulama adimlari bu dosyadan devam edecek
- [x] 2026-04-16 Yeni ozellik test kapanis: onboarding-page + public-pages + admin-page yeni sekme kapsamlari (59/59 vitest yesil); onboarding, platform-analytics, platform-suppliers, campaigns ve public alan testleri sabitlendi
- [x] 2026-04-16 Devam turu dogrulama: frontend hedefli vitest paketi (admin-page-tenant-governance + permissions + auth-routing) 63/63 yesil, backend hedefli pytest paketi (tenant_governance_authz + admin_catalog_readonly_authz) 28/28 yesil
- [x] 2026-04-16 Faz 3 self-serve onboarding wizard tamamlandi: `/api/v1/onboarding/plans`, `/api/v1/onboarding/register` endpointleri ve `/onboarding` public akisi eklendi
- [x] 2026-04-16 Menu kapanislari tamamlandi: platform public alan (`/`, `/cozumler`, `/fiyatlandirma`, `/demo`), AdminPage Raporlar sekmesi, Platform Tedarikci Havuzu, Kampanyalar ve Platform Analitikleri eklendi
- [x] 2026-04-16 Terminoloji karari genisletildi; kullaniciya gorunen dilin Turkce-first oldugu netlestirildi ve Terminoloji_karari.md referans dokumani eklendi
- [x] 2026-04-16 Batch C operator kolaylastirma: migration penceresi icin tek dosyada kopyala-calistir komut bloklari docs/release/migration-window-copy-paste-commands-2026-04-16.md olarak eklendi
- [x] 2026-04-16 Batch C operasyon teslimi: migration penceresi icin dakika bazli uygulama komut checklisti docs/release/migration-window-minute-checklist-2026-04-16.md olarak eklendi
- [x] 2026-04-16 Batch C evidence refresh: runbook komutlari yeniden calistirildi; approval/quote-rfq/billing audit ciktilari guncellendi ve hedefli backend 2/2 + frontend 49/49 test kaniti release-window dokumanina islendi
- [x] 2026-04-16 Batch C kapanis: legacy-drop preflight checklisti, operasyon runbooku ve release-window cikti seti docs/release altinda sabitlendi
- [x] 2026-04-16 Batch B Adim 4 ilerleme: failed webhook event retry endpointi ve AdminPage quick-action gorunurlugu eklendi; backend 2/2 + frontend 49/49 yesil
- [x] 2026-04-16 Batch B Adim 3 ilerleme: billing reconciliation audit scripti eklendi; unit test paketi ile issue collector/aggregate davranisi sabitlendi
- [x] 2026-04-16 Batch B Adim 2 ilerleme: invoice lifecycle KPI/filtre normalizasyonu AdminPage'de tamamlandi; admin-page-tenant-governance vitest paketi 48/48 yesil
- [x] 2026-04-16 Batch A ilerleme: approval canonical role birincilligi yeniden dogrulandi; backend approval regresyonu 13/13 yesil, transition audit issue 0; frontend admin-page hedefli turu local DB'de tenants.support_status kolonu eksikligi nedeniyle kismi acik kaldi
- [x] Frontend build ve test paketi tenant-aware UI ile tekrar dogrulandi
- [x] Backend smoke/test paketi tenant-aware auth, quote ve settings contractlariyla tekrar dogrulandi
- [x] Test fixture ve beklentileri system_role, quote payload ve yeni API prefixleriyle hizalandi
- [x] Navigation ve varsayilan yonlendirme system_role bazli hale getirildi
- [x] Super admin icin platform genel bakis ve tenant yonetimi sekmeleri eklendi
- [x] Super admin tarafinda tenant listeleme, olusturma ve guncelleme endpoint/yuzeyi eklendi
- [x] Tenant olusturma akisina ilk tenant admin davet/kurulum adimi eklendi
- [x] Tenant admin personel akisinda admin/super admin rol secimi ve backend atamasi engellendi
- [x] Tenant owner yeniden atama ve tenant aktif/pasif aksiyonlari tenant yonetimine eklendi
- [x] Frontend route guard, menu ve default yonlendirme system_role odakli permission kontrolune gecirildi
- [x] Admin router icinde company, department, role, project ve user akislarinda tenant_id otomatik tasinmaya ve scope icin kullanılmaya baslandi
- [x] Auth login, aktivasyon ve me yanitlarinda workspace branding tenant kaydi ve tenant settings uzerinden cozulmeye baslandi
- [x] Quote ve approval router icinde listeleme, kalem ekleme, import ve onay akislari tenant_id scope kontrolu ile guclendirildi
- [x] Supplier router icinde supplier olusturma, listeleme, detay ve temel yonetim girisleri tenant_id scope ile calisacak sekilde guncellendi
- [x] quotes.py icinde listeleme, olusturma ve temel status/onay girisleri tenant_id scope ve proje tenant bagiyla guncellendi
- [x] Platform destek ve operasyon kullanicilari icin system_role temeli, admin workspace gorunurlugu ve super admin personel olusturma akisi baslatildi

### 2026-04-14
- [x] Hedef urun konumu yeniden tanimlandi
- [x] Admin'in personelden ayri bir tenant rolu olmasi gerektigi netlestirildi
- [x] Tenant-SaaS donusum omurgasi yazili hale getirildi
- [x] Hedef veri modeli tablo bazinda cikarildi
- [x] Eski yapi -> yeni yapi migrasyon plani yazildi
- [x] Ekran agaci ve menu mimarisi belirlendi
- [x] Mevcut model -> hedef tenant model esleme envanteri yazildi
- [x] Tenant ve tenant_settings model omurgasi eklendi
- [x] Ana domain tablolarina tenant_id hazirlik alanlari eklendi
- [x] Mevcut admin kayitlarindan tenant bootstrap scripti eklendi
- [x] Auth response katmanina system_role eklendi
- [x] User modelinde system_role gecis alani eklendi
- [x] AdminPage tenant admin ve super admin icin rol-bilincli workspace olarak yeniden kurgulandi
- [x] Tenant admin personel yaratma akisinda admin ve super admin rollerine gecis kapatildi
- [x] Super admin tenant yonetiminde owner atama ve tenant lifecycle aksiyonlari baslatildi
- [x] Frontend permission katmani tenant_admin ve super_admin icin system_role merkezli calisacak sekilde guncellendi
- [x] Backend admin router scoped admin sorgulari created_by fallback'i koruyarak tenant_id oncelikli olacak sekilde guncellendi
- [x] Auth branding created_by fallback'inden cikarilip tenant-first mantiga gecirildi
- [x] Quote ve approval giris noktalarinda tenant disi kayitlara erisim tenant scope helper'lari ile kapatilmaya baslandi
- [x] Supplier CRUD ve temel supplier management girisleri tenant scope helper'i ile guclendirilmeye baslandi
- [x] Ikinci quote router icinde de tenant disi kayitlara erisim ve tenant bagsiz yeni quote olusumu sinirlandi
- [x] Super adminin tum yetkileri korunurken platform destek personeli icin ayri system_role zemini kod tabanina eklendi
- [x] Frontend regression paketi guncel tenant-aware beklentilerle tekrar yesile cekildi (14 dosya, 41 test)
- [x] Backend regression paketi guncel tenant-aware beklentilerle tekrar yesile cekildi (11 dosya, 51 test)
- [x] Backend test fixture'lari system_role, proje uyeligi, quote zorunlu alanlari ve settings schema beklentileriyle guncellendi
