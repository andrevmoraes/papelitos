const socket = io();

socket.emit('registrarJogador', { nome: 'Jogador Anônimo', avatar: 'default.png' });

const telaPreparacao = document.getElementById('tela-preparacao');
const telaJogo = document.getElementById('tela-jogo');

const listaPalavras = document.getElementById('palavras-lista');
const input = document.getElementById('nova-palavra');
const btnAdicionar = document.getElementById('adicionar-palavra');
const btnEnviar = document.getElementById('enviar-palavras');
const btnMostrar = document.getElementById('mostrar-palavra');
const botaoVoltar = document.getElementById('voltar-adicionar-palavras');

// Comentando funcionalidades relacionadas aos jogadores conectados
// const listaJogadores = document.getElementById('jogadores-lista');
// const inputNome = document.getElementById('nome-jogador');
// const btnDefinirNome = document.getElementById('definir-nome');

const modal = document.getElementById('modal-palavra');
const palavraExibida = document.getElementById('palavra-exibida');
const fecharModal = document.getElementById('fechar-modal');

fecharModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

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

botaoVoltar.addEventListener('click', () => {
    telaJogo.style.display = 'none';
    telaPreparacao.style.display = 'block';
    listaPalavras.innerHTML = '';
});

// Comentando funcionalidades relacionadas aos jogadores conectados
// btnDefinirNome.addEventListener('click', () => {
//     const nome = inputNome.value.trim();
//     if (nome) {
//         socket.emit('definirNome', nome);
//     }
// });

const btnVerTodasPalavras = document.createElement('button');
btnVerTodasPalavras.textContent = 'Ver Todas as Palavras';
telaPreparacao.appendChild(btnVerTodasPalavras);

btnVerTodasPalavras.style.display = 'none';
botaoVoltar.style.display = 'none';

btnVerTodasPalavras.addEventListener('click', () => {
    socket.emit('obterTodasPalavras');
});

socket.on('todasPalavras', (palavras) => {
    alert('Palavras adicionadas: ' + palavras.join(', '));
});

socket.on('atualizarPalavras', (palavras) => {
    listaPalavras.innerHTML = '';
    palavras.forEach((p, index) => {
        const li = document.createElement('li');
        li.textContent = p;

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.style.marginLeft = '10px';
        btnRemover.addEventListener('click', () => {
            socket.emit('removerPalavra', index);
        });

        li.appendChild(btnRemover);
        listaPalavras.appendChild(li);
    });
});

// Comentando funcionalidades relacionadas aos jogadores conectados
// socket.on('atualizarJogadores', (jogadores) => {
//     listaJogadores.innerHTML = '';
//     jogadores.forEach(jogador => {
//         const li = document.createElement('li');
//         li.textContent = jogador;
//         listaJogadores.appendChild(li);
//     });
// });

socket.on('telaJogo', () => {
    telaPreparacao.style.display = 'none';
    telaJogo.style.display = 'block';
});

socket.on('mostrarPalavra', (palavra) => {
    palavraExibida.textContent = `A palavra é: ${palavra}`;
    modal.style.display = 'flex';
});