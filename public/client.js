const socket = io();    
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = {};
let items = []; // itens ativos no mapa

document.getElementById("startBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value || "SemNome";
    const skin = document.getElementById("skinSelect").value;

    socket.emit("setPlayerData", { name, skin });

    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
});

// Dicionário de imagens
const itemImages = {
    coin: new Image(),
    star: new Image()
};

itemImages.coin.src = "cereja.png";  // usei a mesma imagem para exemplo
itemImages.star.src = "cereja.png";

// ----------------- Jogadores -----------------
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;

    Object.values(players).forEach(player => {
        player.skin = player.skin || "gray";
        player.x = player.x ?? 50;
        player.y = player.y ?? 50;
    });
    render(); 
});

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

// ----------------- Itens -----------------
socket.on("currentItems", (serverItems) => {
    items = serverItems;
    render();
});

socket.on("itemSpawned", (item) => {
    items.push(item);
    render();
});

socket.on("itemRemoved", (itemId) => {
    items = items.filter(i => i.id !== itemId);
    render();
});

// ----------------- Pontuação -----------------
socket.on("updateScore", (data) => {
    if (players[data.id]) {
        players[data.id].score = data.score;
    }
});

socket.on("scoreboardUpdate", (scores) => {
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";
    scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name}: ${s.score}`;
        scoreList.appendChild(li);
    });
    document.getElementById("scoreboard").style.display = "block";
});

// ----------------- Controles -----------------
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft') socket.emit('move', 'left');
    if (key === 'ArrowRight') socket.emit('move', 'right');
    if (key === 'ArrowUp') socket.emit('move', 'up');
    if (key === 'ArrowDown') socket.emit('move', 'down');
});

// ----------------- Renderização -----------------
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar itens
    items.forEach(item => {
        const img = itemImages[item.type];
        if (img && img.complete) {
            ctx.drawImage(img, item.x, item.y, item.width, item.height);
        }
    });

    // Desenhar jogadores
    Object.values(players).forEach(player => {
        const skinColor = player.skin || "gray";
        
        ctx.fillStyle = skinColor;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        if (player.name) {
            ctx.fillStyle = "black";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(player.name, player.x + 15, player.y - 5);
        }
    });
}

// ----------------- Mensagens -----------------
function showMessage(text, duration = 2000) {
    const messageDiv = document.getElementById("gameMessages");
    messageDiv.textContent = text;
    messageDiv.style.display = "block";

    setTimeout(() => {
        messageDiv.style.display = "none";
    }, duration);
}
