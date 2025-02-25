document.addEventListener("DOMContentLoaded", function () {
    const accordion = document.querySelector('.accordion');
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    const controls = document.querySelectorAll('.accordion-control');
    const codeBlock = document.querySelector('.copy-to-clipboard code');

    // Функция обновления кода в pre
    function updateCodeDisplay() {
        let accordionClasses = ['accordion'];
        
        // Добавляем все активные классы
        if (accordion.classList.contains('accordion-border')) accordionClasses.push('accordion-border');
        if (accordion.classList.contains('accordion-round')) accordionClasses.push('accordion-round');
        if (accordion.classList.contains('accordion-round-item')) accordionClasses.push('accordion-round-item');
        if (accordion.classList.contains('accordion-color-blue')) accordionClasses.push('accordion-color-blue');
        if (accordion.classList.contains('accordion-color-red')) accordionClasses.push('accordion-color-red');
        if (accordion.classList.contains('accordion-color-green')) accordionClasses.push('accordion-color-green');

        // Проверяем наличие data-bs-show
        const hasShowAll = accordionBtns[0].hasAttribute('data-bs-show');

        // Формируем HTML код
        let codeHTML = `<div class="${accordionClasses.join(' ')}">\n`;
        codeHTML += '    <div class="accordion-item">\n';
        codeHTML += `        <button class="accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1"${hasShowAll ? ' data-bs-show="all"' : ''}>\n`;
        codeHTML += '            Accordion 1\n';
        codeHTML += '        </button>\n';
        codeHTML += '        <div id="collapse1" class="accordion-collapse collapse">\n';
        codeHTML += '            <div class="accordion-body">\n';
        codeHTML += '                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam deserunt tempore laborum quae hic eligendi, quia laboriosam velit rerum architecto!\n';
        codeHTML += '            </div>\n';
        codeHTML += '        </div>\n';
        codeHTML += '    </div>\n';
        codeHTML += '</div>';

        // Экранируем HTML символы для отображения
        codeHTML = codeHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Обновляем содержимое code блока
        codeBlock.innerHTML = codeHTML;
        
        // Если используется Prism.js, обновляем подсветку
        if (window.Prism) {
            Prism.highlightElement(codeBlock);
        }
    }

    // Обработчик изменения контролов
    controls.forEach(control => {
        control.addEventListener('change', function() {
            if (this.dataset.class) {
                // Обработка классов
                if (this.type === 'radio') {
                    // Удаляем все цветовые классы перед добавлением нового
                    accordion.classList.remove('accordion-color-blue', 'accordion-color-red', 'accordion-color-green');
                    if (this.checked && this.dataset.class) {
                        accordion.classList.add(this.dataset.class);
                    }
                } else {
                    // Обычные классы (border, round, round-item)
                    accordion.classList.toggle(this.dataset.class, this.checked);
                }
            } else if (this.dataset.attribute) {
                // Обработка атрибута Show All
                accordionBtns.forEach(btn => {
                    if (this.checked) {
                        btn.setAttribute(this.dataset.attribute, this.dataset.value);
                    } else {
                        btn.removeAttribute(this.dataset.attribute);
                    }
                });
            }
            
            // Обновляем код после каждого изменения
            updateCodeDisplay();
        });
    });

    // Инициализируем отображение кода при загрузке
    updateCodeDisplay();

    const buttons = document.querySelectorAll(".accordion-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const target = document.querySelector(this.dataset.bsTarget);
            const isOpen = target.classList.contains("show");
            const showAll = this.hasAttribute("data-bs-show");

            if (!showAll) {
                // Закрываем только обычные аккордеоны, не трогая те, у которых data-bs-show="all"
                document.querySelectorAll(".accordion-collapse").forEach(collapse => {
                    const parentButton = document.querySelector(`[data-bs-target="#${collapse.id}"]`);
                    if (collapse !== target && !parentButton.hasAttribute("data-bs-show")) {
                        collapse.classList.remove("show");
                    }
                });

                document.querySelectorAll(".accordion-btn").forEach(btn => {
                    if (btn !== this && !btn.hasAttribute("data-bs-show")) {
                        btn.classList.remove("active");
                    }
                });
            }

            if (isOpen) {
                closeAccordion(target);
                this.classList.remove("active");
            } else {
                openAccordion(target);
                this.classList.add("active");
            }
        });
    });

    function openAccordion(element) {
        // Сначала устанавливаем высоту в 0, чтобы анимация работала корректно
        // Запускаем reflow
        element.offsetHeight;
        // Устанавливаем реальную высоту
        element.classList.add("show");
    }

    function closeAccordion(element) {
        // Устанавливаем текущую высоту перед закрытием
        // Запускаем reflow
        element.offsetHeight;
        // Закрываем
        element.classList.remove("show");
    }
});
