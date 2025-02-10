class FrameResizer {
    constructor() {
        this.frames = document.querySelectorAll('#frame');
        this.init();
    }

    init() {
        this.frames.forEach(frame => {
            const resizer = document.createElement('div');
            resizer.className = 'frame-resizer';

            const widthIndicator = document.createElement('div');
            widthIndicator.className = 'width-indicator';
            frame.appendChild(widthIndicator);
            frame.appendChild(resizer);

            this.updateWidthIndicator(frame, widthIndicator);

            const savedWidth = localStorage.getItem(`frame-${frame.dataset.id || 'default'}`);
            if (savedWidth) {
                frame.style.width = savedWidth;
                this.updateWidthIndicator(frame, widthIndicator);
            }

            let startX, startWidth;

            const startResize = (e) => {
                startX = e.clientX;
                startWidth = frame.offsetWidth;
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
                document.body.style.cursor = 'ew-resize';
                frame.style.userSelect = 'none';
                frame.classList.add('resizing'); // Добавляем класс при нажатии
                widthIndicator.classList.add('active');
            };

            const resize = (e) => {
                const width = startWidth + (e.clientX - startX);
                const newWidth = Math.min(Math.max(360, width), window.innerWidth);
                frame.style.width = newWidth + 'px';
                this.updateWidthIndicator(frame, widthIndicator);
            };

            const stopResize = () => {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
                document.body.style.cursor = '';
                frame.style.userSelect = '';
                frame.classList.remove('resizing'); // Убираем класс при отпускании кнопки
                widthIndicator.classList.remove('active');
                localStorage.setItem(`frame-${frame.dataset.id || 'default'}`, frame.style.width);
            };

            resizer.addEventListener('mousedown', startResize);

            // Следим за изменением размера окна
            window.addEventListener('resize', () => {
                this.updateWidthIndicator(frame, widthIndicator);
            });
        });
    }

    updateWidthIndicator(frame, indicator) {
        indicator.textContent = `${Math.round(frame.offsetWidth)}px`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FrameResizer();
});
