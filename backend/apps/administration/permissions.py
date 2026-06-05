from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Permite acceso a usuarios con rol admin/super_admin o staff."""

    message = 'Se requiere rol de administrador.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (getattr(user, 'is_admin', False) or user.is_staff)
        )


class IsSuperAdminRole(BasePermission):
    """Solo super-admin (o superuser de Django)."""

    message = 'Se requiere rol de super administrador.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (getattr(user, 'is_super_admin', False) or user.is_superuser)
        )
