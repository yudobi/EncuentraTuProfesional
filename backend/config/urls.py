# backend/urls.py
"""
URL configuration for backend project.

Estructura de URLs organizada por versiones y módulos:
- /admin/ → Panel de administración
- /api/v1/auth/ → Endpoints de autenticación (registro, login, google)
- /api/v1/accounts/ → Gestión de usuarios y perfiles
- /api/v1/services/ → Servicios y categorías (futuro)
- /api/v1/reviews/ → Reseñas y calificaciones (futuro)
- /accounts/ → URLs internas de django-allauth (NO TOCAR)
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
<<<<<<< HEAD
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse #para implementar la json response
=======

from apps.accounts.views import profile_redirect

# ==============================================
# IMPORTS DE TERCEROS (si los necesitas)
# ==============================================
# NOTA: No importamos TokenObtainPairView aquí porque usaremos
# nuestras vistas personalizadas dentro de apps.accounts
>>>>>>> 04f20388af02aa1c4a054968af7afdf1e58e6076

# Vista simple para home, para cargar urls
def home(request):
    return JsonResponse({
        'message': 'Bienvenido a ServiceHub API',
        'version': '1.0',
        'endpoints': [
            '/admin/',
            '/accounts/',
            '/orders/',
            '/chat/',
        ]
    })
#////////////////////////////////////////////////////////////////////////////////////
urlpatterns = [
    # ==============================================
    # 1. PANEL DE ADMINISTRACIÓN
    # ==============================================
    # Propósito: Interfaz para administradores y super-admins
    # Acceso: Solo usuarios con is_staff=True
    # URL: http://localhost:8000/admin/
    path('admin/', admin.site.urls),
<<<<<<< HEAD
    # Endpoints para JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
   # agregado paraa ejecutar runserver y probar que se cargan las urls
    path('', home, name='home'),  # API root
    #path('api/accounts/', include('apps.accounts.urls')),
    #path('api/orders/', include('apps.orders.urls')),
    
    path('chat/', include('apps.chat.urls')),#path(url,dirección de la url de la aplicación)
  #/////////////////////////////////////////////

=======
    
    # ==============================================
    # 2. DJANGO-ALLAUTH (REQUERIDO PARA GOOGLE OAUTH)
    # ==============================================
    # Propósito: Maneja todo el flujo OAuth con Google, Facebook, etc.
    # NO MODIFICAR: Estas URLs son internas de allauth
    # Uso interno: Redirecciones, callbacks, manejo de sesiones
    # Documentación: https://django-allauth.readthedocs.io/
    # URLs principales:
    #   - /accounts/google/login/ → Inicia login con Google
    #   - /accounts/google/login/callback/ → Google redirige aquí
    path('accounts/', include('allauth.urls')),
    
    # ==============================================
    # 3. API VERSIÓN 1 - AUTENTICACIÓN Y USUARIOS
    # ==============================================
    # Propósito: Endpoints públicos y privados para autenticación
    # App responsable: apps.accounts
    # Prefijo: /api/v1/auth/
    # Endpoints disponibles:
    #   POST   /api/v1/auth/register/      - Registro de nuevo usuario
    #   POST   /api/v1/auth/login/         - Login (email/password)
    #   POST   /api/v1/auth/refresh/       - Renovar access token
    #   POST   /api/v1/auth/logout/        - Cerrar sesión
    #   GET    /api/v1/auth/me/            - Perfil del usuario
    #   POST   /api/v1/auth/google/        - Google OAuth (intercambiar código)
    path('api/v1/auth/', include('apps.accounts.urls')),

    # ==============================================
    # 4. API VERSIÓN 1 - CATÁLOGO PÚBLICO (Fase 1)
    # ==============================================
    path('api/v1/categories/', include('apps.categories.urls')),       # Categorías
    path('api/v1/professionals/', include('apps.professionals.urls')),  # Profesionales
    path('api/v1/orders/', include('apps.orders.urls')),                # Órdenes (Fase 2)
    path('api/v1/reviews/', include('apps.reviews.urls')),              # Reseñas (Fase 3)
    path('api/v1/admin/', include('apps.administration.urls')),         # Admin/moderación (Fase 4)
    path('api/v1/notifications/', include('apps.notifications.urls')),  # Notificaciones (Fase 2)

    # ==============================================
    # 5. API VERSIÓN 1 - MÓDULOS FUTUROS (COMENTADOS)
    # ==============================================
    # path('api/v1/reviews/', include('apps.reviews.urls')),       # Reseñas
    # path('api/v1/chats/', include('apps.chat.urls')),            # Sistema de chat
    
    # ==============================================
    # 5. OTRAS VERSIONES DE API (Futuro)
    # ==============================================
    # Cuando necesites hacer cambios breaking, creas /api/v2/
    # path('api/v2/', include('apps.api_v2.urls')),

    path('accounts/profile/', profile_redirect, name='profile_redirect'),
>>>>>>> 04f20388af02aa1c4a054968af7afdf1e58e6076
]

# ==============================================
# ARCHIVOS ESTÁTICOS Y MEDIA (SOLO DESARROLLO)
# ==============================================
# Propósito: Servir archivos subidos por usuarios y archivos estáticos
# En producción: Usar Nginx o S3 para servir estos archivos
# DEBUG=True: Django sirve los archivos
# DEBUG=False: Debes configurar WhiteNoise o servidor externo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Opcional: Agregar panel de depuración (si usas django-debug-toolbar)
    # if 'debug_toolbar' in settings.INSTALLED_APPS:
    #     import debug_toolbar
    #     urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns