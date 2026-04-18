# BUYER ASISTANS Public Web Is Akisi

Bu dosya, BUYER ASISTANS public web katmani ve multi-domain yayin kurgusu icin calisma referansidir.
Ana plan dosyasi: TENANT_SAAS_TRANSFORMATION_PLAN.md

## 1) Kural Seti (Kalici Not)

### Domain gorev dagilimi
- buyerasistans.com.tr: Ana kurumsal vitrin ve TR odakli ana SEO domaini
- buyerasistans.com: Global/EN acilis sayfasi ve uluslararasi lead toplama
- buyerasistans.online: Kampanya/landing ve A-B test odakli performans alani
- buyerasistans.info: Bilgi merkezi, rehber, sozluk, uzun kuyruk SEO icerik kutuphanesi

### SEO teknik kurallari
- Birincil canonical: kurumsal ana sayfalar icin buyerasistans.com.tr
- Domain bazli 301 ve canonical kurallari net tanimlanacak
- Dil varyantlarinda hreflang kullanilacak
- Ayni icerik birebir kopya yayinlanmayacak; domain niyetine gore icerik farklilastirilacak

### Altyapi kurali
- Tum domainler ayni hosting ve ayni veritabani uzerinde calisir
- Uygulama, tek release pipeline ve tek observability katmani ile yonetilir

## 2) Yapilanlar

- [x] Ana sayfa, hem Stratejik Ortak hem Tedarikci akisina hitap edecek sekilde guncellendi
- [x] Ana sayfaya "Stratejik Ortak Ol", "Tedarikci Ol", "Tedarikci Girisi" butonlari eklendi
- [x] Stratejik ortak ve tedarikci icin ayri bilgilendirme sayfalari eklendi
- [x] Demo sayfasi tek noktada iki modlu hale getirildi: stratejik ortak demosu / tedarikci demosu
- [x] Fiyatlandirma sayfasi iki bolumlu hale getirildi: stratejik ortak planlari + tedarikci planlari
- [x] Super admin tarafindan yonetilebilir public pricing backend endpointleri eklendi
- [x] Public pricing admin ekrani eklendi (/admin/public-pricing)
- [x] BUYER ASISTANS icin 3 adet logo taslak SVG secenegi eklendi
- [x] Ana sayfaya platform akis bolumu (kesif -> eslesme -> onay/performans) eklendi

## 3) Yapilacaklar

- [ ] Nginx/Cloudflare canli kurallari: host bazli canonical ve yonlendirme kurallari
- [ ] sitemap.xml ayrimi: .com.tr/.com/.online/.info niyetine gore sitemap segmentasyonu
- [ ] robots politikasi: kampanya ve bilgi merkezi tarama stratejisi
- [ ] hreflang haritasi: TR/EN sayfa eslemeleri
- [ ] Public analytics dashboard: domain bazli trafik ve lead KPI panosu
- [ ] Logo secimi (A/B/C) ve secilen logonun tum sayfalarda standardizasyonu

## 4) Operasyon Notu

Bu konudaki yeni isler once bu dosyada detaylandirilir.
TENANT_SAAS_TRANSFORMATION_PLAN.md icinde sadece ust seviye takip kaydi tutulur ve bu dosyaya referans verilir.

## 5) Nginx / Cloudflare Ornek Kurallar

### Nginx host bazli yonlendirme (ornek)
```nginx
server {
	listen 80;
	server_name buyerasistans.com.tr buyerasistans.com buyerasistans.online buyerasistans.info;
	return 301 https://$host$request_uri;
}

server {
	listen 443 ssl;
	server_name buyerasistans.com;
	location / {
		proxy_pass http://app_upstream;
		add_header Link '<https://buyerasistans.com$uri>; rel="canonical"' always;
	}
}

server {
	listen 443 ssl;
	server_name buyerasistans.com.tr;
	location / {
		proxy_pass http://app_upstream;
		add_header Link '<https://buyerasistans.com.tr$uri>; rel="canonical"' always;
	}
}
```

### Cloudflare (ornek)
- Redirect Rule: `.online/blog/*` -> `.info/blog/$1` (301)
- Transform Rule: `X-Domain-Intent: campaign | knowledge | corporate`
- Cache Rule: kampanya sayfalarinda kisa TTL, bilgi sayfalarinda uzun TTL

### Sitemap stratejisi
- `https://buyerasistans.com.tr/sitemap-main.xml`
- `https://buyerasistans.com/sitemap-global.xml`
- `https://buyerasistans.online/sitemap-campaigns.xml`
- `https://buyerasistans.info/sitemap-knowledge.xml`
