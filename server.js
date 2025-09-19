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

socket.on("setPlayerData", (data) => {
    players[socket.id] = {
        x: 50,
        y: 50,
        width: 30,
        height: 30,
        name: data.name,
        skin: data.skin
    };

    socket.emit('currentPlayers', players);

    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    io.emit("updatePlayer", { id: socket.id, ...players[socket.id] });
});
    //receber nome do jogador
    socket.on("setPlayerData", (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name;
            players[socket.id].skin = data.skin;
            //Atualiza para todos os clientes 
            io.emit("updateName", { id: socket.id, ...players[socket.id] });
        }
    });

    //enviar para o novo usuario o estado atual do jogo 
    socket.emit('currentPlayers', players);

    //notificar aos outros jogadores a entrada de um novo jogador
    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    //movimento do jogador *on* servidor esta escutando o evento
    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return; 

        const speed = 5;

        //salva a posição antes do movimento
        const oldX = player.x;
        const oldY = player.y;

        if (direction === 'left')player.x -= speed;
        if (direction === 'right')player.x += speed;
        if (direction === 'up')player.y -= speed;
        if (direction === 'down')player.y += speed;

        //função de colisão
        function checkCollision(p1, p2) {
            return !(
                p1.x + p1.width <= p2.x ||
                p1.x >= p2.x + p2.width ||
                p1.y + p1.height <= p2.y ||
                p1.y >= p2.y + p2.height


            );
        }

        for (let id in players) {
            if (id !== socket.id) {
                if (checkCollision(player, players[id])) {
                    //se bater desfaz o movimento
                    player.x = oldX;
                    player.y = oldY;
                    break;
                }
            }
        }


        //Limites da tela 
        player.x = Math.max(0, Math.min(600 - 30, player.x));
        player.y = Math.max(0, Math.min(400 - 30, player.y));

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