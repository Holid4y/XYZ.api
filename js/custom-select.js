class CustomSelect {
    constructor() {
        this.selects = document.querySelectorAll('.custom-select');
        this.init();
    }

    init() {
        this.selects.forEach(select => {
            const trigger = select.querySelector('.select-trigger');
            const options = select.querySelector('.select-options');
            const optionItems = select.querySelectorAll('.select-option');
            const searchInput = select.querySelector('.select-search');
            const valueSpan = select.querySelector('.select-value');

            // Обработчик клика по триггеру
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const wasOpen = select.classList.contains('open');

                this.closeAllDropdowns();

                if (!wasOpen) {
                    select.classList.add('open');

                    // Рассчитываем позицию
                    if (select.classList.contains('auto')) {
                        this.calculateAutoPosition(select, options);
                    }
                }
            });

            // Обработчик выбора опции
            optionItems.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = option.textContent;
                    if (valueSpan) {
                        valueSpan.textContent = value;
                    }
                    select.classList.remove('open');
                    this.triggerChange(select, option.dataset.value);
                });
            });

            // Поиск
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    e.stopPropagation();
                    const searchText = e.target.value.toLowerCase();
                    optionItems.forEach(option => {
                        const text = option.textContent.toLowerCase();
                        option.style.display = text.includes(searchText) ? '' : 'none';
                    });
                });

                searchInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });

        // Закрытие при клике вне dropdown
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.selects.forEach(select => {
                if (select.classList.contains('auto') && select.classList.contains('open')) {
                    const options = select.querySelector('.select-options');
                    this.calculateAutoPosition(select, options);
                }
            });
        });

        // Обработчик прокрутки страницы
        window.addEventListener('scroll', () => {
            this.selects.forEach(select => {
                if (select.classList.contains('auto') && select.classList.contains('open')) {
                    const options = select.querySelector('.select-options');
                    this.calculateAutoPosition(select, options);
                }
            });
        });
    }

    calculateAutoPosition(select, options) {
        const triggerRect = select.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Сбрасываем классы позиционирования
        select.classList.remove('top', 'bottom');

        // Вычисляем доступное пространство
        const spaceBelow = windowHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        // Если места снизу меньше, чем сверху, добавляем класс 'top'
        if (spaceBelow < options.scrollHeight && spaceAbove >= options.scrollHeight) {
            select.classList.add('top');
        } else {
            // Иначе добавляем класс 'bottom'
            select.classList.add('bottom');
        }
    }

    closeAllDropdowns() {
        this.selects.forEach(select => {
            select.classList.remove('open');
        });
    }

    triggerChange(select, value) {
        const event = new CustomEvent('change', {
            detail: { value },
            bubbles: true
        });
        select.dispatchEvent(event);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CustomSelect();
});