"""Serializers de órdenes."""

from rest_framework import serializers

from apps.accounts.models import ProfessionalProfile
from apps.categories.models import Category
from .models import Order


class OrderProfessionalSerializer(serializers.ModelSerializer):
    """Resumen del profesional embebido en la orden (para Order.tsx)."""

    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    title = serializers.CharField(source='headline')
    contact = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalProfile
        fields = ('id', 'name', 'title', 'contact')

    def get_id(self, obj):
        return str(obj.pk)

    def get_name(self, obj):
        return obj.user.get_full_name().strip() or obj.business_name

    def get_contact(self, obj):
        return {'whatsapp': bool(obj.whatsapp_link), 'phone': bool(obj.contact_phone)}


class OrderSerializer(serializers.ModelSerializer):
    """Salida de lectura de una orden."""

    professional = OrderProfessionalSerializer(read_only=True)
    category = serializers.CharField(source='category.name', default=None, read_only=True)
    client_name = serializers.SerializerMethodField()
    is_reviewable = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = (
            'order_number', 'client_name', 'professional', 'category',
            'service_title', 'description', 'scheduled_for', 'location',
            'agreed_price', 'status', 'source', 'is_reviewable',
            'created_at', 'completed_at',
        )

    def get_client_name(self, obj):
        return obj.client.get_full_name().strip() or obj.client.username


class OrderCreateSerializer(serializers.ModelSerializer):
    """Entrada de creación de una orden (el cliente contrata a un profesional)."""

    professional = serializers.PrimaryKeyRelatedField(
        queryset=ProfessionalProfile.objects.filter(is_approved=True),
    )
    category = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Order
        fields = (
            'professional', 'category', 'service_title', 'description',
            'scheduled_for', 'location', 'agreed_price', 'source',
        )


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Actualización de estado de la orden."""

    class Meta:
        model = Order
        fields = ('status',)
