class GameUI {
    constructor() {
        this.socket = io();
        this.playerName = localStorage.getItem('playerName');
        this.initializeElements();
        this.setupEventListeners();
        this.setupSocketListeners();
        this.checkPlayerName();
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
        this.btnReiniciar = document.getElementById('reiniciar-jogo');
        this.btnLimpar = document.getElementById('limpar-jogo');

        // Elementos do modal
        this.modal = document.getElementById('modal-palavra');
        this.palavraExibida = document.getElementById('palavra-exibida');
        this.fecharModal = document.getElementById('fechar-modal');
        this.tituloModal = document.getElementById('titulo-modal');

        // Elementos do login
        this.modalLogin = document.getElementById('modal-login');
        this.inputNome = document.getElementById('nome-jogador');
        this.btnSalvarNome = document.getElementById('salvar-nome');

        // Criar elemento para mostrar o nome do jogador
        this.playerNameDisplay = document.createElement('p');
        this.playerNameDisplay.className = 'player-name';
        document.querySelector('header').appendChild(this.playerNameDisplay);
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
        this.btnReiniciar.addEventListener('click', () => this.reiniciarJogoHandler());
        this.btnLimpar.addEventListener('click', () => this.limparJogoHandler());

        // Login
        this.btnSalvarNome.addEventListener('click', () => this.salvarNomeHandler());
        this.inputNome.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.salvarNomeHandler();
        });
    }

    setupSocketListeners() {
        this.socket.on('atualizarPalavras', (palavras) => this.atualizarPalavrasHandler(palavras));
        this.socket.on('telaJogo', () => this.mudarParaTelaJogo());
        this.socket.on('mostrarPalavra', (palavra) => this.exibirPalavraModal(palavra));
        this.socket.on('jogoReiniciado', () => this.jogoReiniciadoHandler());
        this.socket.on('jogoLimpo', () => this.jogoLimpoHandler());
    }

    checkPlayerName() {
        if (this.playerName) {
            this.modalLogin.classList.remove('visible');
            this.atualizarNomeJogador();
        } else {
            this.modalLogin.classList.add('visible');
        }
    }

    salvarNomeHandler() {
        const nome = this.inputNome.value.trim();
        if (nome) {
            this.playerName = nome;
            localStorage.setItem('playerName', nome);
            this.modalLogin.classList.remove('visible');
            this.atualizarNomeJogador();
        }
    }

    atualizarNomeJogador() {
        this.playerNameDisplay.textContent = `Jogador: ${this.playerName}`;
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

    reiniciarJogoHandler() {
        this.socket.emit('reiniciarJogo');
    }

    limparJogoHandler() {
        if (confirm('Tem certeza que deseja limpar todas as palavras? Esta ação não pode ser desfeita.')) {
            this.socket.emit('limparJogo');
        }
    }

    jogoReiniciadoHandler() {
        alert('Jogo reiniciado! Todas as palavras estão disponíveis novamente.');
    }

    jogoLimpoHandler() {
        this.voltarHandler();
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