document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-bs-toggle="breadcrumb"]').forEach(breadcrumb => {
        let separators = [];

        // Если задан data-bs-separator, используем его
        if (breadcrumb.dataset.bsSeparator) {
            separators = breadcrumb.dataset.bsSeparator.split(",").map(s => s.trim());
        }
        // Если нет, проверяем классы
        else if (breadcrumb.classList.contains("arrow")) {
            separators = [">"];
        } else if (breadcrumb.classList.contains("slash")) {
            separators = ["/"];
        } else {
            separators = [">"]; // Значение по умолчанию
        }

        let items = breadcrumb.querySelectorAll("a");

        items.forEach((item, index) => {
            if (index < items.length - 1) {
                let separator = separators[index % separators.length]; // Чередуем разделители
                item.setAttribute("data-separator", separator);
            }
        });
    });
});
