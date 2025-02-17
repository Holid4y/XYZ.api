document.addEventListener("DOMContentLoaded", function() {
    const placeholders = document.querySelectorAll('.placeholder[placeholder-bs-line]');

    placeholders.forEach(placeholder => {
        const lines = parseInt(placeholder.getAttribute('placeholder-bs-line')) || 1;

        // Очищаем содержимое плейсхолдера
        placeholder.innerHTML = '';

        // Создаем линии плейсхолдера
        for (let i = 0; i < lines; i++) {
            const line = document.createElement('div');
            line.classList.add('placeholder-line');

            // Добавляем анимацию, если она указана
            if (placeholder.classList.contains('placeholder-wave')) {
                line.classList.add('placeholder-wave');
            } else if (placeholder.classList.contains('placeholder-pulse')) {
                line.classList.add('placeholder-pulse');
            } else if (placeholder.classList.contains('placeholder-glow')) {
                line.classList.add('placeholder-glow');
            }

            placeholder.appendChild(line);
        }
    });
});