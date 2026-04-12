import os
import smtplib
import re
import html
from typing import Union
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Email servisi - Magic link ve bildirimler için kullanılır"""

    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL", "noreply@procureflow.local")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        self.use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
        self.app_url = os.getenv("APP_URL", "http://localhost:5177")

    def _get_magic_link(self, token: str) -> str:
        """Magic link URL'ini oluştur"""
        return f"{self.app_url}/supplier/register?token={token}"

    def _html_to_plain_text(self, html_content: str) -> str:
        """HTML içeriği temel seviyede düz metne dönüştür."""
        if not html_content:
            return ""
        text = re.sub(r"<br\s*/?>", "\n", html_content, flags=re.IGNORECASE)
        text = re.sub(r"</p>|</div>|</li>|</h[1-6]>", "\n", text, flags=re.IGNORECASE)
        text = re.sub(r"<[^>]+>", "", text)
        text = html.unescape(text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def _normalize_subject(self, subject: str) -> str:
        """Konu satırını güvenli ve tutarlı bir formata getir."""
        clean = " ".join((subject or "").split())
        if not clean:
            clean = "Bilgilendirme"
        if not clean.startswith("[ProcureFlow]"):
            clean = f"[ProcureFlow] {clean}"
        return clean

    def _send_smtp(
        self, to_email: str, subject: str, html_content: str, plain_text: str = ""
    ) -> bool:
        """SMTP üzerinden email gönder (plain_text + HTML multipart)"""
        # Email credentials kontrol et
        if not self.sender_email or not self.sender_password:
            logger.error(
                f"[EMAIL] SMTP credentials eksik! SENDER_EMAIL={self.sender_email}, PASSWORD={'*' * 5 if self.sender_password else 'EMPTY'}"
            )
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = self._normalize_subject(subject)
            msg["From"] = f"ProcureFlow <{self.sender_email}>"
            msg["To"] = to_email
            msg["Reply-To"] = self.sender_email
            msg["Return-Path"] = self.sender_email
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain=self.sender_email.split("@")[-1])
            msg["Content-Language"] = "tr-TR"
            msg["X-Mailer"] = "ProcureFlow"

            # Plain text versiyonu (spam filtreler text'i tercih eder)
            final_plain_text = (plain_text or "").strip() or self._html_to_plain_text(
                html_content
            )
            if final_plain_text:
                part_text = MIMEText(final_plain_text, "plain", "utf-8")
                msg.attach(part_text)

            # HTML versiyonu (alternatif)
            part_html = MIMEText(html_content, "html", "utf-8")
            msg.attach(part_html)

            logger.info(f"[EMAIL] Bağlanılıyor: {self.smtp_server}:{self.smtp_port}")

            # SMTP bağlantısı - Port 465 için SMTP_SSL, Port 587 için SMTP + STARTTLS
            server: Union[smtplib.SMTP, smtplib.SMTP_SSL]
            if self.smtp_port == 465:
                # Port 465: Direct SSL connection
                server = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port, timeout=10)
                server.set_debuglevel(0)
                logger.info(f"[EMAIL] Using SMTP_SSL (port 465)")
            else:
                # Port 587 veya diğer: STARTTLS ile upgrade
                server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=10)
                server.set_debuglevel(0)
                if self.use_tls:
                    server.starttls()
                    logger.info(f"[EMAIL] Using STARTTLS (port {self.smtp_port})")

            # Gönder
            logger.info(f"[EMAIL] Login: {self.sender_email}")
            server.login(self.sender_email, self.sender_password)
            logger.info(f"[EMAIL] ✓ Logged in successfully")
            logger.info(f"[EMAIL] Sending message to {to_email}")
            send_result = server.send_message(msg)
            if send_result:
                logger.error(f"[EMAIL] ❌ Recipient refusal details: {send_result}")
                server.quit()
                return False
            logger.info(f"[EMAIL] ✓ Message accepted by SMTP server")
            server.quit()
            logger.info(f"[EMAIL] ✓ Connection closed")

            logger.info(
                f"[EMAIL] ✅ Email SMTP sunucusu tarafından kabul edildi: {to_email}"
            )
            return True

        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"[EMAIL] ❌ Kimlik doğrulama hatası: {str(e)}")
            logger.error(
                f"[EMAIL] SENDER_EMAIL={self.sender_email}, PWD={(self.sender_password[:3] + '***') if self.sender_password else 'EMPTY'}"
            )
            print(f"[EMAIL] ❌ Authentication error: {str(e)}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"[EMAIL] ❌ SMTP hatası: {str(e)}")
            print(f"[EMAIL] ❌ SMTP error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"[EMAIL] ❌ Email gönderme hatası ({to_email}): {str(e)}")
            import traceback

            logger.error(f"[EMAIL] Traceback:\n{traceback.format_exc()}")
            print(f"[EMAIL] ❌ Error sending email: {str(e)}")
            print(f"[EMAIL] Traceback: {traceback.format_exc()}")
            return False

    def send_magic_link(
        self,
        to_email: str,
        supplier_name: str,
        supplier_user_name: str,
        magic_token: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Tedarikçi kayıt için magic link gönder"""

        magic_link = self._get_magic_link(magic_token)
        login_url = f"{self.app_url}/supplier/login"

        # HTML template
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Hoş Geldiniz, {supplier_user_name}!</h2>
                    
                    <p>Merhaba,</p>
                    
                    <p>{company_name} tarafından <strong>{supplier_name}</strong> şirketimize tedarikçi olarak davet edildiniz.</p>
                    
                    <p>Kaydı tamamlamak için aşağıdaki bağlantıya tıklayın:</p>
                    
                    <p style="margin: 30px 0;">
                        <a href="{magic_link}" 
                           style="display: inline-block; padding: 12px 30px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Kaydı Tamamla
                        </a>
                    </p>
                    
                    <p style="color: #7f8c8d; font-size: 12px;">
                        Veya bu bağlantıyı tarayıcınıza kopyalayın:<br>
                        <code>{magic_link}</code>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
                    
                    <div style="background-color: #f0f7ff; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c3e50;">ℹ️ Sonraki Adımlar</h3>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li>Yukarıdaki linke tıklayarak kayıt sayfasına girin</li>
                            <li>Bir şifre belirleyin (en az 8 karakter)</li>
                            <li>Kayıt tamamlandıktan sonra <strong>Giriş Sayfasına</strong> gideceksiniz</li>
                            <li>E-mail ve şifrenizle sistemde giriş yapın</li>
                        </ol>
                    </div>
                    
                    <p style="margin: 20px 0;">
                        <strong>Giriş Sayfası:</strong> <a href="{login_url}" style="color: #3498db; text-decoration: none;">{login_url}</a>
                    </p>
                    
                    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
                        Bu bağlantı 24 saat boyunca geçerlidir.<br>
                        Eğer bu daveti almadıysanız, bu emaili görmezden gelebilirsiniz.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                    
                    <p style="color: #95a5a6; font-size: 12px; text-align: center;">
                        {company_name} - Tedarik Zinciri Yönetim Sistemi<br>
                        {datetime.now().strftime('%d.%m.%Y %H:%M')}
                    </p>
                </div>
            </body>
        </html>
        """

        # Plain text version
        plain_text = f"""ProcureFlow Tedarikçi Kaydı

Hoş Geldiniz, {supplier_user_name}!

Merhaba,

{company_name} tarafından {supplier_name} şirketimize tedarikçi olarak davet edildiniz.

Kaydı tamamlamak için aşağıdaki bağlantıya tıklayın:
{magic_link}

Veya bu bağlantıyı tarayıcınıza kopyalayın:
{magic_link}

Sonraki Adımlar:
1. Yukarıdaki linke tıklayarak kayıt sayfasına girin
2. Bir şifre belirleyin (en az 8 karakter)
3. Kayıt tamamlandıktan sonra Giriş Sayfasına gideceksiniz
4. E-mail ve şifrenizle sistemde giriş yapın

Giriş Sayfası: {login_url}

Bu bağlantı 24 saat boyunca geçerlidir.
Eğer bu daveti almadıysanız, bu emaili görmezden gelebilirsiniz.

{company_name} - Tedarik Zinciri Yönetim Sistemi
{datetime.now().strftime('%d.%m.%Y %H:%M')}
"""

        subject = f"{supplier_name} - ProcureFlow Tedarikçi Kaydı"
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_quote_notification(
        self,
        to_email: str,
        supplier_name: str,
        quote_title: str,
        deadline: str,
        quote_url: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Yeni teklif bildirimi gönder"""

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Yeni Teklif Bulunmaktadır</h2>
                    
                    <p>Merhaba,</p>
                    
                    <p><strong>{supplier_name}</strong> şirketimiz için yeni bir teklif alındığını bildirmek istiyoruz.</p>
                    
                    <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Teklif Başlığı:</strong> {quote_title}</p>
                        <p><strong>Son Tarih:</strong> {deadline}</p>
                    </div>
                    
                    <p style="margin: 30px 0;">
                        <a href="{quote_url}" 
                           style="display: inline-block; padding: 12px 30px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Teklifi Görüntüle
                        </a>
                    </p>
                    
                    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
                        Lütfen son tarihinden önce teklif yöneticimize yanıt verin.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                    
                    <p style="color: #95a5a6; font-size: 12px; text-align: center;">
                        {company_name} - Tedarik Zinciri Yönetim Sistemi<br>
                        {datetime.now().strftime('%d.%m.%Y %H:%M')}
                    </p>
                </div>
            </body>
        </html>
        """

        # Plain text version
        plain_text = f"""ProcureFlow - Yeni Teklif

Yeni Teklif Bulunmaktadır

Merhaba,

{supplier_name} şirketimiz için yeni bir teklif alındığını bildirmek istiyoruz.

Teklif Başlığı: {quote_title}
Son Tarih: {deadline}

Teklifi Görüntüle: {quote_url}

Lütfen son tarihinden önce teklif yöneticimize yanıt verin.

{company_name} - Tedarik Zinciri Yönetim Sistemi
{datetime.now().strftime('%d.%m.%Y %H:%M')}
"""

        subject = f"Yeni Teklif - {quote_title}"
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_supplier_email_change_magic_link(
        self,
        to_email: str,
        supplier_name: str,
        supplier_user_name: str,
        token: str,
    ) -> bool:
        """Tedarikçi kullanıcı e-posta değişim doğrulama maili gönder."""
        confirm_url = f"{self.app_url}/supplier/email-change/confirm?token={token}"
        html_content = f"""
        <html>
            <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;\">
                <div style=\"max-width: 620px; margin: 0 auto; padding: 22px;\">
                    <h2 style=\"color: #0f172a;\">E-posta Değişiklik Onayı</h2>
                    <p>Merhaba {supplier_user_name},</p>
                    <p><strong>{supplier_name}</strong> hesabınız için e-posta değişiklik talebi alındı.</p>
                    <p>Yeni e-posta adresinizi onaylamak için aşağıdaki butona tıklayın:</p>
                    <p style=\"margin: 26px 0;\">
                        <a href=\"{confirm_url}\" style=\"display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;\">E-posta Adresimi Onayla</a>
                    </p>
                    <p style=\"font-size:12px;color:#64748b;\">Bağlantı 24 saat geçerlidir. Eğer talep size ait değilse bu e-postayı dikkate almayın.</p>
                </div>
            </body>
        </html>
        """
        plain_text = (
            f"Merhaba {supplier_user_name},\n\n"
            f"{supplier_name} hesabı için e-posta değişiklik onayı gerekiyor.\n"
            f"Onay bağlantısı: {confirm_url}\n\n"
            "Bağlantı 24 saat geçerlidir."
        )
        subject = "ProcureFlow - Güvenli E-posta Onayı"
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_supplier_email_change_verification(
        self,
        to_email: str,
        supplier_name: str,
        supplier_user_name: str,
        token: str,
    ) -> bool:
        """Geriye dönük uyumluluk için eski metot adı."""
        return self.send_supplier_email_change_magic_link(
            to_email=to_email,
            supplier_name=supplier_name,
            supplier_user_name=supplier_user_name,
            token=token,
        )

    def send_approval_request(
        self,
        to_email: str,
        approver_name: str,
        quote_title: str,
        total_amount: float,
        approval_level: str,
        approval_url: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Onay isteği gönder (Manager/Director için)"""

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Onay İsteği</h2>
                    
                    <p>Merhaba {approver_name},</p>
                    
                    <p>Sizden aşağıdaki teklif için onay istenmektedir:</p>
                    
                    <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Teklif Başlığı:</strong> {quote_title}</p>
                        <p><strong>Toplam Tutar:</strong> ₺{total_amount:,.2f}</p>
                        <p><strong>Onay Seviyesi:</strong> {approval_level}</p>
                    </div>
                    
                    <p style="margin: 30px 0;">
                        <a href="{approval_url}" 
                           style="display: inline-block; padding: 12px 30px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Onay Sayfasına Git
                        </a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                    
                    <p style="color: #95a5a6; font-size: 12px; text-align: center;">
                        {company_name} - Tedarik Zinciri Yönetim Sistemi<br>
                        {datetime.now().strftime('%d.%m.%Y %H:%M')}
                    </p>
                </div>
            </body>
        </html>
        """

        # Plain text version
        plain_text = f"""ProcureFlow - Onay İsteği

Onay İsteği

Merhaba {approver_name},

Sizden aşağıdaki teklif için onay istenmektedir:

Teklif Başlığı: {quote_title}
Toplam Tutar: ₺{total_amount:,.2f}
Onay Seviyesi: {approval_level}

Onay Sayfasına Git: {approval_url}

{company_name} - Tedarik Zinciri Yönetim Sistemi
{datetime.now().strftime('%d.%m.%Y %H:%M')}
"""

        subject = f"Onay İsteği - {quote_title}"
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_project_invitation(
        self,
        to_email: str,
        supplier_name: str,
        project_name: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Projeye tedarikçi davet mailini gönder"""

        html_content = f"""<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yeni Proje Teklifi</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .content {{ background: #f9f9f9; padding: 20px; border-radius: 5px; }}
        .button {{ display: inline-block; padding: 12px 30px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
        .footer {{ text-align: center; color: #95a5a6; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="color: #2c3e50;">📧 Yeni Proje Teklifi Bekleniyor</h2>
        </div>
        
        <div class="content">
            <p>Merhaba <strong>{supplier_name}</strong>,</p>
            
            <p>{company_name} tarafından yeni bir proje için teklif istenmektedir.</p>
            
            <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; border-radius: 3px;">
                <p style="margin: 5px 0;"><strong>📌 Proje Adı:</strong> {project_name}</p>
                <p style="margin: 5px 0;"><strong>🏢 Firma:</strong> {company_name}</p>
            </div>
            
            <p>Lütfen sisteme giriş yaparak ilgili projenin ayrıntılarını görüntüleyin ve teklifinizi gönderiniz.</p>
            
            <div style="text-align: center;">
                <a href="{self.app_url}/supplier/dashboard" class="button">
                    Paneli Aç
                </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 12px;">
                <strong>Bağlantı:</strong> {self.app_url}/supplier/dashboard
            </p>
        </div>
        
        <div class="footer">
            <p>{company_name} - Tedarik Zinciri Yönetim Sistemi<br>
            {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
            <p style="margin-top: 10px; font-size: 11px;">
                <a href="{self.app_url}/unsubscribe?email={to_email}" style="color: #95a5a6; text-decoration: none;">Abonelikten Çık</a> | 
                <a href="mailto:{self.sender_email}" style="color: #95a5a6; text-decoration: none;">Destek</a>
            </p>
        </div>
    </div>
</body>
</html>"""

        # Plain text version (spam filtering için)
        text_content = f"""
Yeni Proje Teklifi Bekleniyor

Merhaba {supplier_name},

{company_name} tarafından yeni bir proje için teklif istenmektedir.

Proje Adı: {project_name}
Firma: {company_name}

Lütfen sisteme giriş yaparak ilgili projenin ayrıntılarını görüntüleyin ve teklifinizi gönderiniz.

Paneli açmak için: {self.app_url}/supplier/dashboard

{company_name} - Tedarik Zinciri Yönetim Sistemi
{datetime.now().strftime('%d.%m.%Y %H:%M')}
        """

        subject = f"📧 Yeni Proje: {project_name}"
        return self._send_smtp(to_email, subject, html_content, text_content)

    def send_new_quote_to_supplier(
        self,
        to_email: str,
        supplier_name: str,
        quote_title: str,
        deadline_days: int,
        workspace_url: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Tedarikçiye yeni teklif isteği gönderildi bildirimi"""
        deadline_str = f"{deadline_days} gün içinde"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
                    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="color: white; margin: 0; font-size: 20px;">📋 Yeni Teklif Talebi</h2>
                    </div>
                    <div style="background: #f8faff; border: 1px solid #dbeafe; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
                        <p>Merhaba <strong>{supplier_name}</strong>,</p>
                        <p><strong>{company_name}</strong> tarafından size yeni bir teklif talebi iletilmiştir.</p>
                        <div style="background: white; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 20px 0;">
                            <p style="margin: 4px 0;"><strong>📌 Teklif:</strong> {quote_title}</p>
                            <p style="margin: 4px 0;"><strong>⏰ Son Tarih:</strong> {deadline_str}</p>
                        </div>
                        <p>Teklifinizi hazırlamak ve göndermek için aşağıdaki butona tıklayın:</p>
                        <div style="text-align: center; margin: 28px 0;">
                            <a href="{workspace_url}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                                Teklifimi Hazırla
                            </a>
                        </div>
                        <p style="font-size: 12px; color: #6b7280;">Butona tıklanamıyorsa şu adresi kullanın: <a href="{workspace_url}" style="color: #3b82f6;">{workspace_url}</a></p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">{company_name} - Tedarik Zinciri Yönetim Sistemi · {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
                    </div>
                </div>
            </body>
        </html>
        """
        plain_text = (
            f"Yeni Teklif Talebi\n\n"
            f"Merhaba {supplier_name},\n\n"
            f"{company_name} tarafından size yeni bir teklif talebi iletilmiştir.\n\n"
            f"Teklif: {quote_title}\n"
            f"Son Tarih: {deadline_str}\n\n"
            f"Teklifinizi hazırlamak için: {workspace_url}\n\n"
            f"{company_name} - {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        )
        subject = f"[ProcureFlow] Yeni Teklif Talebi: {quote_title}"
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_revision_request_to_supplier(
        self,
        to_email: str,
        supplier_name: str,
        quote_title: str,
        reason: str,
        revision_number: int,
        workspace_url: str,
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Tedarikçiye revize talebi gönderildi bildirimi"""
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
                    <div style="background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="color: white; margin: 0; font-size: 20px;">🔄 Revize Talebi — {revision_number}. Revize</h2>
                    </div>
                    <div style="background: #fffbeb; border: 1px solid #fde68a; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
                        <p>Merhaba <strong>{supplier_name}</strong>,</p>
                        <p><strong>{company_name}</strong>, aşağıdaki teklifiniz için revize talep etmektedir.</p>
                        <div style="background: white; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 20px 0;">
                            <p style="margin: 4px 0;"><strong>📌 Teklif:</strong> {quote_title}</p>
                            <p style="margin: 4px 0;"><strong>🔁 Revize No:</strong> {revision_number}. Revize</p>
                            <p style="margin: 8px 0 4px 0;"><strong>💬 Revize Nedeni:</strong></p>
                            <p style="margin: 4px 0; background: #fef3c7; padding: 10px; border-radius: 4px; font-style: italic;">"{reason}"</p>
                        </div>
                        <p>Yeni fiyatlarınızı girmek için lütfen sisteme giriş yapın:</p>
                        <div style="text-align: center; margin: 28px 0;">
                            <a href="{workspace_url}" style="display: inline-block; padding: 14px 32px; background-color: #d97706; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                                Revize Teklifimi Gönder
                            </a>
                        </div>
                        <p style="font-size: 12px; color: #6b7280;">Butona tıklanamıyorsa: <a href="{workspace_url}" style="color: #d97706;">{workspace_url}</a></p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">{company_name} - Tedarik Zinciri Yönetim Sistemi · {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
                    </div>
                </div>
            </body>
        </html>
        """
        plain_text = (
            f"{revision_number}. Revize Talebi\n\n"
            f"Merhaba {supplier_name},\n\n"
            f"{company_name}, teklifiniz için revize talep etmektedir.\n\n"
            f"Teklif: {quote_title}\n"
            f"Revize No: {revision_number}\n"
            f"Revize Nedeni: {reason}\n\n"
            f"Revize teklifinizi göndermek için: {workspace_url}\n\n"
            f"{company_name} - {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        )
        subject = (
            f"[ProcureFlow] Revize Talebi ({revision_number}. Revize): {quote_title}"
        )
        return self._send_smtp(to_email, subject, html_content, plain_text)

    def send_supplier_response_to_admin(
        self,
        to_email: str,
        admin_name: str,
        supplier_company: str,
        quote_title: str,
        final_amount: float,
        revision_number: int,
        discount_percent: float = 0,
        discount_amount: float = 0,
        delivery_time: int | None = None,
        payment_terms: str | None = None,
        warranty: str | None = None,
        workspace_url: str = "",
        company_name: str = "ProcureFlow",
    ) -> bool:
        """Satın alma sorumlusuna tedarikçi yanıtı bildirimi (ilk teklif veya revize)"""
        is_revision = revision_number > 0
        revision_label = (
            f"{revision_number}. Revize Teklif" if is_revision else "İlk Teklif"
        )
        icon = "🔄" if is_revision else "📬"
        header_color = "#b45309" if is_revision else "#065f46"
        header_color2 = "#f59e0b" if is_revision else "#10b981"
        border_color = "#f59e0b" if is_revision else "#10b981"
        bg_color = "#fffbeb" if is_revision else "#f0fdf4"

        discount_html = ""
        if discount_percent > 0:
            discount_html = f"<p style='margin:4px 0;'><strong>🏷️ İndirim:</strong> %{discount_percent:.1f} (₺{discount_amount:,.2f})</p>"

        delivery_html = (
            f"<p style='margin:4px 0;'><strong>🚚 Teslimat:</strong> {delivery_time} gün</p>"
            if delivery_time
            else ""
        )
        payment_html = (
            f"<p style='margin:4px 0;'><strong>💳 Ödeme:</strong> {payment_terms}</p>"
            if payment_terms
            else ""
        )
        warranty_html = (
            f"<p style='margin:4px 0;'><strong>🛡️ Garanti:</strong> {warranty}</p>"
            if warranty
            else ""
        )

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
                    <div style="background: linear-gradient(135deg, {header_color} 0%, {header_color2} 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="color: white; margin: 0; font-size: 20px;">{icon} Teklif Yanıtı Alındı — {revision_label}</h2>
                    </div>
                    <div style="background: {bg_color}; border: 1px solid {border_color}; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
                        <p>Merhaba <strong>{admin_name}</strong>,</p>
                        <p><strong>{supplier_company}</strong> şirketi, <em>{quote_title}</em> için <strong>{revision_label}</strong> göndermiştir.</p>
                        <div style="background: white; border-left: 4px solid {border_color}; padding: 16px; border-radius: 4px; margin: 20px 0;">
                            <p style="margin: 4px 0;"><strong>🏢 Tedarikçi:</strong> {supplier_company}</p>
                            <p style="margin: 4px 0;"><strong>📌 Teklif:</strong> {quote_title}</p>
                            <p style="margin: 4px 0;"><strong>💰 Toplam Tutar:</strong> <span style="font-size: 16px; font-weight: bold; color: #1f2937;">₺{final_amount:,.2f}</span></p>
                            {discount_html}{delivery_html}{payment_html}{warranty_html}
                        </div>
                        {"<p>Sisteme giriş yaparak teklifleri karşılaştırabilirsiniz.</p>" if workspace_url else ""}
                        {f'<div style="text-align:center;margin:20px 0;"><a href="{workspace_url}" style="display:inline-block;padding:12px 28px;background:{header_color2};color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Teklifi İncele</a></div>' if workspace_url else ""}
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">{company_name} · {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
                    </div>
                </div>
            </body>
        </html>
        """
        plain_text = (
            f"{icon} Teklif Yanıtı — {revision_label}\n\n"
            f"Merhaba {admin_name},\n\n"
            f"{supplier_company} şirketi, {quote_title} için {revision_label} gönderdi.\n\n"
            f"Toplam Tutar: ₺{final_amount:,.2f}\n"
            + (
                f"İndirim: %{discount_percent:.1f} (₺{discount_amount:,.2f})\n"
                if discount_percent > 0
                else ""
            )
            + (f"Teslimat: {delivery_time} gün\n" if delivery_time else "")
            + (f"Ödeme: {payment_terms}\n" if payment_terms else "")
            + f"\n{company_name} · {datetime.now().strftime('%d.%m.%Y %H:%M')}"
        )
        subject = (
            f"[ProcureFlow] {icon} {supplier_company} — {revision_label}: {quote_title}"
        )
        return self._send_smtp(to_email, subject, html_content, plain_text)


# Singleton instance
email_service = EmailService()


def get_email_service() -> EmailService:
    """Email servisi dependency'si"""
    return email_service
