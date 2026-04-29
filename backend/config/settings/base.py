"""
Base settings for ServiceHub project.
Comunes para TODOS los entornos - Basado en tu configuración actual
"""

from pathlib import Path
from datetime import timedelta
import os

# ============================================================================
# PATHS BASE
# ============================================================================
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Ahora apunta a backend/

# ============================================================================
# APPS CONFIGURATION
# ============================================================================
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',          # Para WebSockets (chat)
    'guardian',          # Para permisos por objeto
    'django_filters',    # Para filtros avanzados
]

LOCAL_APPS = [
    'apps.accounts',           # Usuarios
    #'apps.professionals',      # Perfiles profesionales
    #'apps.orders',             # Órdenes de servicio
    #'apps.reviews',            # Sistema de reviews
    #'apps.chat',               # Chat y mensajería
    #'apps.notifications',      # Notificaciones email/SMS
    #'apps.categories',         # Categorías de servicios
    #'apps.favorites',          # Favoritos de clientes
    #'apps.analytics',          # Estadísticas
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ============================================================================
# MIDDLEWARE
# ============================================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS debe ir lo más arriba posible
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'  # IMPORTANTE: mantiene 'backend.urls' porque tu proyecto se llama 'backend'

# ============================================================================
# TEMPLATES
# ============================================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Añadido para plantillas personalizadas
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'  # Para WebSockets

# ============================================================================
# DATABASE (Base - se sobreescribe en cada entorno)
# Configuración por defecto (se usará en development)
# ============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

# ============================================================================
# AUTHENTICATION
# ============================================================================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Custom user model
#AUTH_USER_MODEL = 'accounts.User'  # Crearemos este modelo

# Django Guardian (permisos por objeto)
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # Default
    'guardian.backends.ObjectPermissionBackend',  # Permisos por objeto
)

# ============================================================================
# INTERNATIONALIZATION
# ============================================================================
LANGUAGE_CODE = 'es-mx'  # Cambiado a español México
TIME_ZONE = 'America/Mexico_City'  # Cambiado a hora de México
USE_I18N = True
USE_TZ = True

# ============================================================================
# STATIC & MEDIA FILES
# ============================================================================
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']  # Para archivos estáticos personalizados

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ============================================================================
# DEFAULT PRIMARY KEY
# ============================================================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================================================
# DJANGO REST FRAMEWORK (DRF)
# ============================================================================
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',      # Usuarios no autenticados
        'user': '1000/day',     # Usuarios autenticados
        'login': '5/minute',    # Intentos de login
        'chat': '60/minute',    # Mensajes de chat
    }
}

# ============================================================================
# JWT CONFIGURATION (basado en tu configuración)
# ============================================================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,  # Añadido para registrar último login
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': None,  # Se toma del SECRET_KEY
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

# ============================================================================
# CORS CONFIGURATION (Base - se sobreescribe en cada entorno)
# ============================================================================
CORS_ALLOW_ALL_ORIGINS = True  # Para desarrollo, cambiar en producción
CORS_ALLOW_CREDENTIALS = True

# ============================================================================
# CHANNELS (WebSockets) - Base
# ============================================================================
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',  # Para desarrollo
    },
}

# ============================================================================
# CACHING (Base)
# ============================================================================
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'servicehub-cache',
    }
}

# ============================================================================
# CELERY (Tareas asíncronas) - Base
# ============================================================================
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutos
CELERY_TASK_ALWAYS_EAGER = True  # Por defecto, ejecutar sincrónicamente
CELERY_BROKER_URL = 'memory://'
CELERY_RESULT_BACKEND = 'cache'

# ============================================================================
# EMAIL (Base - consola por defecto)
# ============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'ServiceHub <noreply@servicehub.com>'
EMAIL_SUBJECT_PREFIX = '[ServiceHub] '

# ============================================================================
# SMS (TextBee) - Base
# ============================================================================
TEXTBEE_API_URL = None
TEXTBEE_API_KEY = None

# ============================================================================
# LOGGING (Base)
# ============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# ============================================================================
# CUSTOM SETTINGS DEL PROYECTO
# ============================================================================
# Tipos de usuarios
USER_TYPES = {
    'CLIENT': 'client',
    'PROFESSIONAL': 'professional',
    'ADMIN': 'admin',
    'SUPERADMIN': 'superadmin',
}

# Estados de órdenes
ORDER_STATUS = {
    'SCHEDULED': 'scheduled',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'NO_SHOW': 'no_show',
}

# Rating máximo
MAX_RATING = 5
MIN_RATING = 1

# WhatsApp - horas para confirmar cita
WHATSAPP_PENDING_HOURS = 24