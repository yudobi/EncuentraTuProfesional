from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Room (models.Model):
    name = models.CharField(max_length=100,unique=True,verbose_name="Nombre")
    users= models.ManyToManyField(User, related_name='rooms_joined', blank=True, verbose_name="Usuarios")

    def __str__(self):
        return self.name

    #cada vez que una empresa se registre, se le asignará automáticamente un chat privado con el nombre de la empresa, y solo esa empresa tendrá acceso a ese chat. Esto se puede lograr utilizando señales de Django para crear una instancia de Room cada vez que se cree un nuevo usuario (empresa) y asignarle el nombre del usuario como nombre del chat.
    #cada chat de la empresa tendrá su propio id, cada usuario (sea la empresa  no), solo podrá acceder a sus chats