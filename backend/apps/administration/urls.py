"""URLs del panel de administración. Prefijo: /api/v1/admin/"""

from django.urls import path

from .views import (
    AdminStatsView,
    PendingProfessionalsView,
    ProfessionalApproveView,
    ProfessionalRejectView,
    ProfessionalRequestChangesView,
    AdminReviewListView,
    AdminReviewModerateView,
)

app_name = 'administration'

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='stats'),
    path('professionals/pending/', PendingProfessionalsView.as_view(), name='pending-pros'),
    path('professionals/<int:pk>/approve/', ProfessionalApproveView.as_view(), name='approve-pro'),
    path('professionals/<int:pk>/reject/', ProfessionalRejectView.as_view(), name='reject-pro'),
    path('professionals/<int:pk>/request-changes/', ProfessionalRequestChangesView.as_view(), name='request-changes-pro'),
    path('reviews/', AdminReviewListView.as_view(), name='reviews'),
    path('reviews/<int:pk>/approve/', AdminReviewModerateView.as_view(), name='approve-review'),
    path('reviews/<int:pk>/', AdminReviewModerateView.as_view(), name='moderate-review'),
]
