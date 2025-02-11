document.addEventListener("DOMContentLoaded", function () {
    // Инициализация tooltip
    const tooltipButtons = document.querySelectorAll("[data-bs-toggle='tooltip']");
    tooltipButtons.forEach(button => {
        button.addEventListener("mouseenter", function () {
            showElement(button, "custom-tooltip");
        });
        button.addEventListener("mouseleave", function () {
            hideElement(button);
        });
    });

    // Инициализация popover
    const popoverButtons = document.querySelectorAll("[data-bs-toggle='popover']");
    popoverButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            togglePopover(button);
        });
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".custom-popover").forEach(popover => popover.remove());
    });

    function showElement(button, className) {
        let element = document.createElement("div");
        element.classList.add(className);
        element.textContent = button.getAttribute("data-bs-content");
        document.body.appendChild(element);
        positionElement(element, button, button.getAttribute("data-bs-placement"));
        button._element = element;
    }

    function hideElement(button) {
        if (button._element) {
            button._element.remove();
            button._element = null;
        }
    }

    function togglePopover(button) {
        if (button._element) {
            button._element.remove();
            button._element = null;
        } else {
            showElement(button, "custom-popover");
        }
    }

    function positionElement(element, button, placement) {
        const rect = button.getBoundingClientRect();
        const offset = 10;
        switch (placement) {
            case "top":
                element.style.left = `${rect.left + rect.width / 2 - element.offsetWidth / 2}px`;
                element.style.top = `${rect.top - element.offsetHeight - offset}px`;
                break;
            case "right":
                element.style.left = `${rect.right + offset}px`;
                element.style.top = `${rect.top + rect.height / 2 - element.offsetHeight / 2}px`;
                break;
            case "bottom":
                element.style.left = `${rect.left + rect.width / 2 - element.offsetWidth / 2}px`;
                element.style.top = `${rect.bottom + offset}px`;
                break;
            case "left":
                element.style.left = `${rect.left - element.offsetWidth - offset}px`;
                element.style.top = `${rect.top + rect.height / 2 - element.offsetHeight / 2}px`;
                break;
        }
    }
});
