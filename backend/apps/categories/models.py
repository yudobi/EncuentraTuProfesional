from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Categoría de servicios (plomería, electricidad, limpieza, etc.).

    Cada categoría agrupa a los perfiles profesionales que ofrecen ese tipo
    de servicio. El frontend (client/src/types/index.ts -> interface Category)
    espera: id, name, icon, count, hero.

    - `icon`  : nombre del icono que renderiza el front (CategoryIconName).
    - `hero`  : imagen/encabezado de la categoría.
    - `count` : NO se almacena; se deriva del número de profesionales
                aprobados y se expone en el serializer (Fase 1).
    """

    class Icon(models.TextChoices):
        WRENCH = 'wrench', 'Llave'
        BOLT = 'bolt', 'Tornillo'
        BROOM = 'broom', 'Escoba'
        BRUSH = 'brush', 'Brocha'
        HAMMER = 'hammer', 'Martillo'
        LEAF = 'leaf', 'Hoja'
        TRUCK = 'truck', 'Camión'
        SNOW = 'snow', 'Nieve'
        KEY = 'key', 'Llave (cerrajería)'
        CHIP = 'chip', 'Chip'
        SCISSORS = 'scissors', 'Tijeras'
        BOOK = 'book', 'Libro'

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=20, choices=Icon.choices, default=Icon.WRENCH)
    hero = models.CharField(
        max_length=500,
        blank=True,
        help_text='URL o ruta de la imagen de encabezado de la categoría.',
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text='Orden de aparición.')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
