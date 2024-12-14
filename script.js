document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('line-numbers');
    let currentLanguage = 'plain';
    
    // Функция обновления номеров строк
    function updateLineNumbers() {
        const lines = editor.innerText.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('\n');
    }

    // Функция для подсветки синтаксиса
    function highlightCode() {
        if (currentLanguage !== 'plain') {
            const code = editor.innerText;
            const highlighted = Prism.highlight(code, Prism.languages[currentLanguage], currentLanguage);
            editor.innerHTML = highlighted;
            
            // Восстанавливаем позицию курсора
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    // Обработчик изменения языка
    document.getElementById('language-select').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        highlightCode();
    });

    // Форматирование текста
    const formatButtons = {
        bold: document.getElementById('bold-btn'),
        italic: document.getElementById('italic-btn'),
        underline: document.getElementById('underline-btn')
    };

    Object.entries(formatButtons).forEach(([format, btn]) => {
        btn.addEventListener('click', () => {
            document.execCommand(format, false, null);
            btn.classList.toggle('active');
        });
    });

    // Шрифты и размеры
    document.getElementById('font-family').addEventListener('change', (e) => {
        document.execCommand('fontName', false, e.target.value);
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
    });

    // Темная тема
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
        document.body.classList.toggle('dark-theme', e.target.checked);
    });

    // Обработка табуляции
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    });

    // Обновление подсветки синтаксиса при вводе
    let timeout;
    editor.addEventListener('input', () => {
        updateLineNumbers();
        clearTimeout(timeout);
        timeout = setTimeout(highlightCode, 200);
    });

    // Сохранение/загрузка файлов
    document.getElementById('save-file').addEventListener('click', () => {
        const text = editor.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.innerText = e.target.result;
                updateLineNumbers();
                highlightCode();
            };
            reader.readAsText(file);
        }
    });

    // Инициализация
    updateLineNumbers();
}); 