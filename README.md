# ﻿Multiplayer Canvas Game #
Projeto desenvolvido durante a aula de Tópicos Avançados.
Um jogo multiplayer simples em tempo real usando Node.js, Socket.IO e HTML5 Canvas, onde os jogadores podem se mover em uma área limitada e evitar sobreposição entre si.

# Funcionalidades
- Jogadores se movem com as setas do teclado (ArrowUp, ArrowDown, ArrowLeft, ArrowRight).

- Colisão com os limites da tela: jogadores não podem sair da área do canvas (600x400).

- Prevenção de sobreposição: dois jogadores não podem ocupar o mesmo espaço.

- Cada jogador possui uma cor aleatória.

- Adição e remoção de jogadores em tempo real.

# 📂 Estrutura do projeto
│projeto-multiplayer <br>
│<br>
├─ public/<br>
│ ├─ index.html # Página principal com o canvas <br>
│ └─ client.js # Lógica do cliente<br>
│<br>
├─ server.js # Servidor Node.js + Socket.IO <br>
├─ package.json # Dependências do projeto <br>
└─ README.md # Este arquivo <br>

# Instalação e execução
- Clone o repositório:

```git clone https://github.com/fer-oliveiraa/Multiplayer_Canvas_Game.git``` <br>
```cd projeto-multiplayer```

- Instale as dependências:

```npm install express socket.io```

 - Execute o servidor:

```node server.js```

- Abra o navegador e acesse:

```http://localhost:3000```

*Abra várias abas ou navegadores para testar o multiplayer.*

# Tecnologias usadas
```Node.js```

```Express```

```Socket.IO```

```HTML5 Canvas```

```JavaScript```

