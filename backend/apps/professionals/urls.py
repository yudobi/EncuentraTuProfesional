"""URLs de profesionales. Prefijo: /api/v1/professionals/"""

from django.urls import path

from .views import (
    ProfessionalListView,
    ProfessionalDetailView,
    MyProfessionalProfileView,
)

app_name = 'professionals'

urlpatterns = [
    path('', ProfessionalListView.as_view(), name='list'),
    path('me/', MyProfessionalProfileView.as_view(), name='me'),
    path('<int:pk>/', ProfessionalDetailView.as_view(), name='detail'),
]
