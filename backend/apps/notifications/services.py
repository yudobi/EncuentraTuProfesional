"""
Servicio central de notificaciones.

`notify()` crea la notificación in-app y, según las preferencias del usuario,
envía email (SMTP/consola) y/o SMS (TextBee). `notify_admins()` avisa a todos
los administradores.
"""

import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from .models import Notification
from .utils.sms import send_sms

logger = logging.getLogger('apps')
User = get_user_model()


def notify(recipient, type, text, *, urgent=False, link='',
           send_email=True, send_sms_msg=False):
    """Crea una notificación y la entrega por los canales habilitados."""
    notification = Notification.objects.create(
        recipient=recipient,
        type=type,
        text=text,
        urgent=urgent,
        link=link,
    )

    if send_email and recipient.receive_email_notifications and recipient.email:
        try:
            send_mail(
                subject=f'{settings.EMAIL_SUBJECT_PREFIX}Tienes una notificación',
                message=text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient.email],
                fail_silently=True,
            )
        except Exception as exc:  # noqa: BLE001 - nunca romper el flujo por email
            logger.warning('Error enviando email a %s: %s', recipient.email, exc)

    if send_sms_msg and recipient.receive_sms_notifications and recipient.phone_number:
        send_sms(recipient.phone_number, text)

    return notification


def notify_admins(type, text, *, urgent=False):
    """Notifica a todos los administradores (in-app; email opcional)."""
    admins = User.objects.filter(role__in=[User.Role.ADMIN, User.Role.SUPER_ADMIN])
    created = []
    for admin in admins:
        created.append(notify(admin, type, text, urgent=urgent, send_email=False))
    return created
