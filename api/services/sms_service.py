import logging
import os
from dataclasses import dataclass
from urllib import parse, request
import base64

logger = logging.getLogger(__name__)


@dataclass
class SMSService:
    provider: str
    enabled: bool

    def _send_twilio(self, to_phone: str, message: str) -> bool:
        account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
        auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
        from_phone = os.getenv("TWILIO_FROM_PHONE", "").strip()
        if not account_sid or not auth_token or not from_phone:
            logger.error("[SMS:TWILIO] Missing credentials or from phone")
            return False

        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
        payload = parse.urlencode(
            {
                "To": to_phone,
                "From": from_phone,
                "Body": message,
            }
        ).encode("utf-8")

        basic = base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode(
            "ascii"
        )
        req = request.Request(
            url=url,
            data=payload,
            method="POST",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {basic}",
            },
        )
        try:
            with request.urlopen(req, timeout=10) as resp:
                ok = 200 <= resp.status < 300
                if not ok:
                    logger.error("[SMS:TWILIO] Request failed status=%s", resp.status)
                return ok
        except Exception as exc:
            logger.error("[SMS:TWILIO] Exception: %s", exc)
            return False

    def _send_netgsm(self, to_phone: str, message: str) -> bool:
        username = os.getenv("NETGSM_USERNAME", "").strip()
        password = os.getenv("NETGSM_PASSWORD", "").strip()
        header = os.getenv("NETGSM_HEADER", "").strip()
        if not username or not password or not header:
            logger.error("[SMS:NETGSM] Missing credentials/header")
            return False

        payload = parse.urlencode(
            {
                "usercode": username,
                "password": password,
                "gsmno": to_phone,
                "message": message,
                "msgheader": header,
                "dil": "TR",
            }
        )
        url = f"https://api.netgsm.com.tr/sms/send/get/?{payload}"
        req = request.Request(url=url, method="GET")
        try:
            with request.urlopen(req, timeout=10) as resp:
                body = resp.read().decode("utf-8", errors="ignore").strip()
                # NetGSM 00... ile başlayan başarılı kodlar döner.
                if body.startswith("00"):
                    return True
                logger.error("[SMS:NETGSM] failed response=%s", body)
                return False
        except Exception as exc:
            logger.error("[SMS:NETGSM] Exception: %s", exc)
            return False

    def send_sms(self, to_phone: str, message: str) -> bool:
        """Provider bağımsız SMS gönderim yüzeyi.

        Bu sürüm altyapı hazırlığı için güvenli no-op içerir.
        `SMS_ENABLED=true` ve desteklenen bir provider tanımlanana kadar mesaj sadece loglanır.
        """
        phone = str(to_phone or "").strip()
        text = str(message or "").strip()
        if not phone or not text:
            return False

        if not self.enabled:
            logger.info(
                "[SMS:NOOP] disabled provider=%s to=%s msg=%s",
                self.provider,
                phone,
                text,
            )
            return True

        provider = (self.provider or "noop").lower()
        if provider == "noop":
            logger.info("[SMS:NOOP] to=%s msg=%s", phone, text)
            return True

        if provider == "twilio":
            return self._send_twilio(phone, text)

        if provider == "netgsm":
            return self._send_netgsm(phone, text)

        logger.warning("[SMS] Unknown provider '%s', message is skipped", provider)
        return False


def get_sms_service() -> SMSService:
    provider = os.getenv("SMS_PROVIDER", "noop")
    enabled = os.getenv("SMS_ENABLED", "false").lower() == "true"
    return SMSService(provider=provider, enabled=enabled)
