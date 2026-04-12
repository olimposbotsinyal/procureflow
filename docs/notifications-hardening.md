# Email Deliverability ve SMS Hazirlik Notlari

Bu dokuman, ProcureFlow icin e-posta teslim edilebilirligi (SPF/DKIM/DMARC) ve SMS altyapi ayarlarini tek yerde toplar.

## 1) DNS Kayitlari (Uretim)

- SPF: gonderim yapan SMTP saglayicisi icin tek SPF kaydi kullanin.
- DKIM: SMTP saglayicinizin verdigi CNAME/TXT DKIM kayitlarini eksiksiz tanimlayin.
- DMARC: ilk asamada gozlem modu, sonra karantinaya gecis.

Ornek DMARC (baslangic):

```
Host: _dmarc.yourdomain.com
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; fo=1; adkim=s; aspf=s; pct=100
```

Ornek DMARC (sikilastirma):

```
Host: _dmarc.yourdomain.com
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; adkim=s; aspf=s; pct=100
```

## 2) Uygulama Seviyesi Iyilestirmeler

Asagidaki basliklar eklendi:

- Message-ID alaninda gonderen domain kullanimi
- HTML + plain text multipart birlikte gonderim

Not: Davet ve bildirim mailleri islemsel (transactional) akistir. Bu nedenle bulk/list basliklari kullanilmaz.

Not: SPF/DKIM/DMARC esas etkisi DNS tarafindadir. Kod tarafi tek basina yeterli degildir.

## 3) SMTP Ortam Degiskenleri

- SMTP_SERVER
- SMTP_PORT
- SMTP_USE_TLS
- SENDER_EMAIL
- SENDER_PASSWORD
- APP_URL

## 4) SMS Altyapisi

Yeni servis: `api/services/sms_service.py`

Desteklenen ortam degiskenleri:

- SMS_ENABLED: `true|false`
- SMS_PROVIDER: varsayilan `noop`

`noop` provider canli entegrasyon yokken log tabanli guvenli calisir.

## 5) Onerilen Sonraki Adimlar

1. DNS kayitlari dogrulama: `dig txt yourdomain.com`, `dig txt _dmarc.yourdomain.com`
2. SMTP account reputation kontrolu (SPF alignment + DKIM pass)
3. SMS provider secimi (NetGSM/Twilio) ve `sms_service.py` icine provider adapter ekleme
4. E-posta bounce/complaint webhook takibi (provider bazli)
