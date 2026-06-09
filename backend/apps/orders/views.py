"""
Vistas de órdenes. Prefijo: /api/v1/orders/

- GET  /api/v1/orders/                -> órdenes propias (como cliente o profesional)
- POST /api/v1/orders/                -> crear orden (cliente contrata)
- GET  /api/v1/orders/<order_number>/ -> detalle (cliente o profesional dueños)
- PATCH /api/v1/orders/<order_number>/ -> actualizar estado
"""

from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderStatusUpdateSerializer,
)


def _owned_orders(user):
    """Órdenes donde el usuario es el cliente o el profesional."""
    return (
        Order.objects
        .select_related('client', 'professional__user', 'category')
        .filter(Q(client=user) | Q(professional__user=user))
    )


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # Array plano (las órdenes por usuario son acotadas)

    def get_serializer_class(self):
        return OrderCreateSerializer if self.request.method == 'POST' else OrderSerializer

    def get_queryset(self):
        return _owned_orders(self.request.user)

    def create(self, request, *args, **kwargs):
        write = OrderCreateSerializer(data=request.data)
        write.is_valid(raise_exception=True)
        order = write.save(client=request.user)

        # Notificar al profesional y a los administradores.
        from apps.notifications.services import notify, notify_admins
        notify(
            order.professional.user,
            type='order',
            text=f'Nueva orden {order.order_number}: {order.service_title}.',
            urgent=True,
            link=f'/orden/{order.order_number}',
            send_sms_msg=True,
        )
        notify_admins(
            type='order',
            text=f'Nueva orden {order.order_number} generada.',
        )

        return Response(
            OrderSerializer(order, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return _owned_orders(self.request.user)

    def get_serializer_class(self):
        return OrderStatusUpdateSerializer if self.request.method == 'PATCH' else OrderSerializer

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        user = request.user
        is_professional = order.professional.user_id == user.id
        is_admin = bool(getattr(user, 'is_admin', False) or user.is_staff)
        new_status = request.data.get('status')

        # El profesional o un admin pueden marcar completada/no_show.
        # El cliente solo puede cancelar su propia orden.
        if new_status == Order.Status.CANCELLED:
            allowed = is_professional or is_admin or order.client_id == user.id
        else:
            allowed = is_professional or is_admin
        if not allowed:
            raise PermissionDenied('No tienes permiso para cambiar el estado de esta orden.')

        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(order, context=self.get_serializer_context()).data)
