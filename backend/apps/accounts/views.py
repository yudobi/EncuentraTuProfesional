# backend/apps/accounts/views.py
"""
Vistas para la gestión de autenticación y usuarios.

Este archivo contiene todas las vistas relacionadas con:
- Registro y login de usuarios
- Manejo de tokens JWT
- Autenticación con Google OAuth
- Gestión de perfil de usuario
- Cierre de sesión
"""

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from django.contrib.auth import authenticate

from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    GoogleAuthSerializer,
)
from .utils.google_auth import GoogleAuthService
from .models import User


# ============================================================================
# 1. REGISTRO DE USUARIO (Email/Password tradicional)
# ============================================================================

class RegisterView(APIView):
    """
    Vista para registrar nuevos usuarios con email y contraseña.
    
    Endpoint: POST /api/v1/auth/register/
    
    Ejemplo de request:
    {
        "email": "usuario@example.com",
        "username": "usuario123",
        "password": "MiPassword123!",
        "password2": "MiPassword123!",
        "phone_number": "+1234567890",
        "first_name": "Juan",
        "last_name": "Perez"
    }
    
    Ejemplo de response (201 Created):
    {
        "user": {
            "id": 1,
            "email": "usuario@example.com",
            "username": "usuario123",
            "first_name": "Juan",
            "last_name": "Perez",
            "phone_number": "+1234567890",
            "role": "client",
            "is_verified": false,
            "avatar": null,
            "created_at": "2024-01-01T00:00:00Z"
        },
        "access": "eyJhbGciOiJIUzI1NiIs...",
        "refresh": "eyJhbGciOiJIUzI1NiIs...",
        "message": "Usuario creado exitosamente"
    }
    """
    
    permission_classes = [permissions.AllowAny]  # Cualquiera puede registrarse
    
    def post(self, request):
        """
        Procesa la solicitud de registro.
        
        1. Valida los datos con el serializer
        2. Crea el usuario y su perfil de cliente
        3. Genera tokens JWT
        4. Retorna los tokens y datos del usuario
        """
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            # Crear usuario
            user = serializer.save()
            
            # Generar tokens JWT para el nuevo usuario
            refresh = RefreshToken.for_user(user)
            
            # Personalizar claims del token
            refresh['email'] = user.email
            refresh['role'] = user.role
            refresh['is_verified'] = user.is_verified
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Usuario creado exitosamente'
            }, status=status.HTTP_201_CREATED)
        
        # Si hay errores de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================================
