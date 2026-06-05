"""Cliente SMS via TextBee (self-hosted).

En desarrollo (clave mock) se omite el envío real y solo se registra en logs,
para no depender de un gateway durante pruebas.
"""

import logging

import requests
from django.conf import settings

logger = logging.getLogger('apps')


def _is_configured() -> bool:
    url = getattr(settings, 'TEXTBEE_API_URL', None)
    key = getattr(settings, 'TEXTBEE_API_KEY', None)
    if not url or not key:
        return False
    # Evita intentos de red con credenciales de desarrollo/mock.
    if 'mock' in key.lower() or 'dev' in key.lower():
        return False
    return True


def send_sms(phone_number: str, message: str) -> bool:
    """Envía un SMS. Devuelve True si se entregó al gateway."""
    if not phone_number:
        return False
    if not _is_configured():
        logger.info('[SMS mock] -> %s: %s', phone_number, message)
        return False
    try:
        resp = requests.post(
            f"{settings.TEXTBEE_API_URL.rstrip('/')}/send-sms",
            json={'recipients': [phone_number], 'message': message},
            headers={'x-api-key': settings.TEXTBEE_API_KEY},
            timeout=5,
        )
        resp.raise_for_status()
        return True
    except requests.RequestException as exc:
        logger.warning('Error enviando SMS a %s: %s', phone_number, exc)
        return False
