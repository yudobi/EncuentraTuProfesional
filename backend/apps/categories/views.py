"""Vistas públicas de categorías. Prefijo: /api/v1/categories/"""

from django.db.models import Count, Q
from rest_framework import generics, permissions

from .models import Category
from .serializers import CategorySerializer


def _annotated_queryset():
    return (
        Category.objects
        .filter(is_active=True)
        .annotate(pro_count=Count(
            'professionals',
            filter=Q(professionals__is_approved=True),
            distinct=True,
        ))
        .order_by('order', 'name')
    )


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Array plano (coincide con Category[])

    def get_queryset(self):
        return _annotated_queryset()


class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return _annotated_queryset()
