class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Light',
                values: {
                    '--macos-bg': '#ffffff',
                    '--macos-sidebar': '#f5f5f5',
                    '--macos-toolbar': '#e7e7e7',
                    '--macos-text': '#333333',
                    '--macos-border': '#d1d1d1'
                }
            },
            dark: {
                name: 'Dark',
                values: {
                    '--macos-bg': '#1e1e1e',
                    '--macos-sidebar': '#252526',
                    '--macos-toolbar': '#333333',
                    '--macos-text': '#ffffff',
                    '--macos-border': '#454545'
                }
            },
            // Добавьте другие темы здесь
        };
        
        this.init();
    }

    init() {
        this.setupThemeSelector();
        this.setupSystemThemeDetection();
    }

    setupThemeSelector() {
        const selector = document.getElementById('theme-select');
        selector.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }

    setupSystemThemeDetection() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            const theme = e.matches ? 'dark' : 'light';
            this.applyTheme(theme);
        });
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        document.body.classList.add('theme-transition');
        Object.entries(theme.values).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        // Применяем тему к Monaco Editor
        monaco.editor.setTheme(themeName === 'dark' ? 'vs-dark' : 'vs');
    }
} 