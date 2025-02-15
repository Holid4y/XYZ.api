$(".option").click(function(){
    $(".option").removeClass("active");
    $(this).addClass("active");
    
});

class Carousel {
    constructor(element) {
        // Основные элементы
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.items = Array.from(this.track.children);
        this.prevButton = element.querySelector('.carousel-prev');
        this.nextButton = element.querySelector('.carousel-next');

        // Получаем настройки из атрибутов
        this.visibleItems = parseInt(element.getAttribute('carusel-bs-visible')) || 1;
        this.scrollItems = parseInt(element.getAttribute('carusel-bs-scroll')) || 1;
        this.isInfinite = element.getAttribute('carusel-bs-infinity') === 'true';
        this.autoScroll = element.getAttribute('carusel-bs-auto') === 'true';
        this.scrollTime = parseInt(element.getAttribute('carusel-bs-time')) || 5000;
        this.mouseDrag = element.getAttribute('carusel-bs-mouse-drag') === 'true';
        this.showIndicators = element.getAttribute('carusel-bs-indicator') === 'true';

        // Состояние карусели
        this.currentIndex = 0;
        this.maxIndex = Math.ceil((this.items.length - this.visibleItems) / this.scrollItems);
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.init();
    }

    init() {
        // Настройка стилей
        this.setupStyles();
        
        // Добавление индикаторов
        if (this.showIndicators) {
            this.setupIndicators();
        }

        // Обработчики кнопок
        this.prevButton.addEventListener('click', () => this.move('prev'));
        this.nextButton.addEventListener('click', () => this.move('next'));

        // Настройка перетаскивания мышью
        if (this.mouseDrag) {
            this.setupDrag();
        }

        // Автопрокрутка
        if (this.autoScroll) {
            this.startAutoScroll();
        }

        // Начальное обновление состояния
        this.updateButtonStates();
    }

    setupStyles() {
        // Устанавливаем ширину элементов
        const itemWidth = 100 / this.visibleItems;
        this.items.forEach(item => {
            item.style.flex = `0 0 ${itemWidth}%`;
        });
    }

    setupIndicators() {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'carousel-indicators';
        
        for (let i = 0; i <= this.maxIndex; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.addEventListener('click', () => this.goToIndex(i));
            indicatorContainer.appendChild(indicator);
        }
        
        this.carousel.appendChild(indicatorContainer);
        this.indicators = Array.from(indicatorContainer.children);
        this.updateIndicators();
    }

    setupDrag() {
        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        window.addEventListener('mousemove', this.dragMove.bind(this));
        window.addEventListener('mouseup', this.dragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.dragEnd.bind(this));
    }

    dragStart(e) {
        this.isDragging = true;
        this.startPos = e.clientX;
        this.track.style.cursor = 'grabbing';
    }

    dragMove(e) {
        if (!this.isDragging) return;
        
        const currentPosition = e.clientX;
        const diff = currentPosition - this.startPos;
        
        if (Math.abs(diff) > 100) { // Минимальное расстояние для свайпа
            if (diff > 0) {
                this.move('prev');
            } else {
                this.move('next');
            }
            this.dragEnd();
        }
    }

    dragEnd() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
    }

    move(direction) {
        if (direction === 'next') {
            if (this.currentIndex < this.maxIndex || this.isInfinite) {
                this.currentIndex = this.isInfinite && this.currentIndex >= this.maxIndex ? 
                    0 : Math.min(this.currentIndex + 1, this.maxIndex);
            }
        } else {
            if (this.currentIndex > 0 || this.isInfinite) {
                this.currentIndex = this.isInfinite && this.currentIndex <= 0 ? 
                    this.maxIndex : Math.max(this.currentIndex - 1, 0);
            }
        }

        this.updateCarousel();
    }

    goToIndex(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const offset = -(this.currentIndex * (100 / this.visibleItems) * this.scrollItems);
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateButtonStates();
        if (this.showIndicators) {
            this.updateIndicators();
        }
    }

    updateButtonStates() {
        if (!this.isInfinite) {
            this.prevButton.disabled = this.currentIndex === 0;
            this.nextButton.disabled = this.currentIndex >= this.maxIndex;
        }
    }

    updateIndicators() {
        this.indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoScroll() {
        setInterval(() => {
            if (!this.isDragging) {
                this.move('next');
            }
        }, this.scrollTime);
    }
}

// Инициализация всех каруселей на странице
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
});

