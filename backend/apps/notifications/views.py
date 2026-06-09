"""
Vistas de notificaciones. Prefijo: /api/v1/notifications/

- GET  /api/v1/notifications/              -> propias (recientes)
- GET  /api/v1/notifications/unread-count/ -> { count }
- POST /api/v1/notifications/<id>/read/    -> marcar leída
- POST /api/v1/notifications/read-all/     -> marcar todas leídas
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)[:50]


class UnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'count': count})


class MarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        updated = Notification.objects.filter(
            pk=pk, recipient=request.user,
        ).update(is_read=True)
        if not updated:
            return Response({'detail': 'No encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Marcada como leída.'})


class MarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'detail': 'Todas marcadas como leídas.'})
