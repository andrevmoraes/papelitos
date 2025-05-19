class MenuUI {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.carousel = document.querySelector('.carousel-container');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.cards = document.querySelectorAll('.game-card');
        this.currentIndex = 0;
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.scrollToPrev());
        this.nextBtn.addEventListener('click', () => this.scrollToNext());
        
        // Atualiza o índice atual quando o usuário rola o carrossel
        this.carousel.addEventListener('scroll', () => {
            const index = Math.round(this.carousel.scrollLeft / this.carousel.offsetWidth);
            if (index !== this.currentIndex) {
                this.currentIndex = index;
                this.updateButtonsVisibility();
            }
        });

        // Evento de toque para dispositivos móveis
        let startX;
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].pageX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar como swipe
                if (diff > 0) {
                    this.scrollToNext();
                } else {
                    this.scrollToPrev();
                }
            }
        });
    }

    scrollToPrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollToCard(this.currentIndex);
        }
    }

    scrollToNext() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.scrollToCard(this.currentIndex);
        }
    }

    scrollToCard(index) {
        const card = this.cards[index];
        this.carousel.scrollTo({
            left: card.offsetLeft,
            behavior: 'smooth'
        });
        this.updateButtonsVisibility();
    }

    updateButtonsVisibility() {
        this.prevBtn.style.visibility = this.currentIndex === 0 ? 'hidden' : 'visible';
        this.nextBtn.style.visibility = this.currentIndex === this.cards.length - 1 ? 'hidden' : 'visible';
    }
}

// Inicializar o menu quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MenuUI();
});