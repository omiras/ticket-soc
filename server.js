const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var rn = require('random-number');
var gen = rn.generator({
    min: 0
    , max: 9999
    , integer: true
});


// Base de datos de usuarios
let usernames = []
// Turno actual
let currentUserTurn;

// Tiempo de duración de cada consulta, en segundos
let timePerPerson = 20;

// importar el paquete de terceros socket.io, y nos quedamos únicamente con el objeto 'Server'
const { Server } = require("socket.io");
// Crear una nueva instancia del objeto Server y le pasamos como parámetro nuestro servidor NodeJS
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

// Socket.io va a 'escuchar' los eventos de tipo 'connection', que son unos eventos que se emiten cuando un cliente (desde el navegador Web) accede a nuestra app
io.on('connection', (socket) => {

    // la propiedad id es el identificador único de cliente que Socket.io ha otorgado al cliente que se ha conectado
    console.log("Nuevo ID de usuario conectado: ", socket.id);

    //Escuchar el evento pedir pedir turno
    socket.on('pedir-turno', () => {
        // TODO Generar un número alatorio (con el paquete de terceros )
        let numTicket = gen(); // guardar aquí el número de ticket
        console.log('Número de ticket generado: ', numTicket);
        socket.emit("actualizar-cola", usernames);


        // TODO: Actualizar el array de usernames (push) con un objeto que tiene dos propiedades. id: socket.id, ticket: numTicket . No ahorrar console.log, hacer un console log de usernames para ver como queda
        usernames.push({
            id: socket.id,
            ticket: numTicket
        });

        console.log("Lista actualizada de usuarios esperando en la cola: ", usernames);

        // TODO: Emitir un evento de nombre 'enviar-turno' al cliente, mediante socket.emit. Este evento si debe tener un argumto, que es el numTicket
        socket.emit("enviar-turno", numTicket);
    })

    socket.on('reclamar-turno', () => {
        // De verdad es tu turno?
        if (currentUserTurn.id == socket.id) {
            socket.emit("confirmar-turno");
        }
    })
});

// 20 mil milisegundos son 20 segundos
setInterval(nextTurn, timePerPerson * 1000);

function nextTurn() {

    console.log("Ahora le toca a: ", usernames[0])
    // Emitir un evento de nombre 'actualizar-cola' con parámetro todo el array de usernames. Cómo se lo queremo enviar a todos los clientes, hay que hacerlo mediante io.emit. 1 línea de código
    io.emit('actualizar-cola', usernames);

    // Eliminar el primer elemento del array de usernames (shift)
    // [oscar, sara, francisco] // FIFO (First In First Out) (Cola)
    // Guardar el elemento eliminado en la variable currentUserTurn
    // 1 línea de código
    currentUserTurn = usernames.shift();
    console.log("Lista de usuarios tras eliminar el primero: ", usernames);

}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});