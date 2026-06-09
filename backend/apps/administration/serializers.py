"""Serializers para el panel de administración."""

from django.utils import timezone
from rest_framework import serializers

from apps.accounts.models import ProfessionalProfile
from apps.reviews.models import Review


class AdminProfessionalSerializer(serializers.ModelSerializer):
    """Profesional en la cola de validación del admin."""

    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email')
    category = serializers.SerializerMethodField()
    submitted_at = serializers.DateTimeField(source='user.created_at', read_only=True)

    class Meta:
        model = ProfessionalProfile
        fields = ('id', 'name', 'business_name', 'email', 'category',
                  'approval_status', 'approval_notes', 'is_approved', 'submitted_at')

    def get_id(self, obj):
        return str(obj.pk)

    def get_name(self, obj):
        return obj.user.get_full_name().strip() or obj.business_name

    def get_category(self, obj):
        first = obj.categories.first()
        return first.name if first else None


class AdminReviewSerializer(serializers.ModelSerializer):
    """Reseña en el panel de moderación (incluye flagged)."""

    id = serializers.SerializerMethodField()
    proId = serializers.SerializerMethodField()
    professional_name = serializers.SerializerMethodField()
    orderId = serializers.CharField(source='order.order_number')
    user = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    daysAgo = serializers.SerializerMethodField()
    proReply = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'proId', 'professional_name', 'orderId', 'user',
                  'initials', 'rating', 'daysAgo', 'text', 'proReply', 'flagged')

    def _client_name(self, obj):
        return obj.client.get_full_name().strip() or obj.client.username

    def get_id(self, obj):
        return str(obj.pk)

    def get_proId(self, obj):
        return str(obj.professional_id)

    def get_professional_name(self, obj):
        return obj.professional.user.get_full_name().strip() or obj.professional.business_name

    def get_user(self, obj):
        return self._client_name(obj)

    def get_initials(self, obj):
        parts = [p for p in self._client_name(obj).split() if p]
        if not parts:
            return '?'
        if len(parts) == 1:
            return parts[0][:2].upper()
        return (parts[0][0] + parts[-1][0]).upper()

    def get_daysAgo(self, obj):
        return (timezone.now() - obj.created_at).days

    def get_proReply(self, obj):
        return obj.pro_reply or None


class ModerationNotesSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True, max_length=500)
