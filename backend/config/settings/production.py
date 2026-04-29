"""
Production settings - Para VPS con Nginx, PostgreSQL, Redis
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
# DEBUG (Siempre False en producción)
# ============================================================================
DEBUG = False

# Configurar ALLOWED_HOSTS desde variable de entorno
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['api.servicehub.com'])

# ============================================================================
# SECRET KEY (Desde variable de entorno, NUNCA hardcodeada)
# ============================================================================
SECRET_KEY = env('SECRET_KEY')

# ============================================================================
# DATABASE (PostgreSQL - configuración para VPS)
# ============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME', default='db_find_pro'),
        'USER': env('DB_USER', default='postgres'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default='5432'),
        'CONN_MAX_AGE': 60,  # Mantener conexiones abiertas 60 segundos
        'OPTIONS': {
            'connect_timeout': 5,
        }
    }
}

# ============================================================================
# CACHE (Redis para producción)
# ============================================================================
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://localhost:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'CONNECTION_POOL_CLASS': 'redis.BlockingConnectionPool',
            'CONNECTION_POOL_CLASS_KWARGS': {
                'max_connections': 50,
                'timeout': 20,
            },
            'MAX_CONNECTIONS': 1000,
            'PICKLE_VERSION': -1,
        },
        'KEY_PREFIX': 'servicehub',
        'TIMEOUT': 300,  # 5 minutos
    }
}

# ============================================================================
# CHANNELS (Redis para WebSockets)
# ============================================================================
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [env('REDIS_URL', default='redis://localhost:6379/2')],
            "symmetric_encryption_keys": [SECRET_KEY[:32]],
            "capacity": 1500,
            "expiry": 60,
        },
    },
}

# ============================================================================
# CELERY (Tareas asíncronas con Redis)
# ============================================================================
CELERY_TASK_ALWAYS_EAGER = False
CELERY_BROKER_URL = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('REDIS_URL', default='redis://localhost:6379/0')
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_WORKER_CONCURRENCY = 4
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000
CELERY_TASK_SOFT_TIME_LIMIT = 60 * 5  # 5 minutos
CELERY_TASK_TIME_LIMIT = 60 * 10  # 10 minutos
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# ============================================================================
# EMAIL (SMTP Real para producción)
# ============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = f'ServiceHub <{EMAIL_HOST_USER}>'

# ============================================================================
# SMS (TextBee Self-hosted)
# ============================================================================
TEXTBEE_API_URL = env('TEXTBEE_API_URL', default='http://localhost:8080/api')
TEXTBEE_API_KEY = env('TEXTBEE_API_KEY')

# ============================================================================
# CORS (Solo dominios específicos)
# ============================================================================
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS',
    default=[
        'https://servicehub.com',
        'https://www.servicehub.com',
    ]
)
CORS_ALLOW_CREDENTIALS = True
CORS_PREFLIGHT_MAX_AGE = 86400

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ============================================================================
# CSRF
# ============================================================================
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=['https://servicehub.com'])

# ============================================================================
# SEGURIDAD (HTTPS, HSTS, etc.)
# ============================================================================
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 año
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = 'DENY'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ============================================================================
# SESSION
# ============================================================================
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'
SESSION_COOKIE_AGE = 86400  # 24 horas
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True

# ============================================================================
# STATIC & MEDIA (Servidos por Nginx)
# ============================================================================
STATIC_ROOT = '/var/www/servicehub/static'
MEDIA_ROOT = '/var/www/servicehub/media'

# Compresión de archivos estáticos
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# ============================================================================
# DATA UPLOAD LIMITS
# ============================================================================
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10240
DATA_UPLOAD_MAX_NUMBER_FILES = 100
DATA_UPLOAD_MAX_FILE_SIZE = 10485760  # 10 MB

# ============================================================================
# LOGGING (Archivos en producción)
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
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file_error': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/servicehub/error.log',
            'maxBytes': 1024 * 1024 * 50,  # 50 MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
        'file_info': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/servicehub/info.log',
            'maxBytes': 1024 * 1024 * 50,
            'backupCount': 10,
            'formatter': 'simple',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file_error', 'file_info', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['file_error'],
            'level': 'ERROR',
            'propagate': False,
        },
        'apps': {
            'handlers': ['file_error', 'file_info'],
            'level': 'INFO',
            'propagate': False,
        },
        'celery': {
            'handlers': ['file_error', 'file_info'],
            'level': 'INFO',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['file_error', 'console'],
        'level': 'WARNING',
    },
}

# ============================================================================
# ADMINS (Para reportes de errores)
# ============================================================================
ADMINS = [
    ('Admin', env('ADMIN_EMAIL', default='admin@servicehub.com')),
]
MANAGERS = ADMINS
SERVER_EMAIL = f'Server ServiceHub <{EMAIL_HOST_USER}>'

# ============================================================================
# SECURITY HEADERS ADICIONALES
# ============================================================================
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# ============================================================================
# API THROTTLING (Límites para producción)
# ============================================================================
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '100/day',      # Usuarios no autenticados
    'user': '1000/day',     # Usuarios autenticados
    'login': '5/minute',    # Intentos de login
    'chat': '60/minute',    # Mensajes de chat
}

# ============================================================================
# HEALTH CHECK
# ============================================================================
HEALTH_CHECK_URL = '/health/'