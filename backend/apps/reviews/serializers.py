"""Serializers de reseñas."""

from django.utils import timezone
from rest_framework import serializers

from apps.orders.models import Order
from .models import Review, PlatformReview


def _initials(name: str) -> str:
    parts = [p for p in (name or '').split() if p]
    if not parts:
        return '?'
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


class ReviewSerializer(serializers.ModelSerializer):
    """Salida pública: encaja con `interface Review` del frontend."""

    id = serializers.SerializerMethodField()
    proId = serializers.SerializerMethodField()
    orderId = serializers.CharField(source='order.order_number')
    user = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    daysAgo = serializers.SerializerMethodField()
    proReply = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'proId', 'orderId', 'user', 'initials', 'rating',
                  'daysAgo', 'text', 'proReply', 'flagged')

    def get_id(self, obj):
        return str(obj.pk)

    def get_proId(self, obj):
        return str(obj.professional_id)

    def _client_name(self, obj):
        return obj.client.get_full_name().strip() or obj.client.username

    def get_user(self, obj):
        return self._client_name(obj)

    def get_initials(self, obj):
        return _initials(self._client_name(obj))

    def get_daysAgo(self, obj):
        return (timezone.now() - obj.created_at).days

    def get_proReply(self, obj):
        return obj.pro_reply or None


class ReviewCreateSerializer(serializers.Serializer):
    """Crear reseña de servicio a partir del número de orden."""

    order_number = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    text = serializers.CharField(required=False, allow_blank=True, max_length=500)

    def validate(self, attrs):
        request = self.context['request']
        try:
            order = Order.objects.select_related('professional').get(
                order_number=attrs['order_number'],
            )
        except Order.DoesNotExist:
            raise serializers.ValidationError({'order_number': 'No existe una orden con ese número.'})

        if order.client_id != request.user.id:
            raise serializers.ValidationError({'order_number': 'Esta orden no te pertenece.'})
        if order.status != Order.Status.COMPLETED:
            raise serializers.ValidationError(
                {'order_number': 'Solo puedes reseñar servicios completados.'})
        if Review.objects.filter(order=order).exists():
            raise serializers.ValidationError(
                {'order_number': 'Esta orden ya tiene una reseña.'})

        attrs['order'] = order
        return attrs

    def create(self, validated_data):
        from .models import recalc_professional_rating
        order = validated_data['order']
        review = Review.objects.create(
            order=order,
            client=order.client,
            professional=order.professional,
            rating=validated_data['rating'],
            text=validated_data.get('text', ''),
        )
        recalc_professional_rating(order.professional)

        from apps.notifications.services import notify
        notify(
            order.professional.user,
            type='review',
            text=f'Recibiste una reseña de {review.rating}★ en la orden {order.order_number}.',
            link='/panel',
        )
        return review


class ReviewReplySerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)


class PlatformReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformReview
        fields = ('id', 'rating', 'text', 'created_at')
        read_only_fields = ('id', 'created_at')
