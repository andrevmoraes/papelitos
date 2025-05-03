class GameUI {
    constructor() {
        this.socket = io();
        this.initializeElements();
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    initializeElements() {
        // Elementos das telas
        this.telaPreparacao = document.getElementById('tela-preparacao');
        this.telaJogo = document.getElementById('tela-jogo');
        this.listaPalavras = document.getElementById('palavras-lista');

        // Elementos de entrada
        this.input = document.getElementById('nova-palavra');
        this.btnAdicionar = document.getElementById('adicionar-palavra');
        this.btnEnviar = document.getElementById('enviar-palavras');
        this.btnMostrar = document.getElementById('mostrar-palavra');
        this.botaoVoltar = document.getElementById('voltar-adicionar-palavras');

        // Elementos do modal
        this.modal = document.getElementById('modal-palavra');
        this.palavraExibida = document.getElementById('palavra-exibida');
        this.fecharModal = document.getElementById('fechar-modal');
        this.tituloModal = document.getElementById('titulo-modal');
    }

    setupEventListeners() {
        // Modal
        this.fecharModal.addEventListener('click', () => this.fecharModalHandler());
        window.addEventListener('click', (event) => this.clickForaModalHandler(event));

        // Botões
        this.btnAdicionar.addEventListener('click', () => this.adicionarPalavraHandler());
        this.input.addEventListener('keypress', (e) => this.inputKeypressHandler(e));
        this.btnEnviar.addEventListener('click', () => this.enviarPalavrasHandler());
        this.btnMostrar.addEventListener('click', () => this.mostrarPalavraHandler());
        this.botaoVoltar.addEventListener('click', () => this.voltarHandler());
    }

    setupSocketListeners() {
        this.socket.on('atualizarPalavras', (palavras) => this.atualizarPalavrasHandler(palavras));
        this.socket.on('telaJogo', () => this.mudarParaTelaJogo());
        this.socket.on('mostrarPalavra', (palavra) => this.exibirPalavraModal(palavra));
    }

    // Event Handlers
    fecharModalHandler() {
        this.modal.classList.remove('visible');
        this.modal.setAttribute('aria-hidden', 'true');
    }

    clickForaModalHandler(event) {
        if (event.target === this.modal) {
            this.fecharModalHandler();
        }
    }

    adicionarPalavraHandler() {
        const palavra = this.input.value.trim();
        if (palavra) {
            this.socket.emit('adicionarPalavra', palavra);
            this.input.value = '';
        }
    }

    inputKeypressHandler(e) {
        if (e.key === 'Enter') {
            this.adicionarPalavraHandler();
        }
    }

    enviarPalavrasHandler() {
        console.log('Enviando palavras e iniciando jogo...');
        this.socket.emit('enviarPalavras');
    }

    mostrarPalavraHandler() {
        console.log('Solicitando palavra aleatória...');
        this.socket.emit('mostrarPalavra');
    }

    voltarHandler() {
        console.log('Voltando para tela de preparação...');
        this.telaJogo.classList.add('hidden');
        this.telaPreparacao.classList.remove('hidden');
        this.listaPalavras.innerHTML = '';
        console.log('Estado atual das telas após voltar:', {
            telaJogo: this.telaJogo.className,
            telaPreparacao: this.telaPreparacao.className
        });
    }

    // Socket Event Handlers
    atualizarPalavrasHandler(palavras) {
        this.listaPalavras.innerHTML = '';
        palavras.forEach((palavra, index) => this.criarItemLista(palavra, index));
    }

    mudarParaTelaJogo() {
        console.log('Mudando para tela de jogo...');
        console.log('Estado atual telaPreparacao:', this.telaPreparacao.className);
        console.log('Estado atual telaJogo:', this.telaJogo.className);
        
        this.telaPreparacao.classList.add('hidden');
        this.telaJogo.classList.remove('hidden');
        
        console.log('Novo estado telaPreparacao:', this.telaPreparacao.className);
        console.log('Novo estado telaJogo:', this.telaJogo.className);
    }

    exibirPalavraModal(palavra) {
        this.tituloModal.textContent = 'Palavra Atual';
        this.palavraExibida.textContent = palavra;
        this.modal.classList.add('visible');
        this.modal.setAttribute('aria-hidden', 'false');
    }

    // Helpers
    criarItemLista(palavra, index) {
        const li = document.createElement('li');
        li.textContent = palavra;

        const btnRemover = document.createElement('button');
        btnRemover.innerHTML = '<i class="uil uil-times"></i>';
        btnRemover.addEventListener('click', () => {
            this.socket.emit('removerPalavra', index);
        });

        li.appendChild(btnRemover);
        this.listaPalavras.appendChild(li);
    }
}

// Inicializar o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});