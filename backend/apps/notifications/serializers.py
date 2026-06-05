"""Serializer de notificaciones."""

from django.utils.timesince import timesince
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ('id', 'type', 'text', 'link', 'urgent', 'is_read', 'time', 'created_at')

    def get_id(self, obj):
        return str(obj.pk)

    def get_time(self, obj):
        return f'hace {timesince(obj.created_at)}'
