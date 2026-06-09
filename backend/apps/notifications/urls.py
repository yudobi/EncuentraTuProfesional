"""URLs de notificaciones. Prefijo: /api/v1/notifications/"""

from django.urls import path

from .views import (
    NotificationListView,
    UnreadCountView,
    MarkReadView,
    MarkAllReadView,
)

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='list'),
    path('unread-count/', UnreadCountView.as_view(), name='unread-count'),
    path('read-all/', MarkAllReadView.as_view(), name='read-all'),
    path('<int:pk>/read/', MarkReadView.as_view(), name='read'),
]
