document.addEventListener("DOMContentLoaded", function () {
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
                        closeAccordion(collapse);
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
        element.style.height = element.scrollHeight + "px";
        element.classList.add("show");
    }

    function closeAccordion(element) {
        element.style.height = element.scrollHeight + "px"; // Фикс для плавного закрытия
        setTimeout(() => {
            element.style.height = "0px";
            element.classList.remove("show");
        }, 1);
    }
});
