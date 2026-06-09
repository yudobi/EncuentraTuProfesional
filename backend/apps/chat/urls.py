from django.urls import path
from .views import chat_dashboard,chat_room #importamos funciones del view

urlpatterns = [

path('', chat_dashboard, name='chat_dashboard'), #cuando se acceda a la url vacía (""), se mostrará la vista chat_dashboard y se le asigna el nombre "chat_dashboard" para referenciarla en otras partes del código
path('room/<int:room_id>/', chat_room, name='room'), #cuando se acceda a la url chat/room, se mostrará chat_room 
]