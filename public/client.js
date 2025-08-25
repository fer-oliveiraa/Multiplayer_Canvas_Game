//cliente.js
const socket = io();    
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//armazenar os jogadores
let players = {};

//rebece todos os jogadores ao se sonectar
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
    render(); //criar função
});

//entrada de um novo jogador
socket.on('newPlayer', (player) => {
    players[player.id] = player;
    render();
});

//movimento de jogador
socket.on('playerMoved', (data) => {
    if(players[data.id]) {
        players[data.id].x = data.x;
        players[data.id].y = data.y;
        render();
    }
});

//saida de jogador
socket.on('playerDisconnected', (id) => {
    delete players[id];
    render();
});

//teclas de movimentos
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft') socket.emit('move', 'left');
    if (key === 'ArrowRight') socket.emit('move', 'right');
    if (key === 'ArrowUp') socket.emit('move', 'up');
    if (key === 'ArrowDown') socket.emit('move', 'down');
});

//renderização 
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(players).forEach(player =>  {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 30, 30);
    });
};
