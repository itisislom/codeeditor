class UIAnimations {
    constructor() {
        this.setupAnimations();
    }

    setupAnimations() {
        this.setupButtonAnimations();
        this.setupPanelAnimations();
        this.setupTooltips();
    }

    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.toolbar-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('button-press');
                setTimeout(() => button.classList.remove('button-press'), 200);
            });
        });
    }

    setupPanelAnimations() {
        const panels = document.querySelectorAll('.sidebar, .panel');
        panels.forEach(panel => {
            panel.addEventListener('transitionend', () => {
                panel.classList.remove('animated');
            });
        });
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                // Позиционирование подсказки
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.bottom + 5}px`;
            });

            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }
} 