const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let palavras = []; // Lista que armazenará as palavras

// Servindo arquivos estáticos (como o HTML, CSS e JS)
app.use(express.static('public'));

// Quando um cliente se conecta
io.on('connection', (socket) => {
    console.log('Um jogador se conectou');

    // Enviar a lista de palavras quando o jogador se conectar
    socket.emit('atualizarPalavras', palavras);

    // Quando um jogador envia uma palavra para adicionar
    socket.on('adicionarPalavra', (palavra) => {
        palavras.push(palavra);
        // Atualizar todos os jogadores com a nova lista de palavras
        io.emit('atualizarPalavras', palavras);
    });

    // Quando o jogador se desconectar
    socket.on('disconnect', () => {
        console.log('Um jogador se desconectou');
    });
});

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});