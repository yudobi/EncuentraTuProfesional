"""
Vistas del catálogo de profesionales.

- GET  /api/v1/professionals/        -> lista pública (solo aprobados) con filtros
- GET  /api/v1/professionals/<pk>/   -> detalle público
- GET/POST/PUT /api/v1/professionals/me/ -> perfil propio del profesional autenticado
"""

from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import ProfessionalProfile
from .serializers import ProfessionalCardSerializer, ProfessionalWriteSerializer


def _base_queryset():
    return (
        ProfessionalProfile.objects
        .filter(is_approved=True)
        .select_related('user')
        .prefetch_related('categories')
    )


class ProfessionalListView(generics.ListAPIView):
    """Listado público de profesionales aprobados, con filtros y orden.

    Query params (compatibles con el hook useProfessionals del frontend):
    - category=<slug>          filtra por categoría
    - search=<texto>           busca en nombre, headline, negocio y descripción
    - verified_only=true       solo verificados
    - ordering=rating|price-asc|price-desc|distance
    """

    serializer_class = ProfessionalCardSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Devuelve un array plano (coincide con Professional[])

    def get_queryset(self):
        qs = _base_queryset()
        params = self.request.query_params

        category = params.get('category')
        if category:
            qs = qs.filter(categories__slug=category)

        search = params.get('search') or params.get('q')
        if search:
            qs = qs.filter(
                Q(business_name__icontains=search)
                | Q(headline__icontains=search)
                | Q(description__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
            )

        verified = params.get('verified_only')
        if verified in ('true', '1', 'True'):
            qs = qs.filter(user__is_verified=True)

        ordering = params.get('ordering')
        order_map = {
            'rating': '-rating_avg',
            'price-asc': 'price_from',
            'price-desc': '-price_from',
            # Sin geolocalización aún: usamos tiempo de respuesta como proxy.
            'distance': 'response_time_min',
        }
        qs = qs.order_by(order_map.get(ordering, '-rating_avg'), '-id')

        return qs.distinct()


class ProfessionalDetailView(generics.RetrieveAPIView):
    """Detalle público de un profesional aprobado."""

    serializer_class = ProfessionalCardSerializer
    permission_classes = [permissions.AllowAny]
    queryset = _base_queryset()


class MyProfessionalProfileView(APIView):
    """Gestión del perfil profesional propio.

    Cualquier creación o edición deja el perfil en estado `pending` y no
    visible en el catálogo hasta que un admin lo apruebe (Fase 4).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'professional_profile', None)
        if profile is None:
            return Response({'detail': 'No tienes un perfil profesional.'},
                            status=status.HTTP_404_NOT_FOUND)
        return Response(ProfessionalCardSerializer(profile, context={'request': request}).data)

    def post(self, request):
        if getattr(request.user, 'professional_profile', None) is not None:
            return Response({'detail': 'Ya tienes un perfil profesional. Usa PUT para editarlo.'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = ProfessionalWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save(
            user=request.user,
            is_approved=False,
            approval_status='pending',
        )
        # Promover el usuario a rol profesional.
        if request.user.role != request.user.Role.PROFESSIONAL:
            request.user.role = request.user.Role.PROFESSIONAL
            request.user.save(update_fields=['role'])

        from apps.notifications.services import notify_admins
        notify_admins(
            type='signup',
            text=f'Nuevo profesional pendiente de validación: {profile.business_name}.',
            urgent=True,
        )
        return Response(
            ProfessionalCardSerializer(profile, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def put(self, request):
        profile = getattr(request.user, 'professional_profile', None)
        if profile is None:
            return Response({'detail': 'No tienes un perfil profesional. Usa POST para crearlo.'},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = ProfessionalWriteSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Toda edición vuelve a requerir aprobación.
        serializer.save(is_approved=False, approval_status='pending')

        from apps.notifications.services import notify_admins
        notify_admins(
            type='edit',
            text=f'{profile.business_name} editó su perfil. Pendiente de aprobación.',
            urgent=True,
        )
        return Response(ProfessionalCardSerializer(profile, context={'request': request}).data)
