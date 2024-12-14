class FileHandler {
    constructor(editor) {
        this.editor = editor;
        this.currentFile = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Новый файл
        document.getElementById('new-file').addEventListener('click', () => {
            if (confirm('Создать новый файл? Несохраненные изменения будут потеряны.')) {
                this.editor.setValue('');
                this.currentFile = null;
            }
        });

        // Открытие файла
        document.getElementById('open-file').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.openFile(file);
            }
        });

        // Сохранение файла
        document.getElementById('save-file').addEventListener('click', () => {
            this.saveFile();
        });
    }

    openFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editor.setValue(e.target.result);
            this.currentFile = file;
            
            // Определение языка по расширению
            const extension = file.name.split('.').pop().toLowerCase();
            const languageSelect = document.getElementById('language-select');
            
            const languageMap = {
                'js': 'javascript',
                'ts': 'typescript',
                'py': 'python',
                'html': 'html',
                'css': 'css',
                'java': 'java',
                'cs': 'csharp',
                'cpp': 'cpp',
                'h': 'cpp'
            };

            if (languageMap[extension]) {
                languageSelect.value = languageMap[extension];
                languageSelect.dispatchEvent(new Event('change'));
            }
        };
        reader.readAsText(file);
    }

    saveFile() {
        const content = this.editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFile ? this.currentFile.name : 'document.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Инициализация после загрузки редактора
require(['vs/editor/editor.main'], function() {
    const fileHandler = new FileHandler(editor);
}); 