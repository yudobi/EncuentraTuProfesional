"""
Modelo de Órdenes (Fase 2 - Contratación).

Una orden ("número de orden") se genera cuando:
  - se agenda una cita en el chat (Plan de trabajo, caso 1.1), o
  - el profesional confirma dentro de las 24h tras un contacto directo (caso 2.1.1).

El número de orden es el requisito para que el cliente pueda dejar una reseña
del servicio (Fase 3): sin orden, no hay review.
"""

import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


def generate_order_number():
    """Genera un número de orden único tipo 'LS-2A98F1'."""
    from .models import Order  # import diferido para evitar ciclo en migraciones
    for _ in range(10):
        candidate = f"LS-{uuid.uuid4().hex[:6].upper()}"
        if not Order.objects.filter(order_number=candidate).exists():
            return candidate
    # Fallback altamente improbable
    return f"LS-{uuid.uuid4().hex[:10].upper()}"


class Order(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Agendada'
        COMPLETED = 'completed', 'Completada'
        CANCELLED = 'cancelled', 'Cancelada'
        NO_SHOW = 'no_show', 'No asistió'

    class Source(models.TextChoices):
        CHAT = 'chat', 'Agendada en chat'
        DIRECT = 'direct', 'Contacto directo'

    order_number = models.CharField(max_length=20, unique=True, editable=False)

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders_as_client',
    )
    professional = models.ForeignKey(
        'accounts.ProfessionalProfile',
        on_delete=models.PROTECT,
        related_name='orders',
    )
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='orders',
    )

    service_title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    agreed_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.CHAT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.order_number} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = generate_order_number()
        if self.status == self.Status.COMPLETED and self.completed_at is None:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def is_reviewable(self):
        """Solo se puede reseñar una orden completada."""
        return self.status == self.Status.COMPLETED
