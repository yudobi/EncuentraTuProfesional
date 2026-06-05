from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'client', 'professional', 'service_title',
                    'status', 'source', 'scheduled_for', 'created_at')
    list_filter = ('status', 'source', 'created_at')
    search_fields = ('order_number', 'client__email', 'professional__business_name', 'service_title')
    raw_id_fields = ('client', 'professional', 'category')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'completed_at')
    date_hierarchy = 'created_at'
