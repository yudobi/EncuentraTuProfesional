# backend/apps/accounts/serializers.py
"""
Serializers para la gestión de usuarios y autenticación.

Los serializers son responsables de:
- Validar los datos de entrada (request)
- Convertir objetos Python a JSON (response)
- Convertir JSON a objetos Python (request)
- Manejar la creación y actualización de instancias
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from django.contrib.auth import authenticate
from .models import User, ClientProfile, ProfessionalProfile


# ============================================================================
# 1. SERIALIZER BÁSICO DE USUARIO (para respuestas)
# ============================================================================

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer básico para mostrar información de usuario.
    
    Este serializer se usa para respuestas públicas donde no queremos
    exponer información sensible como contraseñas.
    
    Campos incluidos:
    - id: Identificador único
    - email: Correo electrónico (único)
    - username: Nombre de usuario
    - first_name: Nombre
    - last_name: Apellido
    - phone_number: Teléfono
    - role: Rol del usuario (client, professional, admin, super_admin)
    - is_verified: Si el email está verificado
    - avatar: Foto de perfil
    - created_at: Fecha de registro
    """
    
    class Meta:
        model = User
        fields = (
            'id', 
            'email', 
            'username', 
            'first_name', 
            'last_name',
            'phone_number', 
            'role', 
            'is_verified', 
            'avatar', 
            'created_at'
        )
        read_only_fields = ('id', 'is_verified', 'created_at')  # Solo lectura


