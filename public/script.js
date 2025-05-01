const socket = io();

const telaPreparacao = document.getElementById('tela-preparacao');
const telaJogo = document.getElementById('tela-jogo');

const listaPalavras = document.getElementById('palavras-lista');
const input = document.getElementById('nova-palavra');
const btnAdicionar = document.getElementById('adicionar-palavra');
const btnEnviar = document.getElementById('enviar-palavras');
const btnMostrar = document.getElementById('mostrar-palavra');

btnAdicionar.addEventListener('click', () => {
    const palavra = input.value.trim();
    if (palavra) {
        socket.emit('adicionarPalavra', palavra);
        input.value = '';
    }
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnAdicionar.click();
    }
});

btnEnviar.addEventListener('click', () => {
    socket.emit('enviarPalavras');
});

btnMostrar.addEventListener('click', () => {
    socket.emit('mostrarPalavra');
});

socket.on('atualizarPalavras', (palavras) => {
    listaPalavras.innerHTML = '';
    palavras.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        listaPalavras.appendChild(li);
    });
});

socket.on('telaJogo', () => {
    telaPreparacao.style.display = 'none';
    telaJogo.style.display = 'block';
});

socket.on('mostrarPalavra', (palavra) => {
    alert(`A palavra é: ${palavra}`);
});