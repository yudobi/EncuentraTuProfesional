"""
Panel de administración. Prefijo: /api/v1/admin/  (requiere rol admin)

- GET  /api/v1/admin/stats/
- GET  /api/v1/admin/professionals/pending/
- POST /api/v1/admin/professionals/<id>/approve/
- POST /api/v1/admin/professionals/<id>/reject/            { notes }
- POST /api/v1/admin/professionals/<id>/request-changes/   { notes }
- GET  /api/v1/admin/reviews/                              (?flagged=true)
- POST /api/v1/admin/reviews/<id>/approve/                 (quita el flag)
- DELETE /api/v1/admin/reviews/<id>/
"""

from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import ProfessionalProfile, User
from apps.orders.models import Order
from apps.reviews.models import Review, recalc_professional_rating
from .permissions import IsAdminRole
from .serializers import (
    AdminProfessionalSerializer,
    AdminReviewSerializer,
    ModerationNotesSerializer,
)


class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        today = timezone.now().date()
        return Response({
            'pending_professionals': ProfessionalProfile.objects.filter(
                approval_status__in=['pending', 'changes_requested']).count(),
            'flagged_reviews': Review.objects.filter(flagged=True).count(),
            'total_orders': Order.objects.count(),
            'orders_today': Order.objects.filter(created_at__date=today).count(),
            'active_professionals': ProfessionalProfile.objects.filter(is_approved=True).count(),
            'total_clients': User.objects.filter(role=User.Role.CLIENT).count(),
        })


class PendingProfessionalsView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = AdminProfessionalSerializer
    pagination_class = None

    def get_queryset(self):
        return (
            ProfessionalProfile.objects
            .select_related('user')
            .prefetch_related('categories')
            .filter(approval_status__in=['pending', 'changes_requested'])
            .order_by('user__created_at')
        )


class ProfessionalApproveView(APIView):
    permission_classes = [IsAdminRole]

    def _get(self, pk):
        return ProfessionalProfile.objects.select_related('user').filter(pk=pk).first()

    def post(self, request, pk):
        profile = self._get(pk)
        if not profile:
            return Response({'detail': 'Profesional no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        profile.is_approved = True
        profile.approval_status = 'approved'
        profile.approval_notes = ''
        profile.save(update_fields=['is_approved', 'approval_status', 'approval_notes'])

        from apps.notifications.services import notify
        notify(
            profile.user,
            type='approval',
            text='¡Tu perfil profesional ha sido aprobado y ya es visible!',
            link='/panel',
            send_sms_msg=True,
        )
        return Response(AdminProfessionalSerializer(profile).data)


class ProfessionalRejectView(APIView):
    permission_classes = [IsAdminRole]
    target_status = 'rejected'

    def post(self, request, pk):
        profile = ProfessionalProfile.objects.select_related('user').filter(pk=pk).first()
        if not profile:
            return Response({'detail': 'Profesional no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        notes_ser = ModerationNotesSerializer(data=request.data)
        notes_ser.is_valid(raise_exception=True)
        profile.is_approved = False
        profile.approval_status = self.target_status
        profile.approval_notes = notes_ser.validated_data.get('notes', '')
        profile.save(update_fields=['is_approved', 'approval_status', 'approval_notes'])

        from apps.notifications.services import notify
        verb = 'requiere cambios' if self.target_status == 'changes_requested' else 'fue rechazado'
        notes = profile.approval_notes
        notify(
            profile.user,
            type='approval',
            text=f'Tu perfil {verb}.' + (f' Nota: {notes}' if notes else ''),
            link='/panel',
        )
        return Response(AdminProfessionalSerializer(profile).data)


class ProfessionalRequestChangesView(ProfessionalRejectView):
    target_status = 'changes_requested'


class AdminReviewListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = AdminReviewSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Review.objects.select_related('client', 'professional__user', 'order').all()
        flagged = self.request.query_params.get('flagged')
        if flagged in ('true', '1', 'True'):
            qs = qs.filter(flagged=True)
        return qs


class AdminReviewModerateView(APIView):
    permission_classes = [IsAdminRole]

    def _get(self, pk):
        return Review.objects.select_related('professional').filter(pk=pk).first()

    def post(self, request, pk):
        """Aprobar = quitar el flag y dejar visible la reseña."""
        review = self._get(pk)
        if not review:
            return Response({'detail': 'Reseña no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        review.flagged = False
        review.save(update_fields=['flagged'])
        recalc_professional_rating(review.professional)
        return Response(AdminReviewSerializer(review).data)

    def delete(self, request, pk):
        review = self._get(pk)
        if not review:
            return Response({'detail': 'Reseña no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        professional = review.professional
        review.delete()
        recalc_professional_rating(professional)
        return Response(status=status.HTTP_204_NO_CONTENT)
