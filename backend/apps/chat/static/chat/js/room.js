//console.log('se cargo correctamente el.js');
//se trabaja acá para no trabajar en el room.html

window.onload = function() { //se activa la función al cargar la ventana

    ////////////////////////////////////////////////////
    document.querySelector('#sendButton').addEventListener('click', enviar_mensaje);
         
    //# para el id del boton de enviar mensaje en room.html de chat/templates
    // se crea funcion: enviar mensaje que se activa si se clickea el boton enviar
    ////////////////////////////////////////////////////////

    
    /////////////////////////////////////////////////////////////////////////////////
    document.querySelector('#input_message').addEventListener('keypress', function(e) {
        //# para el id del boton de input_message en room.html de chat/templates
        // se crea funcion: enviar mensaje que se activa si se presiona la tecla enter
        if (e.key == 'Enter') { 
            //si la tecla pasada como parámetro a la function es enter, nos lleva a la function enviar_mensaje
            enviar_mensaje()
        }
     });
    ///////////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////
    function enviar_mensaje() {
       //para seleccipnar objeto en un archivo y el . algo para tomar la propiedad algo
        var message = document.querySelector('#input_message'); //se guarda el mensaje escrito en la variable message
        //console.log(message.value.trim()); //se muestra el mensaje en la consola para verificar que se guarda correctamente
        
        loadMessagehtm(message. value.trim()) //función para cargar mensajes escritos en el htmml

        if (message.value.trim() != ' ' ) { //si el mensaje no está vacío, se ejecuta el siguiente código
            message.value='' //se borra el mensaje del input después de enviarlo
    }

    }
    /////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    //function para desplegar en pantalla los mensaje
    function loadMessagehtm(m){
        document.querySelector('#boxMessage').innerHTML += //los div hacen que aparezcan 1 bajo otro
        `<div >
        ${m}  <!-- ✅ el $ es para llamar 1 variable en la parte de js  -->
          
          <small class = "fst-italic fw-bold">    
          ${user.username}
          </small>
          
          <small class = "fst-italic fw-bold">    
          fecha y hora
          </small>  
            

        </div>
        
        
        
        </div><br>`; //se agrega el mensaje al div con id moxMessage en el html, con un salto de línea después de cada mensaje
    } 


} // ← CIERRE del window.onload