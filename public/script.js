const socket = io();

// Quando o servidor envia a lista de palavras
socket.on('atualizarPalavras', (palavras) => {
    const listaPalavras = document.getElementById('palavras-lista');
    listaPalavras.innerHTML = '';
    palavras.forEach((palavra) => {
        const item = document.createElement('li');
        item.textContent = palavra;
        listaPalavras.appendChild(item);
    });
});

// Adicionar nova palavra
document.getElementById('adicionar-palavra').addEventListener('click', () => {
    const novaPalavra = document.getElementById('nova-palavra').value;
    if (novaPalavra) {
        socket.emit('adicionarPalavra', novaPalavra);
        document.getElementById('nova-palavra').value = ''; // Limpar campo
    }
});
