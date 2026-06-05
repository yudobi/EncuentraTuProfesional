"""
Seed del catálogo público (Fase 1).

Crea las 12 categorías y 6 profesionales de muestra (espejo de
client/src/data/mocks.ts) para poder validar la integración end-to-end.

Uso:
    python manage.py seed_catalog

Es idempotente: re-ejecutarlo no duplica datos.
"""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import ProfessionalProfile
from apps.categories.models import Category
from apps.orders.models import Order
from apps.reviews.models import Review, recalc_professional_rating

User = get_user_model()

DEMO_ORDER_NUMBER = 'LS-DEMO01'


CATEGORIES = [
    ('Plomería', 'wrench', 'Fugas, calentadores, instalaciones'),
    ('Electricidad', 'bolt', 'Tableros, cortocircuitos, domótica'),
    ('Limpieza', 'broom', 'Hogar, oficina, post-obra'),
    ('Pintura', 'brush', 'Interior, exterior, decorativa'),
    ('Carpintería', 'hammer', 'Muebles a medida, reparación'),
    ('Jardinería', 'leaf', 'Mantenimiento, paisajismo'),
    ('Mudanzas', 'truck', 'Local, larga distancia, embalaje'),
    ('Climatización', 'snow', 'Aire, calefacción, instalación'),
    ('Cerrajería', 'key', 'Cambio de cerraduras, urgencias'),
    ('Tecnología', 'chip', 'PC, redes, smart home'),
    ('Belleza', 'scissors', 'Peluquería y estética a domicilio'),
    ('Tutorías', 'book', 'Clases particulares, idiomas'),
]

# slug de categoría -> derivado por slugify del nombre
PROFESSIONALS = [
    dict(
        email='marcos.rivera@example.com', first='Marcos', last='Rivera',
        handle='@marcos.rivera', category='plomeria',
        headline='Plomero certificado · 12 años', location='Madrid, Centro',
        years=12, rating='4.92', reviews=218, jobs=1402, response=12,
        verified=True, top=True, price='35', whatsapp=True, phone=True,
        bio='Especialista en fugas complejas y rehabilitación de baños completos. '
            'Diagnóstico el mismo día con cámara endoscópica.',
        skills=['Detección de fugas', 'Calentadores', 'Sanitarios', 'Tuberías PEX', 'Urgencias 24h'],
        gallery=['work_01', 'work_02', 'work_03', 'work_04', 'work_05', 'work_06'],
        schedule=['Lun–Sáb · 8:00–20:00'],
    ),
    dict(
        email='lucia.vega@example.com', first='Lucía', last='Vega',
        handle='@lucia.electric', category='electricidad',
        headline='Electricista industrial', location='Barcelona, Eixample',
        years=9, rating='4.88', reviews=156, jobs=920, response=8,
        verified=True, top=False, price='42', whatsapp=True, phone=False,
        bio='Certificada en baja tensión. Foco en domótica, tableros y revisiones para alquiler.',
        skills=['Tableros', 'Domótica KNX', 'Iluminación LED', 'Boletines', 'Revisiones'],
        gallery=['work_01', 'work_02', 'work_03', 'work_04'],
        schedule=['Lun–Vie · 9:00–18:00'],
    ),
    dict(
        email='andrea.cortes@example.com', first='Andrea', last='Cortés',
        handle='@andrea.clean', category='limpieza',
        headline='Limpieza profunda y post-obra', location='Valencia, Ruzafa',
        years=7, rating='4.95', reviews=412, jobs=2010, response=5,
        verified=True, top=True, price='22', whatsapp=True, phone=True,
        bio='Equipo de 3 personas. Productos eco. Disponibilidad para emergencias post-obra.',
        skills=['Post-obra', 'Cristales', 'Tapicería', 'Productos eco'],
        gallery=['work_01', 'work_02', 'work_03', 'work_04', 'work_05'],
        schedule=['Lun–Dom · 7:00–22:00'],
    ),
    dict(
        email='diego.talavera@example.com', first='Diego', last='Talavera',
        handle='@diego.paint', category='pintura',
        headline='Pintor decorativo', location='Sevilla, Triana',
        years=6, rating='4.79', reviews=87, jobs=340, response=22,
        verified=True, top=False, price='14', whatsapp=True, phone=True,
        bio='Acabados de gama alta, estuco, microcemento y técnicas decorativas. Presupuesto en 24h.',
        skills=['Estuco', 'Microcemento', 'Esmaltes', 'Restauración'],
        gallery=['work_01', 'work_02', 'work_03'],
        schedule=['Lun–Vie · 8:00–17:00'],
    ),
    dict(
        email='sofia.prieto@example.com', first='Sofía', last='Prieto',
        handle='@sofia.wood', category='carpinteria',
        headline='Carpintera a medida', location='Bilbao, Indautxu',
        years=10, rating='4.86', reviews=134, jobs=280, response=35,
        verified=True, top=False, price='55', whatsapp=False, phone=True,
        bio='Mobiliario a medida, vestidores y cocinas. Trabajo con maderas certificadas FSC.',
        skills=['Vestidores', 'Cocinas', 'Maderas FSC', 'Restauración'],
        gallery=['work_01', 'work_02', 'work_03', 'work_04'],
        schedule=['Lun–Vie · 8:00–16:00'],
    ),
    dict(
        email='javier.kim@example.com', first='Javier', last='Kim',
        handle='@javi.cool', category='climatizacion',
        headline='Climatización residencial', location='Málaga, Centro',
        years=5, rating='4.71', reviews=64, jobs=190, response=18,
        verified=False, top=False, price='60', whatsapp=True, phone=True,
        bio='Instalación y mantenimiento de aire acondicionado. Garantía oficial.',
        skills=['Aire acondicionado', 'Bombas de calor', 'Mantenimiento'],
        gallery=['work_01', 'work_02'],
        schedule=['Lun–Sáb · 9:00–19:00'],
    ),
]


