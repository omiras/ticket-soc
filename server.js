const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

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
});

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});