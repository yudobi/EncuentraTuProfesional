from django.shortcuts import render
from .models import Room

from django.contrib.auth.decorators import login_required #esto se usrá para no permitir vista sin registro
# Create your views here.

#@login_required #imposibilita entrar sin logearse
#  """Vista principal del chat - Muestra todas las conversaciones"""
def chat_dashboard(request):  #poner los diferentes servicios como rooms donde estén todos
    # try: #primero trata de entrar
        rooms=Room.objects.all()  # Obtener todas las salas de chat
        return render (request, 'chat/dashboard.html', {'rooms': rooms})

    
@login_required #imposibilita entrar sin logearse
def chat_room(request, room_id): #obtener room id
 #   """Vista para una sala de chat específica"""
    try: #primero trata de entrar
        room=request.user.rooms_joined.get(id=room_id) #le da a room el id de la room
    except Room.DoesNotExist: #se activa si no puede entrar y la room no existe    
        error_message='sin permiso de acceso al chat'
        return render (request, 'chat/dashboard.html', {'error_message': error_message, 'rooms':  Room.objects.all()})
    return render (request, 'chat/room.html', {'room': room})




  #  return render(request, 'chat/room.html', {'room_id': room_id})

#def chat_send_message(request):
 #   """API para enviar mensajes"""
 #   return JsonResponse({'status': 'message sent'})

#def chat_get_messages(request, room_id):
   # """API para obtener mensajes de una sala"""
  #  return JsonResponse({'messages': []})