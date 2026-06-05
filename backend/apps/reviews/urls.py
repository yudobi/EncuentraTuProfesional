"""URLs de reseñas. Prefijo: /api/v1/reviews/"""

from django.urls import path

from .views import (
    ReviewListCreateView,
    ReviewReplyView,
    ReviewReportView,
    PlatformReviewCreateView,
)

app_name = 'reviews'

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='list-create'),
    path('platform/', PlatformReviewCreateView.as_view(), name='platform'),
    path('<int:pk>/reply/', ReviewReplyView.as_view(), name='reply'),
    path('<int:pk>/report/', ReviewReportView.as_view(), name='report'),
]
