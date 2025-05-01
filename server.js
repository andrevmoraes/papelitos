const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

let palavrasPorJogador = {}; // Armazena listas de palavras por jogador
let todasPalavras = [];
// Comentando funcionalidades relacionadas aos jogadores conectados
// let jogadores = {}; // Armazena os nomes dos jogadores

// Servindo arquivos estáticos (como o HTML, CSS e JS)
app.use(express.static('public'));

// Quando um cliente se conecta
io.on('connection', (socket) => {
    console.log(`Jogador ${socket.id} se conectou`);

    // Inicializar lista de palavras para o jogador
    palavrasPorJogador[socket.id] = [];

    // socket.on('registrarJogador', (dados) => {
    //     jogadores[socket.id] = { ...jogadores[socket.id], ...dados };
    //     io.emit('atualizarJogadores', Object.values(jogadores));
    //     console.log(`Jogador ${socket.id} registrou informações:`, dados);
    // });

    // Enviar a lista de palavras do jogador ao conectar
    socket.emit('atualizarPalavras', palavrasPorJogador[socket.id]);

    // socket.on('definirNome', (nome) => {
    //     console.log(`Jogador ${socket.id} definiu o nome para: ${nome}`);
    //     jogadores[socket.id].nome = nome || `Jogador ${socket.id}`;
    //     io.emit('atualizarJogadores', Object.values(jogadores));
    // });

    // Quando um jogador envia uma palavra para adicionar
    socket.on('adicionarPalavra', (palavra) => {
        if (palavrasPorJogador[socket.id]) {
            palavrasPorJogador[socket.id].push(palavra);
            socket.emit('atualizarPalavras', palavrasPorJogador[socket.id]);
        }
    });

    socket.on('enviarPalavras', () => {
        todasPalavras.push(...palavrasPorJogador[socket.id]);
        palavrasPorJogador[socket.id] = [];
        socket.emit('telaJogo'); // Trocar para tela do botão "Mostrar Palavra"
    });

    // Quando o jogador solicitar uma palavra para mostrar
    socket.on('mostrarPalavra', () => {
        if (todasPalavras.length > 0) {
            const indice = Math.floor(Math.random() * todasPalavras.length);
            const palavra = todasPalavras.splice(indice, 1)[0]; // Remove e retorna a palavra
            socket.emit('mostrarPalavra', palavra);
        } else {
            socket.emit('mostrarPalavra', 'Todas as palavras já foram usadas.');
        }
    });

    // Quando um jogador solicita todas as palavras adicionadas
    socket.on('obterTodasPalavras', () => {
        socket.emit('todasPalavras', todasPalavras);
    });

    // Quando um jogador solicita limpar as palavras
    socket.on('limparPalavras', () => {
        palavrasPorJogador[socket.id] = [];
        socket.emit('atualizarPalavras', palavrasPorJogador[socket.id]); // Atualizar o cliente
    });

    socket.on('removerPalavra', (index) => {
        if (palavrasPorJogador[socket.id] && index >= 0 && index < palavrasPorJogador[socket.id].length) {
            palavrasPorJogador[socket.id].splice(index, 1);
            socket.emit('atualizarPalavras', palavrasPorJogador[socket.id]);
        }
    });

    // socket.on('disconnect', () => {
    //     console.log(`Jogador ${socket.id} se desconectou`);
    //     delete jogadores[socket.id];
    //     io.emit('atualizarJogadores', Object.values(jogadores));
    // });
});

// Usar a porta do ambiente (Render) ou 3000 localmente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});