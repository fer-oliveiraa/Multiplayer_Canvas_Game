const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

//Armazenar os jogadores
let players = {};

//Inicia o socket.io
io.on('connection', (socket) => {
    console.log(`Novo jogador conectado: ${socket.id}`);

    //Criar o jogador na posição inicial
    players[socket.id] = { 
        x: 50, 
        y: 50,
        color: getRandomColor()
    };

    //enviar para o novo usuario o estado atual do jogo 
    socket.emit('currentPlayers', players);

    //notificar aos outros jogadores a entrada de um novo jogador
    socket.broadcasr.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    //movimento do jogador *on* servidor esta escutando o evento
    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return;

        const speed = 5;
        if (direction === 'left')player.x -= speed;
        if (direction === 'right')player.x += speed;
        if (direction === 'up')player.y -= speed;
        if (direction === 'down')player.y += speed;

        io.emit('playerMoved', { id: socket.id, x: player.x, y: player.y });
    });
    //desconectar o jogador
    socket.on('disconnect', () => {
        console.log(`jogador saiu: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });


});

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

server.listen(3000, () => {
    console.log('servidor rodando em http://localhost:3000...');
});