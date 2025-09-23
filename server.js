const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Armazena jogadores conectados
let players = {};
// Armazena itens no mapa
let items = [];

// Função para spawnar itens
function spawnItem() {
    const item = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * (600 - 40)),
        y: Math.floor(Math.random() * (400 - 40)),
        width: 40,
        height: 40,
        type: "coin" // pode trocar por outros tipos no futuro
    };
    items.push(item);
    io.emit("itemSpawned", item);
}

// Spawna um item a cada 5 segundos
setInterval(spawnItem, 5000);

io.on('connection', (socket) => {
    console.log(`Novo jogador conectado: ${socket.id}`);

    // Evento enviado pelo cliente para definir nome e skin
    socket.on("setPlayerData", (data) => {
        players[socket.id] = {
            x: 50,
            y: 50,
            width: 30,
            height: 30,
            name: data.name,
            skin: data.skin,
            score: 0
        };

        // Envia todos os jogadores e itens atuais para o novo jogador
        socket.emit('currentPlayers', players);
        socket.emit('currentItems', items);

        // Notifica os outros sobre o novo jogador
        socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });
    });

    // Movimento do jogador
    socket.on('move', (direction) => {
        const player = players[socket.id];
        if (!player) return;

        const speed = 5;
        const oldX = player.x;
        const oldY = player.y;

        if (direction === 'left') player.x -= speed;
        if (direction === 'right') player.x += speed;
        if (direction === 'up') player.y -= speed;
        if (direction === 'down') player.y += speed;

        // Função para checar colisão
        function checkCollision(p1, p2) {
            return !(
                p1.x + p1.width <= p2.x ||
                p1.x >= p2.x + p2.width ||
                p1.y + p1.height <= p2.y ||
                p1.y >= p2.y + p2.height
            );
        }

        // Impedir colisão entre jogadores
        for (let id in players) {
            if (id !== socket.id) {
                if (checkCollision(player, players[id])) {
                    player.x = oldX;
                    player.y = oldY;
                    break;
                }
            }
        }

        // Checar colisão com itens
        for (let i = items.length - 1; i >= 0; i--) {
            if (checkCollision(player, items[i])) {
                player.score += 10; // +10 pontos por item
                io.emit("updateScore", { id: socket.id, score: player.score });

                const removed = items.splice(i, 1)[0];
                io.emit("itemRemoved", removed.id);

                updateScoreboard();
            }
        }

        // Limites da tela
        player.x = Math.max(0, Math.min(600 - 30, player.x));
        player.y = Math.max(0, Math.min(400 - 30, player.y));

        if (player.x !== oldX || player.y !== oldY) {
            io.emit('updatePlayer', { id: socket.id, x: player.x, y: player.y });
        }
    });

    // Jogador desconectou
    socket.on('disconnect', () => {
        const player = players[socket.id];
        if (player) {
            console.log(`Jogador saiu: ${player.name || socket.id}`);
            io.emit('playerDisconnected', { id: socket.id, name: player.name });
            delete players[socket.id];
            updateScoreboard();
        }
    });
});

// Atualizar o placar global
function updateScoreboard() {
    const scores = Object.entries(players).map(([id, p]) => ({
        id,
        name: p.name,
        score: p.score
    }));

    scores.sort((a, b) => b.score - a.score);
    io.emit("scoreboardUpdate", scores);
}

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000...');
});
