from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, ClientProfile, ProfessionalProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin del modelo de usuario personalizado (login por email)."""

    ordering = ('email',)
    list_display = ('email', 'username', 'role', 'is_verified', 'auth_provider', 'is_staff', 'created_at')
    list_filter = ('role', 'is_verified', 'auth_provider', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone_number')
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'phone_number', 'avatar')}),
        ('Rol y verificación', {'fields': ('role', 'is_verified')}),
        ('Autenticación social', {'fields': ('auth_provider', 'google_id')}),
        ('Preferencias', {'fields': ('receive_email_notifications', 'receive_sms_notifications')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'phone_number', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'address', 'birth_date')
    search_fields = ('user__email', 'user__username')
    raw_id_fields = ('user',)


@admin.register(ProfessionalProfile)
class ProfessionalProfileAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'approval_status', 'is_approved', 'rating_avg', 'total_reviews')
    list_filter = ('approval_status', 'is_approved')
    search_fields = ('business_name', 'user__email', 'contact_email_public')
    raw_id_fields = ('user',)
    readonly_fields = ('rating_avg', 'total_reviews', 'total_services_completed')
    filter_horizontal = ('categories',)
