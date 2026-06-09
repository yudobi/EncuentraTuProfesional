"""
Vistas de reseñas. Prefijo: /api/v1/reviews/

- GET  /api/v1/reviews/?professional=<id>  -> lista pública (sin flagged)
- POST /api/v1/reviews/                     -> crear reseña de servicio (cliente)
- POST /api/v1/reviews/<id>/reply/          -> responder (profesional dueño)
- POST /api/v1/reviews/<id>/report/         -> reportar para moderación
- POST /api/v1/reviews/platform/            -> reseña de la plataforma
"""

from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Review, PlatformReview, recalc_professional_rating
from .serializers import (
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewReplySerializer,
    PlatformReviewSerializer,
)


class ReviewListCreateView(generics.ListCreateAPIView):
    pagination_class = None
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = (
            Review.objects
            .select_related('client', 'professional', 'order')
            .filter(flagged=False)
        )
        professional = self.request.query_params.get('professional')
        if professional:
            qs = qs.filter(professional_id=professional)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = ReviewCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class ReviewReplyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            review = Review.objects.select_related('professional').get(pk=pk)
        except Review.DoesNotExist:
            return Response({'detail': 'Reseña no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        if review.professional.user_id != request.user.id:
            raise PermissionDenied('Solo el profesional reseñado puede responder.')

        serializer = ReviewReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review.pro_reply = serializer.validated_data['text']
        review.save(update_fields=['pro_reply', 'updated_at'])
        return Response(ReviewSerializer(review).data)


class ReviewReportView(APIView):
    """Marca una reseña para revisión del admin (la oculta del público)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            review = Review.objects.select_related('professional').get(pk=pk)
        except Review.DoesNotExist:
            return Response({'detail': 'Reseña no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        review.flagged = True
        review.save(update_fields=['flagged'])
        recalc_professional_rating(review.professional)
        return Response({'detail': 'Reseña reportada para moderación.'}, status=status.HTTP_200_OK)


class PlatformReviewCreateView(generics.CreateAPIView):
    serializer_class = PlatformReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # 1 reseña de plataforma por usuario: actualiza si ya existe.
        PlatformReview.objects.update_or_create(
            user=self.request.user,
            defaults={
                'rating': serializer.validated_data['rating'],
                'text': serializer.validated_data.get('text', ''),
            },
        )