# ============================================================================
# 2. SERIALIZER DE REGISTRO DE USUARIO
# ============================================================================

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.
    
    Este serializer maneja la validación y creación de usuarios nuevos.
    Incluye campos adicionales como password2 para confirmación.
    
    Validaciones que realiza:
    1. Las contraseñas deben coincidir
    2. El email debe ser único
    3. El username debe ser único
    4. El teléfono debe ser único
    5. La contraseña debe cumplir requisitos de seguridad
    """
    
    # Campo de contraseña (solo escritura, no se devuelve en respuestas)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],  # Validación de seguridad de Django
        help_text="Contraseña del usuario. Debe ser segura."
    )
    
    # Confirmación de contraseña (solo escritura)
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirmación de la contraseña. Debe coincidir con password."
    )
    
    # Validación personalizada para número de teléfono (formato internacional)
    phone_number = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="El número de teléfono debe tener entre 9 y 15 dígitos y puede incluir + al inicio."
            )
        ],
        help_text="Número de teléfono en formato internacional (ej: +1234567890)"
    )
    
    # Campo opcional (no requerido para registro)
    role = serializers.ChoiceField(
        choices=User.Role.choices,
        default=User.Role.CLIENT,
        required=False,
        help_text="Rol del usuario. Por defecto es 'client'."
    )
    
    class Meta:
        model = User
        fields = (
            'email', 
            'username', 
            'password', 
            'password2', 
            'phone_number',
            'first_name', 
            'last_name', 
            'role'
        )
        extra_kwargs = {
            'first_name': {'required': False, 'help_text': 'Nombre del usuario (opcional)'},
            'last_name': {'required': False, 'help_text': 'Apellido del usuario (opcional)'},
        }
    
    def validate(self, attrs):
        """
        Validación a nivel de objeto (usa múltiples campos).
        
        Verifica que:
        1. Las contraseñas coincidan
        2. El email sea único
        3. El username sea único
        4. El teléfono sea único
        """
        # Validar que las contraseñas coincidan
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Las contraseñas no coinciden."}
            )
        
        # Validar email único
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "Este correo electrónico ya está registrado."}
            )
        
        # Validar username único
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError(
                {"username": "Este nombre de usuario ya está en uso."}
            )
        
        # Validar teléfono único
        if User.objects.filter(phone_number=attrs['phone_number']).exists():
            raise serializers.ValidationError(
                {"phone_number": "Este número de teléfono ya está registrado."}
            )
        
        return attrs
    
    def create(self, validated_data):
        """
        Crea un nuevo usuario con los datos validados.
        
        Pasos:
        1. Eliminar password2 (no se guarda en DB)
        2. Extraer password
        3. Crear usuario con los demás campos
        4. Hashear y guardar contraseña
        5. Crear perfil de cliente por defecto
        """
        # Eliminar password2 (no es un campo del modelo)
        validated_data.pop('password2')
        
        # Extraer password
        password = validated_data.pop('password')
        
        # Crear usuario (aún sin contraseña hasheada)
        user = User(**validated_data)
        
        # Hashear y asignar contraseña
        user.set_password(password)
        
        # Por defecto, los usuarios registrados así no están verificados
        user.is_verified = False
        
        # Guardar usuario
        user.save()
        
        # Crear perfil de cliente por defecto (todos los usuarios empiezan como clientes)
        ClientProfile.objects.create(user=user)
        
        return user


# ============================================================================
# 3. SERIALIZER DE LOGIN
# ============================================================================

class LoginSerializer(serializers.Serializer):
    """
    Serializer para el login de usuarios.
    
    Este no es un ModelSerializer porque no guarda datos,
    solo valida las credenciales de entrada.
    
    Campos:
    - email: Correo electrónico del usuario
    - password: Contraseña del usuario
    """
    
    email = serializers.EmailField(
        required=True,
        help_text="Correo electrónico registrado"
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Contraseña del usuario"
    )
    
    def validate(self, attrs):
        """
        Valida las credenciales del usuario.
        
        1. Autentica con email y password
        2. Verifica que el usuario esté activo
        3. Retorna el usuario autenticado
        """
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Autenticar usuario
        user = authenticate(
            request=self.context.get('request'),
            username=email,  # Usamos email como username
            password=password
        )
        
        if not user:
            raise serializers.ValidationError(
                "Credenciales inválidas. Verifica tu email y contraseña."
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                "Esta cuenta está desactivada. Contacta al administrador."
            )
        
        # Añadir el usuario autenticado a los datos validados
        attrs['user'] = user
        return attrs


# ============================================================================
# 4. SERIALIZER DE GOOGLE OAUTH
# ============================================================================

class GoogleAuthSerializer(serializers.Serializer):
    """
    Serializer para autenticación con Google OAuth.
    
    Valida que se haya recibido el código de autorización de Google.
    
    Campo:
    - code: Código de autorización de Google (obtenido después del login)
    """
    
    code = serializers.CharField(
        required=True,
        help_text="Código de autorización de Google obtenido después del OAuth flow"
    )
    
    def validate_code(self, value):
        """
        Validación específica para el campo 'code'.
        
        Verifica que el código no esté vacío.
        """
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError(
                "El código de autorización es requerido."
            )
        return value


# ============================================================================
# 5. SERIALIZER DE RESPUESTA DE TOKENS JWT
# ============================================================================

class TokenResponseSerializer(serializers.Serializer):
    """
    Serializer para la respuesta de tokens JWT.
    
    Este serializer define la estructura de respuesta después de
    un login exitoso o registro.
    
    Campos:
    - access: Access token (corto plazo, para autenticación)
    - refresh: Refresh token (largo plazo, para obtener nuevos access tokens)
    - user: Información del usuario autenticado
    """
    
    access = serializers.CharField(
        help_text="Token JWT de acceso. Usar en header: Authorization: Bearer <token>"
    )
    refresh = serializers.CharField(
        help_text="Token JWT de refresh. Guardar en localStorage para renovar sesión"
    )
    user = UserSerializer(
        help_text="Información básica del usuario autenticado"
    )
    
    # Campos opcionales
    is_new_user = serializers.BooleanField(
        required=False,
        help_text="Indica si el usuario fue creado recientemente (útil para onboarding)"
    )


# ============================================================================
# 6. SERIALIZER DE CAMBIO DE CONTRASEÑA
# ============================================================================

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para cambiar la contraseña de un usuario autenticado.
    
    Campos:
    - old_password: Contraseña actual
    - new_password: Nueva contraseña
    - new_password2: Confirmación de la nueva contraseña
    
    Validaciones:
    1. La contraseña actual debe ser correcta
    2. Las nuevas contraseñas deben coincidir
    3. La nueva contraseña debe cumplir requisitos de seguridad
    """
    
    old_password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Contraseña actual del usuario"
    )
    
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        help_text="Nueva contraseña (debe ser segura)"
    )
    
    new_password2 = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirmación de la nueva contraseña"
    )
    
    def validate(self, attrs):
        """
        Valida que las nuevas contraseñas coincidan.
        """
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Las nuevas contraseñas no coinciden."}
            )
        return attrs
    
    def validate_old_password(self, value):
        """
        Valida que la contraseña actual sea correcta.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value


# ============================================================================
# 7. SERIALIZER DE RESTABLECIMIENTO DE CONTRASEÑA (OLVIDÉ MI CONTRASEÑA)
# ============================================================================

class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para solicitar restablecimiento de contraseña.
    
    Envía un email con un enlace para restablecer la contraseña.
    
    Campo:
    - email: Correo del usuario que olvidó su contraseña
    """
    
    email = serializers.EmailField(
        required=True,
        help_text="Correo electrónico registrado"
    )
    
    def validate_email(self, value):
        """
        Valida que el email exista en la base de datos.
        """
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "No existe un usuario con este correo electrónico."
            )
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmar el restablecimiento de contraseña.
    
    Este serializer se usa cuando el usuario hace clic en el enlace
    del email y establece una nueva contraseña.
    
    Campos:
    - uid: ID del usuario (encriptado)
    - token: Token único para restablecer
    - new_password: Nueva contraseña
    - new_password2: Confirmación de la nueva contraseña
    """
    
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, attrs):
        """
        Valida que las nuevas contraseñas coincidan.
        """
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Las nuevas contraseñas no coinciden."}
            )
        return attrs


# ============================================================================
# 8. SERIALIZER DE PERFIL DE CLIENTE
# ============================================================================

class ClientProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil específico de clientes.
    
    Campos adicionales que solo tienen los clientes.
    """
    
    class Meta:
        model = ClientProfile
        fields = (
            'address',
            'birth_date',
            'favorite_categories',
            'saved_professionals'
        )
        read_only_fields = ('favorite_categories', 'saved_professionals')
    
    # Representación más amigable de relaciones
    favorite_categories_count = serializers.SerializerMethodField()
    saved_professionals_count = serializers.SerializerMethodField()
    
    def get_favorite_categories_count(self, obj):
        """Cantidad de categorías favoritas."""
        return obj.favorite_categories.count()
    
    def get_saved_professionals_count(self, obj):
        """Cantidad de profesionales guardados."""
        return obj.saved_professionals.count()


