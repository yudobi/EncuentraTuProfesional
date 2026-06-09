"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse #para implementar la json response

# Vista simple para home, para cargar urls
def home(request):
    return JsonResponse({
        'message': 'Bienvenido a ServiceHub API',
        'version': '1.0',
        'endpoints': [
            '/admin/',
            '/accounts/',
            '/orders/',
            '/chat/',
        ]
    })
#////////////////////////////////////////////////////////////////////////////////////
urlpatterns = [
    path('admin/', admin.site.urls),
    # Endpoints para JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
   # agregado paraa ejecutar runserver y probar que se cargan las urls
    path('', home, name='home'),  # API root
    #path('api/accounts/', include('apps.accounts.urls')),
    #path('api/orders/', include('apps.orders.urls')),
    
    path('chat/', include('apps.chat.urls')),#path(url,dirección de la url de la aplicación)
  #/////////////////////////////////////////////

]

# Servir archivos estáticos y de media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
