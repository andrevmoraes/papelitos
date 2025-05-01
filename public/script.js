const socket = io();

// Atualiza a lista de palavras
socket.on('atualizarPalavras', (palavras) => {
    const listaPalavras = document.getElementById('palavras-lista');
    listaPalavras.innerHTML = '';
    palavras.forEach((palavra) => {
        const item = document.createElement('li');
        item.textContent = palavra;
        listaPalavras.appendChild(item);
    });
});

// Adiciona nova palavra
const input = document.getElementById('nova-palavra');
const botao = document.getElementById('adicionar-palavra');

botao.addEventListener('click', () => {
    const novaPalavra = input.value.trim();
    if (novaPalavra !== '') {
        socket.emit('adicionarPalavra', novaPalavra);
        input.value = '';
    }
});
