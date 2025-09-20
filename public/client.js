const socket = io();    
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');



let players = {};

document.getElementById("startBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value || "SemNome";
    const skin = document.getElementById("skinSelect").value;

    
    socket.emit("setPlayerData", { name, skin });

    
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
});



socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;

    Object.values(players).forEach(player => {
        player.skin = player.skin || "gray";
        player.x = player.x ?? 50;
        player.y = player.y ?? 50;
    });
    render(); 
});

//entrada de um novo jogador
socket.on('newPlayer', (player) => {
    player.skin = player.skin || "gray";
    player.x = player.x ?? 50;
    player.y = player.y ?? 50;

    players[player.id] = player;
    render();
});


socket.on('updatePlayer', (data) => {
    if (!players[data.id]) return;
    Object.assign(players[data.id], data);
    render();
});



socket.on('playerDisconnected', (data) => {
    delete players[data.id];
    render();

    showMessage(`Jogador ${data.name || "Desconhecido"} saiu do jogo`);
});


document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft') socket.emit('move', 'left');
    if (key === 'ArrowRight') socket.emit('move', 'right');
    if (key === 'ArrowUp') socket.emit('move', 'up');
    if (key === 'ArrowDown') socket.emit('move', 'down');
});

function showMessage(text, duration = 2000) {
    const messageDiv = document.getElementById("gameMessages");
    messageDiv.textContent = text;
    messageDiv.style.display = "block";

    setTimeout(() => {
        messageDiv.style.display = "none";
    }, duration);
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(players).forEach(player => {

        const skinColor = player.skin || "gray";
        
        ctx.fillStyle = skinColor;
        ctx.fillRect(player.x, player.y, 30, 30);

        
        if (player.name) {
            ctx.fillStyle = "black";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(player.name, player.x + 15, player.y - 5);
        }
    });
}

