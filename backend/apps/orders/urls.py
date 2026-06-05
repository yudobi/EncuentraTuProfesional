"""URLs de órdenes. Prefijo: /api/v1/orders/"""

from django.urls import path

from .views import OrderListCreateView, OrderDetailView

app_name = 'orders'

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='list-create'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='detail'),
]
