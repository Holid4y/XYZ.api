document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".progress").forEach(progress => {
      const progressBar = progress.querySelector(".progress-bar");
      const value = parseInt(progress.getAttribute("data-value"), 10) || 0;
      const heightAttr = progress.getAttribute("data-height");
      const showStatus = progress.getAttribute("data-status") === "true";
  
      // Проверка на hover(начало, конец)
      let match = heightAttr?.match(/hover\((\d+),\s*(\d+)\)/);
      let initialHeight = match ? parseInt(match[1], 10) : parseInt(heightAttr, 10) || 30;
      let hoverHeight = match ? parseInt(match[2], 10) : initialHeight;
  
      // Устанавливаем начальную высоту
      progress.style.height = `${initialHeight}px`;
  
      // Анимация ширины
      progressBar.style.width = `${value}%`;
  
      // Отображение процентов, если включено
      if (showStatus) {
        progressBar.textContent = `${value}%`;
      }
  
      // Обработчик hover
      if (match) {
        progress.addEventListener("mouseenter", () => {
          progress.style.height = `${hoverHeight}px`;
        });
        progress.addEventListener("mouseleave", () => {
          progress.style.height = `${initialHeight}px`;
        });
      }
    });
  });
  