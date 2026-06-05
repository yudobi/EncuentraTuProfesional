# backend/apps/accounts/utils/google_auth.py
import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.models import User, ClientProfile

class GoogleAuthService:
    #Servicio para manejar autenticación con Google
    
    @staticmethod
    def get_google_tokens(code):
        #Intercambiar código por tokens de Google
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            'code': code,
            'client_id': settings.SOCIAL_AUTH_GOOGLE_CLIENT_ID,
            'client_secret': settings.SOCIAL_AUTH_GOOGLE_CLIENT_SECRET,
            'redirect_uri': settings.GOOGLE_REDIRECT_URI,
            'grant_type': 'authorization_code',
        }
        
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def get_google_user_info(access_token):
        #Obtener información del usuario de Google
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(user_info_url, headers=headers)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def create_or_update_user(google_user_data):
        #Crear o actualizar usuario con datos de Google
        email = google_user_data.get('email')
        google_id = google_user_data.get('id')
        
        if not email:
            raise ValueError("No se pudo obtener el email de Google")
        
        # Buscar usuario por google_id o email
        user = User.objects.filter(google_id=google_id).first()
        if not user:
            user = User.objects.filter(email=email).first()
        
        if user:
            # Actualizar usuario existente
            user.google_id = google_id or user.google_id
            user.first_name = google_user_data.get('given_name', user.first_name)
            user.last_name = google_user_data.get('family_name', user.last_name)
            user.is_verified = True
            user.auth_provider = 'google'
            user.save()
            created = False
        else:
            # Crear nuevo usuario
            username_base = email.split('@')[0]
            username = username_base
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{username_base}_{counter}"
                counter += 1
            
            user = User.objects.create(
                email=email,
                username=username,
                first_name=google_user_data.get('given_name', ''),
                last_name=google_user_data.get('family_name', ''),
                google_id=google_id,
                is_verified=True,
                auth_provider='google',
                role=User.Role.CLIENT,  # Rol por defecto
                phone_number=None,  # Se pedirá después si es necesario
            )
            
            # Crear perfil de cliente
            ClientProfile.objects.create(user=user)
            created = True
        
        return user, created
    
    @staticmethod
    def generate_jwt_tokens(user):
        #Generar tokens JWT para el usuario
        refresh = RefreshToken.for_user(user)
        
        # Añadir claims personalizados
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['is_verified'] = user.is_verified
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    
    @classmethod
    def authenticate_with_google(cls, code):
        #Flujo completo de autenticación con Google
        try:
            # 1. Obtener tokens de Google
            tokens = cls.get_google_tokens(code)
            access_token = tokens.get('access_token')
            
            if not access_token:
                raise ValueError("No se obtuvo access_token de Google")
            
            # 2. Obtener información del usuario
            user_info = cls.get_google_user_info(access_token)
            
            # 3. Crear o actualizar usuario
            user, is_new = cls.create_or_update_user(user_info)
            
            # 4. Generar JWT
            jwt_tokens = cls.generate_jwt_tokens(user)
            
            return {
                'user': user,
                'tokens': jwt_tokens,
                'is_new_user': is_new
            }
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error al comunicarse con Google: {str(e)}")
        except Exception as e:
            raise Exception(f"Error en autenticación: {str(e)}")
