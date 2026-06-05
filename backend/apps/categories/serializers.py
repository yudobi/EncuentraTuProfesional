"""Serializer de categorías, alineado con `interface Category` del frontend.

El frontend usa `id` como string tipo slug ("plomeria") y un `count` numérico
de profesionales. Exponemos `id = slug` y `count` = profesionales aprobados.
"""

from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug')
    count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'icon', 'count', 'hero', 'description')

    def get_count(self, obj):
        # Si la vista anotó `pro_count`, úsalo (evita N+1); si no, cuéntalo.
        annotated = getattr(obj, 'pro_count', None)
        if annotated is not None:
            return annotated
        return obj.professionals.filter(is_approved=True).count()