class Command(BaseCommand):
    help = 'Crea categorías y profesionales de muestra para el catálogo (Fase 1).'

    @transaction.atomic
    def handle(self, *args, **options):
        cats_by_slug = {}
        created_cats = 0
        for order, (name, icon, hero) in enumerate(CATEGORIES):
            cat, created = Category.objects.get_or_create(
                name=name,
                defaults={'icon': icon, 'hero': hero, 'order': order},
            )
            cats_by_slug[cat.slug] = cat
            created_cats += int(created)
        self.stdout.write(self.style.SUCCESS(
            f'Categorías: {created_cats} creadas, {len(CATEGORIES) - created_cats} ya existían.'
        ))

        created_pros = 0
        for p in PROFESSIONALS:
            user, _ = User.objects.get_or_create(
                email=p['email'],
                defaults={
                    'username': p['email'].split('@')[0],
                    'first_name': p['first'],
                    'last_name': p['last'],
                    'role': User.Role.PROFESSIONAL,
                    'is_verified': p['verified'],
                    'phone_number': None,
                },
            )

            category = cats_by_slug.get(p['category'])
            profile, created = ProfessionalProfile.objects.update_or_create(
                user=user,
                defaults={
                    'business_name': f"{p['first']} {p['last']}",
                    'description': p['bio'],
                    'headline': p['headline'],
                    'location': p['location'],
                    'handle': p['handle'],
                    'years_experience': p['years'],
                    'price_from': Decimal(p['price']),
                    'response_time_min': p['response'],
                    'is_top_pro': p['top'],
                    'contact_phone': '+34600000000' if p['phone'] else '',
                    'contact_email_public': p['email'],
                    'whatsapp_link': 'https://wa.me/34600000000' if p['whatsapp'] else '',
                    'is_approved': True,
                    'approval_status': 'approved',
                    'rating_avg': Decimal(p['rating']),
                    'total_reviews': p['reviews'],
                    'total_services_completed': p['jobs'],
                    'skills': p['skills'],
                    'schedule': p['schedule'],
                    'gallery': p['gallery'],
                },
            )
            if category:
                profile.categories.set([category])
            created_pros += int(created)

        self.stdout.write(self.style.SUCCESS(
            f'Profesionales: {created_pros} creados, {len(PROFESSIONALS) - created_pros} actualizados.'
        ))

        # --- Cliente demo + orden de muestra (para Order.tsx) ---
        client, _ = User.objects.get_or_create(
            email='cliente.demo@example.com',
            defaults={
                'username': 'cliente.demo',
                'first_name': 'Carla',
                'last_name': 'Méndez',
                'role': User.Role.CLIENT,
                'is_verified': True,
                'phone_number': None,
            },
        )
        marcos = ProfessionalProfile.objects.filter(handle='@marcos.rivera').first()
        if marcos:
            order, created_order = Order.objects.get_or_create(
                order_number=DEMO_ORDER_NUMBER,
                defaults={
                    'client': client,
                    'professional': marcos,
                    'category': cats_by_slug.get('plomeria'),
                    'service_title': 'Diagnóstico de fuga',
                    'description': 'Fuga en pared bajo el lavabo del baño.',
                    'location': 'Calle Goya 34, 4º B · Madrid, Centro',
                    'agreed_price': Decimal('35'),
                    'status': Order.Status.COMPLETED,
                    'source': Order.Source.CHAT,
                },
            )
            self.stdout.write(self.style.SUCCESS(
                f"Orden demo {DEMO_ORDER_NUMBER}: {'creada' if created_order else 'ya existía'}."
            ))

            # Reseña demo sobre la orden completada
            review, created_review = Review.objects.get_or_create(
                order=order,
                defaults={
                    'client': client,
                    'professional': marcos,
                    'rating': 5,
                    'text': 'Marcos detectó la fuga en 20 minutos. Dejó todo limpio y el '
                            'precio fue exactamente el del presupuesto. Volvería sin dudar.',
                    'pro_reply': 'Gracias Carla, fue un placer ayudarte.',
                },
            )
            if created_review:
                recalc_professional_rating(marcos)
            self.stdout.write(self.style.SUCCESS(
                f"Reseña demo: {'creada' if created_review else 'ya existía'}."
            ))

        # --- Admin demo ---
        admin_user, created_admin = User.objects.get_or_create(
            email='elena.admin@example.com',
            defaults={
                'username': 'elena.admin',
                'first_name': 'Elena',
                'last_name': 'Ruiz',
                'role': User.Role.ADMIN,
                'is_verified': True,
                'is_staff': True,
                'phone_number': None,
            },
        )
        self.stdout.write(self.style.SUCCESS(
            f"Admin demo elena.admin@example.com: {'creado' if created_admin else 'ya existía'}."
        ))

        # --- Profesionales pendientes de validación ---
        pending = [
            ('pablo.estevez@example.com', 'Pablo', 'Estévez', 'cerrajeria', 'Cerrajero · urgencias 24h'),
            ('ines.soler@example.com', 'Inés', 'Soler', 'limpieza', 'Limpieza de hogar y oficinas'),
        ]
        created_pending = 0
        for email, first, last, cat_slug, headline in pending:
            u, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first, 'last_name': last,
                    'role': User.Role.PROFESSIONAL, 'is_verified': False,
                    'phone_number': None,
                },
            )
            profile, created_p = ProfessionalProfile.objects.update_or_create(
                user=u,
                defaults={
                    'business_name': f'{first} {last}',
                    'description': 'Perfil en proceso de validación.',
                    'headline': headline,
                    'contact_phone': '+34600111222',
                    'contact_email_public': email,
                    'is_approved': False,
                    'approval_status': 'pending',
                },
            )
            cat = cats_by_slug.get(cat_slug)
            if cat:
                profile.categories.set([cat])
            created_pending += int(created_p)
        self.stdout.write(self.style.SUCCESS(
            f'Profesionales pendientes: {created_pending} creados.'
        ))

        self.stdout.write(self.style.SUCCESS('Seed del catálogo completado.'))
