# ﻿Multiplayer Canvas Game #
Projeto desenvolvido durante a aula de Tópicos Avançados.
Um jogo multiplayer simples em tempo real usando Node.js, Socket.IO e HTML5 Canvas, onde os jogadores podem se mover em uma área limitada e evitar sobreposição entre si.

# Funcionalidades
- **Movimentação de Jogadores**: Controle seu personagem usando as setas do teclado.
- **Personalização**: Escolha seu nome e uma cor (skin) antes de entrar no jogo.
- **Sistema de Pontuação**: Colete itens (cerejas) que aparecem aleatoriamente no mapa para ganhar pontos.
- **Placar em Tempo Real**: Um placar global mostra a pontuação dos jogadores, ordenado do maior para o menor.
- **Colisão com Paredes**: Os jogadores não podem sair dos limites da tela.
- **Prevenção de Sobreposição**: Os jogadores não podem ocupar o mesmo espaço.
- **Notificações em Tempo Real**: Mensagens são exibidas quando um jogador entra ou sai do jogo.

# 📂 Estrutura do projeto
│projeto-multiplayer <br>
│<br>
├─ public/<br>
│ ├─ cereja.png<br>
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

