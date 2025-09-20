const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

//armazena jogadores conectados 
let players = {};


io.on('connection', (socket) => {
    console.log(`Novo jogador conectado: ${socket.id}`);

//evento enviado pelo cliente para definir nome e skin 
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

});
    

   
    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return; 

        const speed = 5;

      
        const oldX = player.x;
        const oldY = player.y;

        if (direction === 'left')player.x -= speed;
        if (direction === 'right')player.x += speed;
        if (direction === 'up')player.y -= speed;
        if (direction === 'down')player.y += speed;

        
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
                    
                    player.x = oldX;
                    player.y = oldY;
                    break;
                }
            }
        }


        //Limites da tela 
        player.x = Math.max(0, Math.min(600 - 30, player.x));
        player.y = Math.max(0, Math.min(400 - 30, player.y));

        if (player.x !== oldX || player.y !== oldY){
            io.emit('updatePlayer', { id: socket.id, x: player.x, y: player.y });
        }
    });
    
    socket.on('disconnect', () => {
        const player = players[socket.id];
        if (player) {
            console.log(`Jogador saiu: ${player.name || socket.id}`);
            io.emit('playerDisconnected', { id: socket.id, name: player.name });
            delete players[socket.id];
        }
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