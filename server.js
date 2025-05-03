const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Classe para gerenciar o estado do jogo
class GameState {
    constructor() {
        this.palavrasPorJogador = new Map();
        this.todasPalavras = [];
    }

    inicializarJogador(socketId) {
        this.palavrasPorJogador.set(socketId, []);
        return this.getPalavrasJogador(socketId);
    }

    adicionarPalavra(socketId, palavra) {
        if (!palavra || typeof palavra !== 'string') return false;
        
        const palavras = this.palavrasPorJogador.get(socketId);
        if (!palavras) return false;

        palavras.push(palavra.trim());
        return palavras;
    }

    enviarPalavrasParaJogo(socketId) {
        const palavras = this.palavrasPorJogador.get(socketId);
        if (!palavras) return false;

        this.todasPalavras.push(...palavras);
        this.palavrasPorJogador.set(socketId, []);
        return true;
    }

    obterPalavraAleatoria() {
        if (this.todasPalavras.length === 0) {
            return null;
        }
        const indice = Math.floor(Math.random() * this.todasPalavras.length);
        return this.todasPalavras.splice(indice, 1)[0];
    }

    removerPalavra(socketId, index) {
        const palavras = this.palavrasPorJogador.get(socketId);
        if (!palavras || index < 0 || index >= palavras.length) return false;

        palavras.splice(index, 1);
        return palavras;
    }

    limparPalavrasJogador(socketId) {
        this.palavrasPorJogador.set(socketId, []);
        return [];
    }

    getPalavrasJogador(socketId) {
        return this.palavrasPorJogador.get(socketId) || [];
    }

    removerJogador(socketId) {
        this.palavrasPorJogador.delete(socketId);
    }
}

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

// Servindo arquivos estáticos
app.use(express.static('public'));

// Instância do estado do jogo
const gameState = new GameState();

// Gerenciamento de eventos do Socket.IO
io.on('connection', (socket) => {
    console.log(`Jogador ${socket.id} conectado`);

    // Inicialização do jogador
    const palavrasIniciais = gameState.inicializarJogador(socket.id);
    socket.emit('atualizarPalavras', palavrasIniciais);

    // Eventos do jogo
    socket.on('adicionarPalavra', (palavra) => {
        const palavras = gameState.adicionarPalavra(socket.id, palavra);
        if (palavras) {
            socket.emit('atualizarPalavras', palavras);
        }
    });

    socket.on('enviarPalavras', () => {
        console.log('Recebido evento enviarPalavras do cliente', socket.id);
        if (gameState.enviarPalavrasParaJogo(socket.id)) {
            console.log('Emitindo evento telaJogo para o cliente', socket.id);
            socket.emit('telaJogo');
        }
    });

    socket.on('mostrarPalavra', () => {
        const palavra = gameState.obterPalavraAleatoria();
        socket.emit('mostrarPalavra', palavra || 'Todas as palavras já foram usadas');
    });

    socket.on('obterTodasPalavras', () => {
        socket.emit('todasPalavras', gameState.todasPalavras);
    });

    socket.on('limparPalavras', () => {
        const palavras = gameState.limparPalavrasJogador(socket.id);
        socket.emit('atualizarPalavras', palavras);
    });

    socket.on('removerPalavra', (index) => {
        const palavras = gameState.removerPalavra(socket.id, index);
        if (palavras) {
            socket.emit('atualizarPalavras', palavras);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Jogador ${socket.id} desconectado`);
        gameState.removerJogador(socket.id);
    });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});