# 2. LOGIN PERSONALIZADO (con claims adicionales)
# ============================================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para login que incluye información del usuario en la respuesta.
    
    Endpoint: POST /api/v1/auth/login/
    
    Ejemplo de request:
    {
        "email": "usuario@example.com",
        "password": "MiPassword123!"
    }
    
    Ejemplo de response (200 OK):
    {
        "access": "eyJhbGciOiJIUzI1NiIs...",
        "refresh": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
            "id": 1,
            "email": "usuario@example.com",
            "username": "usuario123",
            "role": "client"
        },
        "role": "client"
    }
    """
    
    permission_classes = [permissions.AllowAny]  # Cualquiera puede intentar login
    
    def post(self, request, *args, **kwargs):
        """
        Procesa el login y retorna tokens + datos del usuario.
        
        1. Autentica al usuario con email y password
        2. Genera tokens JWT
        3. Añade información extra del usuario a la respuesta
        """
        # Autenticar usuario
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Usuario desactivado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        # Añadir claims personalizados
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['is_verified'] = user.is_verified
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_verified': user.is_verified,
            },
            'role': user.role,
        }, status=status.HTTP_200_OK)


# ============================================================================
# 3. GOOGLE OAUTH AUTHENTICATION
# ============================================================================

class GoogleAuthView(APIView):
    """
    Vista para autenticación con Google OAuth.
    
    Endpoint: POST /api/v1/auth/google/
    
    Flujo completo:
    1. Frontend obtiene un código de Google (después de que el usuario autoriza)
    2. Frontend envía el código a este endpoint
    3. Backend intercambia el código por tokens de Google
    4. Backend obtiene información del usuario de Google
    5. Backend crea o actualiza el usuario en la base de datos
    6. Backend genera y retorna tokens JWT
    
    Ejemplo de request:
    {
        "code": "4/0AY0e-g7LZ..."
    }
    
    Ejemplo de response (200 OK):
    {
        "access": "eyJhbGciOiJIUzI1NiIs...",
        "refresh": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
            "id": 1,
            "email": "usuario@gmail.com",
            "username": "usuario",
            "first_name": "Juan",
            "last_name": "Perez",
            "role": "client",
            "is_verified": true
        },
        "is_new_user": false
    }
    """
    
    permission_classes = [permissions.AllowAny]  # Cualquiera puede autenticarse con Google
    
    def post(self, request):
        """
        Procesa el código de Google y retorna tokens JWT.
        
        1. Valida que se haya enviado un código
        2. Intercambia el código por información de usuario
        3. Crea/actualiza el usuario en la DB
        4. Genera y retorna tokens JWT
        """
        # Validar que el código esté presente
        serializer = GoogleAuthSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        code = serializer.validated_data['code']
        
        try:
            # Autenticar con Google
            result = GoogleAuthService.authenticate_with_google(code)
            
            # Preparar respuesta con tokens JWT
            response_data = {
                'access': result['tokens']['access'],
                'refresh': result['tokens']['refresh'],
                'user': UserSerializer(result['user']).data,
                'is_new_user': result['is_new_user']
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Capturar cualquier error durante el proceso
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GoogleAuthTestView(APIView):
    """
    Vista de prueba para verificar la configuración de Google OAuth.
    
    Endpoint: GET /api/v1/auth/google/test/
    
    Útil para debugging durante el desarrollo. Verifica que:
    - Las variables de entorno están configuradas
    - Los client IDs y secrets son válidos
    - Las URLs de redirección son correctas
    
    Ejemplo de response (200 OK):
    {
        "message": "Google Auth está configurado correctamente",
        "status": "ready",
        "configuration": {
            "client_id_configured": true,
            "client_secret_configured": true,
            "redirect_uri": "http://localhost:8000/api/v1/auth/google/callback/",
            "frontend_url": "http://localhost:3000"
        },
        "endpoints": {
            "google_auth_url": "/api/v1/auth/google/",
            "allauth_google_login": "/accounts/google/login/"
        }
    }
    """
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """
        Verificar la configuración actual de Google OAuth.
        """
        return Response({
            'message': 'Google Auth está configurado correctamente',
            'status': 'ready',
            'configuration': {
                'client_id_configured': bool(settings.SOCIAL_AUTH_GOOGLE_CLIENT_ID),
                'client_secret_configured': bool(settings.SOCIAL_AUTH_GOOGLE_CLIENT_SECRET),
                'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                'frontend_url': settings.FRONTEND_URL,
            },
            'endpoints': {
                'google_auth_url': '/api/v1/auth/google/',
                'allauth_google_login': '/accounts/google/login/',
            },
            'docs': 'Para usar: POST /api/v1/auth/google/ con {"code": "google_code"}'
        })


# ============================================================================
# 4. LOGOUT (CIERRE DE SESIÓN)
# ============================================================================

class LogoutView(APIView):
    """
    Vista para cerrar sesión y invalidar el refresh token.
    
    Endpoint: POST /api/v1/auth/logout/
    
    Este endpoint añade el refresh token a la blacklist,
    lo que impide que pueda ser usado para generar nuevos access tokens.
    
    Ejemplo de request:
    {
        "refresh": "eyJhbGciOiJIUzI1NiIs..."
    }
    
    Ejemplo de response (205 Reset Content):
    {
        "message": "Sesión cerrada exitosamente"
    }
    
    Nota: Se requiere autenticación con access token válido.
    """
    
    permission_classes = [permissions.IsAuthenticated]  # Requiere estar logueado
    
    def post(self, request):
        """
        Invalida el refresh token y cierra la sesión.
        
        1. Obtiene el refresh token del request
        2. Lo añade a la blacklist
        3. Retorna mensaje de éxito
        """
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Se requiere el refresh token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Añadir token a la blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Sesión cerrada exitosamente'},
                status=status.HTTP_205_RESET_CONTENT
            )
            
        except TokenError:
            return Response(
                {'error': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error al cerrar sesión: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================================
# 5. PERFIL DE USUARIO
# ============================================================================

class MeView(APIView):
    """
    Vista para obtener el perfil del usuario autenticado.
    
    Endpoint: GET /api/v1/auth/me/
    
    Retorna información del usuario incluyendo datos específicos según su rol:
    - Cliente: información del perfil de cliente
    - Profesional: información del perfil profesional (incluyendo aprobación)
    
    Ejemplo de response (200 OK) para CLIENTE:
    {
        "id": 1,
        "email": "cliente@example.com",
        "username": "cliente123",
        "first_name": "Juan",
        "last_name": "Perez",
        "phone_number": "+1234567890",
        "role": "client",
        "is_verified": true,
        "avatar": null,
        "created_at": "2024-01-01T00:00:00Z",
        "client_profile": {
            "address": "Calle Falsa 123",
            "birth_date": "1990-01-01"
        }
    }
    
    Ejemplo de response (200 OK) para PROFESIONAL:
    {
        "id": 2,
        "email": "profesional@example.com",
        "username": "profesional123",
        "role": "professional",
        "professional_profile": {
            "business_name": "Mi Empresa",
            "is_approved": true,
            "rating_avg": "4.5"
        }
    }
    """
    
    permission_classes = [permissions.IsAuthenticated]  # Requiere autenticación
    
    def get(self, request):
        """
        Retorna el perfil completo del usuario autenticado.
        
        1. Obtiene el usuario del request (autenticado)
        2. Serializa los datos base
        3. Añade información específica según el rol
        """
        user = request.user
        
        # Serializar datos base del usuario
        serializer = UserSerializer(user)
        data = serializer.data
        
        # Añadir información según el rol del usuario
        if user.is_professional and hasattr(user, 'professional_profile'):
            # Profesional: añade datos de su perfil profesional
            profile = user.professional_profile
            data['professional_profile'] = {
                'business_name': profile.business_name,
                'description': profile.description,
                'is_approved': profile.is_approved,
                'rating_avg': str(profile.rating_avg),
                'total_reviews': profile.total_reviews,
                'contact_phone': profile.contact_phone,
                'whatsapp_link': profile.whatsapp_link,
            }
        
        elif user.is_client and hasattr(user, 'client_profile'):
            # Cliente: añade datos de su perfil de cliente
            profile = user.client_profile
            data['client_profile'] = {
                'address': profile.address,
                'birth_date': profile.birth_date,
                'favorite_categories_count': profile.favorite_categories.count(),
                'saved_professionals_count': profile.saved_professionals.count(),
            }
        
        # Si es admin, añadir información administrativa
        if user.is_admin:
            data['admin_info'] = {
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_super_admin': user.is_super_admin,
            }
        
        return Response(data)


# ============================================================================
# 6. VERIFICACIÓN DE TOKEN (OPCIONAL - ÚTIL PARA DEBUG)
# ============================================================================

class TokenVerifyView(APIView):
    """
    Vista para verificar si un token JWT es válido.
    
    Endpoint: GET /api/v1/auth/verify/
    
    Útil para frontend para verificar si la sesión aún es válida
    antes de hacer peticiones importantes.
    
    Ejemplo de request:
    Header: Authorization: Bearer <access_token>
    
    Ejemplo de response (200 OK):
    {
        "is_valid": true,
        "user_id": 1,
        "email": "usuario@example.com",
        "role": "client",
        "expires_in": 843  # segundos restantes
    }
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Verifica si el token es válido y retorna información.
        """
        from rest_framework_simplejwt.tokens import AccessToken
        from datetime import datetime
        
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.split(' ')[1] if ' ' in auth_header else None
        
        if not token:
            return Response(
                {'is_valid': False, 'error': 'No token provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            access_token = AccessToken(token)
            
            # Calcular tiempo restante
            now = datetime.now().timestamp()
            expires_in = int(access_token.payload['exp'] - now)
            
            return Response({
                'is_valid': True,
                'user_id': access_token.payload.get('user_id'),
                'email': access_token.payload.get('email'),
                'role': access_token.payload.get('role'),
                'expires_in': max(0, expires_in),
            })
            
        except Exception:
            return Response(
                {'is_valid': False, 'error': 'Token inválido o expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )