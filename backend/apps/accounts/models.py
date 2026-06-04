from django.db import models

# Create your models here.
# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Modelo único de usuario con roles"""
    
    class Role(models.TextChoices):
        CLIENT = 'client', 'Cliente'
        PROFESSIONAL = 'professional', 'Profesional'
        ADMIN = 'admin', 'Administrador'
        SUPER_ADMIN = 'super_admin', 'Super Administrador'
    
    # Campos específicos para todos los usuarios
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    auth_provider = models.CharField(
        max_length=50, 
        choices=[('email', 'Email'), ('google', 'Google'), ('facebook', 'Facebook')],
        default='email'
    )
    
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    is_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Preferencias
    receive_email_notifications = models.BooleanField(default=True)
    receive_sms_notifications = models.BooleanField(default=True)


    groups = models.ManyToManyField(
        'auth.Group',
        related_name='accounts_user_set',  # Cambia esto
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
        )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='accounts_user_set',  # Cambia esto
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    USERNAME_FIELD = 'email'  # Usar email como identificador principal
    REQUIRED_FIELDS = ['username', 'phone_number']  # Campos requeridos al crear superuser
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role in [self.Role.ADMIN, self.Role.SUPER_ADMIN]
    
    @property
    def is_super_admin(self):
        return self.role == self.Role.SUPER_ADMIN
    
    @property
    def is_professional(self):
        return self.role == self.Role.PROFESSIONAL
    
    @property
    def is_client(self):
        return self.role == self.Role.CLIENT


# Perfiles específicos (relación 1 a 1 con User)
class ClientProfile(models.Model):
    """Información específica del cliente"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    favorite_categories = models.ManyToManyField('Category', blank=True)
    saved_professionals = models.ManyToManyField('ProfessionalProfile', blank=True)
    address = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'client_profiles'


class ProfessionalProfile(models.Model):
    """Información específica del profesional"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='professional_profile')
    
    # Datos profesionales
    business_name = models.CharField(max_length=200)
    description = models.TextField()
    categories = models.ManyToManyField('Category', related_name='professionals')
    
    # Contacto público
    contact_phone = models.CharField(max_length=15)
    contact_email_public = models.EmailField()
    whatsapp_link = models.URLField(blank=True)
    
    # Control de aprobación
    is_approved = models.BooleanField(default=False)
    approval_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('approved', 'Aprobado'),
            ('rejected', 'Rechazado'),
            ('changes_requested', 'Cambios solicitados')
        ],
        default='pending'
    )
    approval_notes = models.TextField(blank=True)
    
    # Métricas
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    total_services_completed = models.PositiveIntegerField(default=0)
    
    # Portfolio
    cover_image = models.ImageField(upload_to='professionals/covers/', null=True, blank=True)
    
    class Meta:
        db_table = 'professional_profiles'
        indexes = [
            models.Index(fields=['is_approved', 'rating_avg']),
        ]
    
    def __str__(self):
        return f"{self.business_name} ({self.user.email})"
    


class Category(models.Model):
    """Categorías de servicios"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Para íconos CSS/fa
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name    