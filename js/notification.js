window.showNotification = function (options) {
    const { 
        title = "Уведомление", 
        message = "", 
        type = "notification-simple", 
        position = "bottom right", 
        timeout = 500,
        srcImg = "",      // Новый параметр для изображения
        footerButtons = [] // Массив кнопок для футера
    } = options;

    const positions = {
        "top left": "top-left",
        "top center": "top-center",
        "top right": "top-right",
        "left center": "left-center",
        "right center": "right-center",
        "bottom left": "bottom-left",
        "bottom center": "bottom-center",
        "bottom right": "bottom-right",
        "top": "top",
        "bottom": "bottom",
        "left": "left",
        "right": "right",
        "center": "center",
    };

    const positionClass = positions[position] || "bottom-right";

    // Создаем контейнер уведомлений, если его нет
    let container = document.querySelector(`.notifications-container.${positionClass}`);
    if (!container) {
        container = document.createElement("div");
        container.className = `notifications-container ${positionClass}`;
        document.body.appendChild(container);
    }

    // Создаем уведомление
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Формируем HTML содержимое уведомления
    let notificationHTML = `
        <div class="notification-header">
            <div class="notification-logo-container">
                ${srcImg ? `<img src="${srcImg}" alt="logo" class="notification-logo">` : ""}
                <span class="notification-title">${title}</span>
            </div>
            <button class="notification-close">&times;</button>
        </div>
        ${message ? `<div class="notification-body">${message}</div>` : ""}
    `;

    // Добавляем футер с кнопками, если есть
    if (footerButtons.length > 0) {
        let footerHTML = '<div class="notification-footer">';
        footerButtons.forEach(button => {
            footerHTML += `
                <button class="notification-footer-btn" onclick="${button.onClick}">
                    ${button.label}
                </button>
            `;
        });
        footerHTML += '</div>';
        notificationHTML += footerHTML;
    }

    // Вставляем HTML в уведомление
    notification.innerHTML = notificationHTML;
    container.appendChild(notification);

    // Закрытие по кнопке
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Авто-закрытие через timeout
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 300);
        }
    }, timeout);
};
