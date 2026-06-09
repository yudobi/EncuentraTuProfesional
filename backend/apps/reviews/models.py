"""
Modelos de reseñas (Fase 3).

Reglas de negocio (Plan de trabajo):
- 1 reseña de servicio POR ORDEN, y la orden debe estar COMPLETADA.
- 1 reseña de la plataforma por usuario registrado.
- El profesional puede responder su reseña.
- El admin puede marcar reseñas indebidas (flagged) para moderación.
"""

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Avg, Count


def recalc_professional_rating(professional):
    """Recalcula rating_avg y total_reviews con las reseñas NO marcadas."""
    agg = professional.reviews.filter(flagged=False).aggregate(
        avg=Avg('rating'), n=Count('id'),
    )
    professional.rating_avg = round(agg['avg'] or 0, 2)
    professional.total_reviews = agg['n'] or 0
    professional.save(update_fields=['rating_avg', 'total_reviews'])


class Review(models.Model):
    """Reseña de un servicio, atada a una orden completada."""

    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='review',
    )
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_written',
    )
    professional = models.ForeignKey(
        'accounts.ProfessionalProfile',
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    text = models.TextField(blank=True)
    pro_reply = models.TextField(blank=True)
    flagged = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['professional', 'flagged']),
        ]

    def __str__(self):
        return f"Review {self.rating}★ orden {self.order.order_number}"


class PlatformReview(models.Model):
    """Reseña sobre la plataforma (1 por usuario registrado)."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='platform_review',
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    text = models.TextField(blank=True)
    flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'platform_reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"PlatformReview {self.rating}★ de {self.user.email}"