# ============================================================================
# 9. SERIALIZER DE PERFIL DE PROFESIONAL
# ============================================================================

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil específico de profesionales.
    
    Campos adicionales que solo tienen los profesionales.
    """
    
    class Meta:
        model = ProfessionalProfile
        fields = (
            'business_name',
            'description',
            'contact_phone',
            'contact_email_public',
            'whatsapp_link',
            'is_approved',
            'rating_avg',
            'total_reviews',
            'cover_image'
        )
        read_only_fields = ('is_approved', 'rating_avg', 'total_reviews')
    
    # Validación personalizada para campos específicos
    def validate_business_name(self, value):
        """Valida que el nombre del negocio no sea muy corto."""
        if len(value) < 3:
            raise serializers.ValidationError(
                "El nombre del negocio debe tener al menos 3 caracteres."
            )
        return value
    
    def validate_whatsapp_link(self, value):
        """Valida que el link de WhatsApp sea válido."""
        if value and not value.startswith('https://wa.me/'):
            raise serializers.ValidationError(
                "El link de WhatsApp debe tener el formato: https://wa.me/NUMERO"
            )
        return value


# ============================================================================
# 10. SERIALIZER DE ACTUALIZACIÓN DE PERFIL (USUARIO COMPLETO)
# ============================================================================

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar el perfil del usuario.
    
    Permite actualizar campos como nombre, teléfono, etc.
    No permite cambiar email, username o role por seguridad.
    """
    
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'phone_number',
            'avatar'
        )
    
    def validate_phone_number(self, value):
        """Valida formato de teléfono."""
        import re
        pattern = r'^\+?1?\d{9,15}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Formato de teléfono inválido. Usa formato internacional: +1234567890"
            )
        
        # Verificar que no esté en uso por otro usuario
        if User.objects.exclude(id=self.instance.id).filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "Este número de teléfono ya está registrado."
            )
        
        return value


# ============================================================================
# EJEMPLOS DE USO DE LOS SERIALIZERS
# ============================================================================

"""
Ejemplo 1: Registrar un nuevo usuario
-------------------------------------
data = {
    "email": "juan@example.com",
    "username": "juan123",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "phone_number": "+1234567890",
    "first_name": "Juan",
    "last_name": "Perez"
}
serializer = UserRegistrationSerializer(data=data)
if serializer.is_valid():
    user = serializer.save()
    
Ejemplo 2: Login
----------------
data = {
    "email": "juan@example.com",
    "password": "SecurePass123!"
}
serializer = LoginSerializer(data=data)
if serializer.is_valid():
    user = serializer.validated_data['user']
    
Ejemplo 3: Google Auth
----------------------
data = {"code": "4/0AY0e-g7LZ..."}
serializer = GoogleAuthSerializer(data=data)
if serializer.is_valid():
    code = serializer.validated_data['code']
    
Ejemplo 4: Cambiar contraseña
-----------------------------
data = {
    "old_password": "OldPass123!",
    "new_password": "NewPass456!",
    "new_password2": "NewPass456!"
}
serializer = ChangePasswordSerializer(data=data, context={'request': request})
if serializer.is_valid():
    # Cambiar contraseña
    request.user.set_password(data['new_password'])
    request.user.save()
"""