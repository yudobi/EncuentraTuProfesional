"""Modelo de notificaciones (Fase 2)."""

from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        SIGNUP = 'signup', 'Registro de profesional'
        EDIT = 'edit', 'Edición de perfil'
        FLAG = 'flag', 'Reseña reportada'
        CHAT = 'chat', 'Mensaje de chat'
        ORDER = 'order', 'Orden'
        APPROVAL = 'approval', 'Aprobación'
        REVIEW = 'review', 'Reseña'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.ORDER)
    text = models.TextField()
    link = models.CharField(max_length=255, blank=True)
    urgent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f"[{self.type}] {self.text[:40]}"
