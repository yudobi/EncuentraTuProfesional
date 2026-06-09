"""
Serializers de profesionales.

`ProfessionalCardSerializer` mapea el modelo `ProfessionalProfile`
(apps.accounts.models) al contrato `Professional` que ya consume el frontend
(client/src/types/index.ts). Se usa el MISMO shape para lista y detalle.

`ProfessionalWriteSerializer` se usa para que un profesional cree/edite su
propio perfil; cualquier cambio deja el perfil en estado `pending`.
"""

from rest_framework import serializers

from apps.accounts.models import ProfessionalProfile
from apps.categories.models import Category


def _initials(name: str) -> str:
    parts = [p for p in (name or '').split() if p]
    if not parts:
        return '?'
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


class ProfessionalCardSerializer(serializers.ModelSerializer):
    """Salida pública: encaja con `interface Professional` del frontend."""

    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    title = serializers.CharField(source='headline')
    category = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviewCount = serializers.IntegerField(source='total_reviews')
    jobsDone = serializers.IntegerField(source='total_services_completed')
    responseMin = serializers.SerializerMethodField()
    distanceKm = serializers.SerializerMethodField()
    verified = serializers.SerializerMethodField()
    pro = serializers.BooleanField(source='is_top_pro')
    priceFrom = serializers.SerializerMethodField()
    badges = serializers.SerializerMethodField()
    bio = serializers.CharField(source='description')
    contact = serializers.SerializerMethodField()
    pendingEdits = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalProfile
        fields = (
            'id', 'initials', 'name', 'handle', 'category', 'categories',
            'title', 'location', 'distanceKm', 'rating', 'reviewCount',
            'jobsDone', 'responseMin', 'verified', 'pro', 'priceFrom',
            'badges', 'bio', 'skills', 'gallery', 'contact', 'schedule',
            'pendingEdits',
        )

    def get_id(self, obj):
        return str(obj.pk)

    def get_name(self, obj):
        full = obj.user.get_full_name().strip()
        return full or obj.business_name

    def get_initials(self, obj):
        return _initials(self.get_name(obj))

    def get_category(self, obj):
        first = obj.categories.first()
        return first.slug if first else None

    def get_categories(self, obj):
        return [c.slug for c in obj.categories.all()]

    def get_rating(self, obj):
        return float(obj.rating_avg or 0)

    def get_responseMin(self, obj):
        return obj.response_time_min or 0

    def get_distanceKm(self, obj):
        # Geolocalización aún no implementada (Fase futura). Placeholder 0.
        return 0

    def get_verified(self, obj):
        return bool(obj.user.is_verified)

    def get_priceFrom(self, obj):
        return float(obj.price_from) if obj.price_from is not None else 0

    def get_badges(self, obj):
        badges = []
        if obj.user.is_verified:
            badges.append('Verificado')
        if obj.is_top_pro:
            badges.append('Top Pro')
        return badges

    def get_contact(self, obj):
        return {
            'whatsapp': bool(obj.whatsapp_link),
            'phone': bool(obj.contact_phone),
        }

    def get_pendingEdits(self, obj):
        return obj.approval_status == 'changes_requested'


class ProfessionalWriteSerializer(serializers.ModelSerializer):
    """Entrada para crear/editar el perfil propio del profesional."""

    categories = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Category.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = ProfessionalProfile
        fields = (
            'business_name', 'description', 'headline', 'location', 'handle',
            'years_experience', 'price_from', 'response_time_min',
            'contact_phone', 'contact_email_public', 'whatsapp_link',
            'categories', 'skills', 'schedule', 'gallery',
        )

    def validate_business_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                'El nombre del negocio debe tener al menos 3 caracteres.'
            )
        return value
