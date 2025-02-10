document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-bs-toggle='popover']");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", function () {
            showPopover(button);
        });

        button.addEventListener("mouseleave", function () {
            hidePopover(button);
        });
    });

    function showPopover(button) {
        let popover = document.createElement("div");
        popover.classList.add("custom-popover");
        popover.textContent = button.getAttribute("data-bs-content");

        document.body.appendChild(popover);

        const rect = button.getBoundingClientRect();
        const placement = button.getAttribute("data-bs-placement");

        positionPopover(popover, rect, placement);
        
        button._popover = popover; // Сохраняем popover в свойство кнопки
    }

    function hidePopover(button) {
        if (button._popover) {
            button._popover.remove();
            button._popover = null;
        }
    }

    function positionPopover(popover, rect, placement) {
        const offset = 10;
        switch (placement) {
            case "top":
                popover.style.left = `${rect.left + rect.width / 2 - popover.offsetWidth / 2}px`;
                popover.style.top = `${rect.top - popover.offsetHeight - offset}px`;
                break;
            case "right":
                popover.style.left = `${rect.right + offset}px`;
                popover.style.top = `${rect.top + rect.height / 2 - popover.offsetHeight / 2}px`;
                break;
            case "bottom":
                popover.style.left = `${rect.left + rect.width / 2 - popover.offsetWidth / 2}px`;
                popover.style.top = `${rect.bottom + offset}px`;
                break;
            case "left":
                popover.style.left = `${rect.left - popover.offsetWidth - offset}px`;
                popover.style.top = `${rect.top + rect.height / 2 - popover.offsetHeight / 2}px`;
                break;
        }
    }
});
