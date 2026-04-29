"""
Development settings - Basado en tu configuración actual
Para desarrollo local con PostgreSQL (tu configuración actual)
"""

from .base import *
import os
import environ

# ============================================================================
# ENVIRONMENT VARIABLES (Usando django-environ)
# ============================================================================
# Crear archivo .env en la raíz con tus variables
env = environ.Env()
environ.Env.read_env(BASE_DIR / '.env')

# ============================================================================
# DEBUG
# ============================================================================
DEBUG = True

# Mantén tus ALLOWED_HOSTS actuales o amplíalos
ALLOWED_HOSTS = env('ALLOWED_HOSTS').split(',')  # Ejemplo: localhost,

# ============================================================================
# SECRET KEY (Mantén tu clave actual)
# ============================================================================
#SECRET_KEY = 'django-insecure-1&j4^^c4q2)ozgw#_lbuh*1$-u!vz5-1ek51j-hdz=--qbx@9_'
SECRET_KEY = env('SECRET_KEY')

# ============================================================================
# DATABASE (TU CONFIGURACIÓN ACTUAL)
# Mantenemos exactamente tu configuración de base de datos
# ============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
        'CONN_MAX_AGE': 60,  # Mantener conexiones abiertas 60 segundos
        'OPTIONS': {
            'connect_timeout': 5,
        }
    }
}

# ============================================================================
# CORS (Permitir todo en desarrollo)
# ============================================================================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ============================================================================
# CSRF (Desactivado para desarrollo)
# ============================================================================
CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']

# ============================================================================
# EMAIL (Consola para desarrollo)
# ============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ============================================================================
# CACHE (Dummy para desarrollo)
# ============================================================================
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# ============================================================================
# CHANNELS (InMemory para desarrollo - no necesita Redis)
# ============================================================================
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# ============================================================================
# CELERY (Modo eager - ejecuta tareas sincrónicas)
# ============================================================================
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_URL = 'memory://'
CELERY_RESULT_BACKEND = 'cache'

# ============================================================================
# SMS (Mock para desarrollo)
# ============================================================================
TEXTBEE_API_URL = 'http://localhost:8080/api'
TEXTBEE_API_KEY = 'dev-mock-key'

# ============================================================================
# LOGGING (Más detallado en desarrollo)
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
            'formatter': 'verbose',  # Más detalle en consola
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',  # Muestra todas las queries SQL
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
# SEGURIDAD (Desactivada en desarrollo)
# ============================================================================
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_BROWSER_XSS_FILTER = False
SECURE_HSTS_SECONDS = 0

# ============================================================================
# STATIC & MEDIA (Desarrollo)
# ============================================================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ============================================================================
# DEBUG TOOLS (Opcional - instalar django-debug-toolbar si quieres)
# ============================================================================
# Para usar debug toolbar, instalar: pip install django-debug-toolbar
# Luego descomentar las siguientes líneas:
# if DEBUG:
#     INSTALLED_APPS += ['debug_toolbar']
#     MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
#     INTERNAL_IPS = ['127.0.0.1']

# ============================================================================
# RATE LIMITING (Desactivado o muy permisivo en desarrollo)
# ============================================================================
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '1000/hour',
    'user': '10000/hour',
    'login': '30/minute',
    'chat': '300/minute',
}

# ============================================================================
# DATOS DE PRUEBA
# ============================================================================
CREATE_TEST_DATA = True  # Crear datos de prueba al migrar