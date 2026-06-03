# backend/apps/accounts/urls.py
"""
URL configuration for accounts app.

Maneja todas las rutas relacionadas con autenticación y gestión de usuarios.
Todas las URLs están prefijadas con /api/v1/auth/ (definido en el URL principal)
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    GoogleAuthView,
    GoogleAuthTestView,  # ← Añadimos vista de prueba separada
    LogoutView,
    MeView,
)

app_name = 'accounts'

# ==============================================
# URL Patterns
# ==============================================
# Todas estas URLs estarán disponibles bajo: /api/v1/auth/
# Ejemplo: /api/v1/auth/register/
#          /api/v1/auth/login/
#          /api/v1/auth/google/
# ==============================================

urlpatterns = [
    # ------------------------------------------------------------
    # 1. AUTENTICACIÓN TRADICIONAL (Email/Password)
    # ------------------------------------------------------------
    
    # Registro de nuevos usuarios
    # POST /api/v1/auth/register/
    # Body: { "email", "username", "password", "password2", "phone_number" }
    # Response: { "user", "access", "refresh" }
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login con email y contraseña
    # POST /api/v1/auth/login/
    # Body: { "email", "password" }
    # Response: { "access", "refresh", "user", "role" }
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Renovar access token usando refresh token
    # POST /api/v1/auth/refresh/
    # Body: { "refresh": "token" }
    # Response: { "access": "new_token" }
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Cerrar sesión (invalida refresh token)
    # POST /api/v1/auth/logout/
    # Header: Authorization: Bearer <access_token>
    # Body: { "refresh": "token" }
    # Response: { "message": "Sesión cerrada exitosamente" }
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Obtener perfil del usuario autenticado
    # GET /api/v1/auth/me/
    # Header: Authorization: Bearer <access_token>
    # Response: { "id", "email", "username", "role", "client_profile", ... }
    path('me/', MeView.as_view(), name='me'),
    
    # ------------------------------------------------------------
    # 2. GOOGLE OAUTH
    # ------------------------------------------------------------
    
    # Endpoint principal para intercambiar código de Google por JWT
    # POST /api/v1/auth/google/
    # Body: { "code": "código_recibido_de_google" }
    # Response: { "access", "refresh", "user", "is_new_user" }
    path('google/', GoogleAuthView.as_view(), name='google_auth'),
    
    # Endpoint de prueba para verificar configuración de Google OAuth
    # GET /api/v1/auth/google/test/
    # Response: { "message", "client_id_configured", "redirect_uri", ... }
    path('google/test/', GoogleAuthTestView.as_view(), name='google_test'),
    
    # ------------------------------------------------------------
    # 3. ENDPOINTS ADICIONALES (OPCIONALES)
    # ------------------------------------------------------------
    
    # Estos endpoints los puedes agregar más adelante según necesites
    
    # Verificar si el token es válido
    # GET /api/v1/auth/verify/
    # path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Cambiar contraseña (usuario autenticado)
    # POST /api/v1/auth/change-password/
    # path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Solicitar restablecimiento de contraseña (olvidé mi contraseña)
    # POST /api/v1/auth/password-reset/
    # path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    
    # Confirmar restablecimiento de contraseña
    # POST /api/v1/auth/password-reset-confirm/
    # path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

# ==============================================
# NOTAS IMPORTANTES:
# ==============================================
# 1. No incluyas 'allauth.urls' aquí porque ya está en el URL principal
# 2. El prefijo /api/v1/auth/ se define en backend/urls.py
# 3. Todas las vistas requieren permisos específicos (ver views.py)
# 4. Los tokens JWT tienen expiración: access=15min, refresh=7d
# ==============================================