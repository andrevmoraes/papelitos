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
        io.emit('atualizarPalavras', palavras); // Envia para todos
    });

    socket.on('disconnect', () => {
        console.log('Um jogador se desconectou');
    });
});

// Usar a porta do ambiente (Render) ou 3000 localmente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
