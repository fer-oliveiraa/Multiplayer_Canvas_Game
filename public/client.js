const socket = io();    
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


//armazenar os jogadores
let players = {};

document.getElementById("startBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value || "SemNome";
    const skin = document.getElementById("skinSelect").value;

    //envia nome e skin para o servidor
    socket.emit("setPlayerData", { name, skin });

    //esconde menu e mostra jogo 
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
});

socket.on("updatePlayer", (data) => {
    players[data.id] = data;
    render();
});

//rebece todos os jogadores ao se conectar
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
    render(); //criar função
});

//entrada de um novo jogador
socket.on('newPlayer', (player) => {
    players[player.id] = player;
    render();
});

//nome jogador
socket.on("updateName", (data) => {
    if (players[data.id]) {
        players[data.id].name = data.name;
        render();
    }
});

const playerName = prompt("Digite seu nome:");
socket.emit("setName", playerName);


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

    Object.values(players).forEach(player => {
        // Desenhar quadrado
        ctx.fillStyle = player.skin || "gray";
        ctx.fillRect(player.x, player.y, 30, 30);

        // Mostrar nome (se existir)
        if (player.name) {
            ctx.fillStyle = "black";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(player.name, player.x + 15, player.y - 5);
        }
    });
}

