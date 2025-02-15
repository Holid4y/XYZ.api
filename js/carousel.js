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
        this.gap = parseInt(element.getAttribute('carusel-bs-gap')) || 0;

        // Добавляем проверку на тип карусели
        this.isCardCarousel = element.getAttribute('carusel-bs-role') === 'card-carusel';
        
        if (this.isCardCarousel) {
            this.setupCardCarousel();
        }

        // Состояние карусели
        this.currentIndex = 0;
        this.maxIndex = Math.ceil((this.items.length - this.visibleItems) / this.scrollItems);
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        // Устанавливаем CSS переменные
        this.carousel.style.setProperty('--visible-items', this.visibleItems);
        this.carousel.style.setProperty('--gap', `${this.gap}px`);

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
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.move('prev'));
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.move('next'));
        }

        // Настройка перетаскивания мышью
        if (this.mouseDrag) {
            this.setupDrag();
            
        }
        console.log('Mouse drag enabled:', this.mouseDrag);
        

        // Автопрокрутка
        if (this.autoScroll) {
            this.startAutoScroll();
        }

        // Начальное обновление состояния
        // this.updateButtonStates();
    }

    setupStyles() {
        // Устанавливаем ширину элементов с учетом промежутков
        this.items.forEach((item, index) => {
            // Убираем отступ у последнего элемента
            item.style.marginRight = index < this.items.length - 1 ? `${this.gap}px` : '0';
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
        console.log('Drag started');
        this.isDragging = true;
        this.startPos = e.clientX;
        this.track.style.cursor = 'grabbing';
    }
    
    dragMove(e) {
        if (!this.isDragging) return;
        console.log('Dragging');
        const currentPosition = e.clientX;
        const diff = currentPosition - this.startPos;
        
        if (Math.abs(diff) > 10) {
            if (diff > 0) {
                this.move('prev');
            } else {
                this.move('next');
            }
            this.dragEnd();
        }
    }
    
    dragEnd() {
        console.log('Drag ended');
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
        const itemWidth = this.carousel.offsetWidth / this.visibleItems;
        const gapOffset = this.currentIndex * this.gap * this.scrollItems;
        const percentageOffset = this.currentIndex * (100 / this.visibleItems) * this.scrollItems;

        // Корректируем отступ для последних элементов
        if (this.currentIndex >= this.maxIndex) {
            const remainingItems = this.items.length - this.currentIndex * this.scrollItems;
            if (remainingItems < this.visibleItems) {
                const extraGap = (this.visibleItems - remainingItems) * this.gap;
                this.track.style.transform = `translateX(calc(-${percentageOffset}% - ${gapOffset - extraGap}px))`;
                return;
            }
        }

        this.track.style.transform = `translateX(calc(-${percentageOffset}% - ${gapOffset / 2}px))`;
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

    setupCardCarousel() {
        // Устанавливаем начальные классы
        this.items[0].classList.add('active-card-carusel');
        
        // Добавляем обработчики кликов на элементы
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('active-card-carusel')) {
                    // Убираем активный класс у текущего элемента
                    const currentActive = this.track.querySelector('.active-card-carusel');
                    currentActive.classList.remove('active-card-carusel');
                    
                    // Добавляем активный класс к кликнутому элементу
                    item.classList.add('active-card-carusel');
                }
            });
        });
    }
}

// Инициализация всех каруселей на странице
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
});