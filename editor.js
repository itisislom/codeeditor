require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});

let editor;
let currentTheme = 'vs-dark';

require(['vs/editor/editor.main'], function() {
    // Инициализация редактора
    editor = monaco.editor.create(document.getElementById('editor-area'), {
        value: '',
        language: 'plaintext',
        theme: currentTheme,
        fontFamily: 'Fira Code',
        fontSize: 16,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        minimap: {
            enabled: true
        },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
    });

    // Обработчик позиции курсора
    editor.onDidChangeCursorPosition(e => {
        document.getElementById('cursor-position').textContent = 
            `Строка: ${e.position.lineNumber}, Столбец: ${e.position.column}`;
    });

    // Кнопки управления файлами
    document.getElementById('new-file').addEventListener('click', () => {
        editor.setValue('');
    });

    document.getElementById('open-file').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.setValue(e.target.result);
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('save-file').addEventListener('click', () => {
        const content = editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'document.txt';
        a.click();
    });

    // Переключение темы
    document.getElementById('theme-toggle').addEventListener('click', () => {
        currentTheme = currentTheme === 'vs-dark' ? 'vs-light' : 'vs-dark';
        monaco.editor.setTheme(currentTheme);
        document.body.classList.toggle('dark-theme');
    });

    // Выбор языка
    document.getElementById('language-select').addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
        document.getElementById('language-status').textContent = e.target.options[e.target.selectedIndex].text;
    });

    // Настройки шрифта
    document.getElementById('font-family').addEventListener('change', (e) => {
        editor.updateOptions({ fontFamily: e.target.value });
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        editor.updateOptions({ fontSize: parseInt(e.target.value) });
    });
});