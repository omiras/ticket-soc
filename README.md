# Turnos en el SOC

Deseamos implementar un sistema de turnos como el que existe en los hospitales, esta vez para el SOC.

[Chuleta Socket.io](https://socket.io/docs/v4/emit-cheatsheet/)
[Demo](http://soc-ticket.herokuapp.com/)

## Requisito 1 - Pedir Turno y generar número de turno aleatório

### cliente.html
1. El usuario debe poder hacer clic en el botón "Pedir Turno"
2. Al hacer clic en "Pedit Turno", enviaremos un socket event de nombre 'pedir-turno'
3. Tras pedir turno, habría que deshabilitar el botón de "Pedir Turno"

### server.js
1. El servidor debe poder escuchar el evento 'pedir-turno' de cualquier cliente
2. El servidor debe generar un número de ticket aleatorio. Podéis utilizar este paquete de terceros: https://www.npmjs.com/package/random-number
3. En el array usernames, buscar el usuario cuyo id==socket.id; y asociarle el número de ticket. A esta nueva propiedad le podemos llamar **ticket**
4. Debemos informar al cliente de su número de ticket. Lo podemos hacer emitiendo un evento, solo al cliente mediante **socket.emit**. Podemos llamar al evento 'enviar-numero-turno'

### cliente.html
1. El cliente debe recibir el evento 'enviar-numero-turno'; y ponerlo en la parte apropiada del DOM

## Requisito 2 - El cliente recibe el turno 

### server.js

1. El servidor envía únicamente al cliente (socket.emit) el turno que le ha tocado. Podemos llamar al evento **enviar-turno**, y debemos pasar por parámetro el número de ticket generado.

### cliente.html

1. El cliente debe recibir el evento **enviar-turno**. Colocará el argumento del evento (número de ticket) en el lugar del DOM correspondiente


### Requisito 3 - El servidor calcula el siguiente turno 

### server.js
1. Cada cierto tiempo, se debe enviar la lista de usuarios actualizados al cliente
2. Usar setInterval para ejecutar una función cada __timePerPerson__ que se encargue:
  1.  Enviar la lista actualizada de usuarios que esperan. Emitir un evento a todos los clientes de nombre 'actualizar-cola', con parámetro todo el array __usernames__
  2. Debemos eliminar **el primer** elemento del array y guardarlo en la variable global currentUserTurn. Esa variable indica a quién realmente le toca el turno en este momento.

## client.html

1. El cliente debe recibir el evento **enviar-turno** y colocar el número de turno en el DOM correspondiente
2. El cliente debe recibir el evento **actualizar-cola**. Es un array de objetos, con dos propiedades, el id del socket y su núemero de ticket. Generar tantos `<article>` como elementos tiene el array, y añadirlos en el contenedor #queue 

## Requisito  Bonus 

En la carpeta **public** existe un fichero de sonido. Hazlo sonar cuando sea el turno del cliente.


