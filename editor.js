require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});

let editor;
let currentTheme = 'vs-light';
let tabs = [];
let currentTabIndex = 0;

function saveState() {
    const state = {
        tabs: tabs,
        currentTabIndex: currentTabIndex,
        theme: currentTheme
    };
    localStorage.setItem('editorState', JSON.stringify(state));
}

function createTab(content = '', name = 'Новый файл') {
    const tab = {
        content: content,
        name: name,
        id: Date.now()
    };
    tabs.push(tab);
    currentTabIndex = tabs.length - 1;
    updateTabsUI();
    return tab;
}

function updateTabsUI() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = '';
    
    tabs.forEach((tab, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${index === currentTabIndex ? 'active' : ''}`;
        tabElement.innerHTML = `
            <span>${tab.name}</span>
            <button class="close-tab">×</button>
        `;
        
        // Обработчик клика по вкладке
        tabElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-tab')) {
                switchTab(index);
            }
        });

        // Обработчик закрытия вкладки
        tabElement.querySelector('.close-tab').addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(index);
        });

        tabsContainer.appendChild(tabElement);
    });
    
    if (editor) {
        editor.setValue(tabs[currentTabIndex]?.content || '');
    }
    saveState();
}

function switchTab(index) {
    if (index >= 0 && index < tabs.length) {
        currentTabIndex = index;
        editor.setValue(tabs[index].content);
        updateTabsUI();
    }
}

function closeTab(index) {
    if (tabs.length > 1) {
        tabs.splice(index, 1);
        if (currentTabIndex >= index) {
            currentTabIndex = Math.max(0, currentTabIndex - 1);
        }
        updateTabsUI();
    }
}

require(['vs/editor/editor.main'], function() {
    // Загрузка сохраненного состояния
    const savedState = JSON.parse(localStorage.getItem('editorState') || '{}');
    if (savedState.tabs) {
        tabs = savedState.tabs;
        currentTabIndex = savedState.currentTabIndex;
        currentTheme = savedState.theme || 'vs-light';
    } else {
        createTab();
    }

    // Инициализация редактора
    editor = monaco.editor.create(document.getElementById('editor-area'), {
        value: tabs[currentTabIndex]?.content || '',
        language: 'plaintext',
        theme: currentTheme,
        fontFamily: 'Fira Code',
        fontSize: 16,
        automaticLayout: true,
        minimap: { enabled: window.innerWidth > 768 }
    });

    // Сохранение при изменении содержимого
    editor.onDidChangeModelContent(() => {
        if (tabs[currentTabIndex]) {
            tabs[currentTabIndex].content = editor.getValue();
            saveState();
        }
    });

    // Отслеживание позиции курсора
    editor.onDidChangeCursorPosition(e => {
        document.getElementById('cursor-position').textContent = 
            `Строка: ${e.position.lineNumber}, Столбец: ${e.position.column}`;
    });

    // Обработчики кнопок
    document.getElementById('new-file').addEventListener('click', () => {
        createTab();
    });

    document.getElementById('open-file').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                createTab(e.target.result, file.name);
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('save-file').addEventListener('click', () => {
        const content = editor.getValue();
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = tabs[currentTabIndex].name;
        a.click();
    });

    document.getElementById('theme-toggle').addEventListener('click', () => {
        currentTheme = currentTheme === 'vs-dark' ? 'vs-light' : 'vs-dark';
        monaco.editor.setTheme(currentTheme);
        document.body.classList.toggle('dark-theme');
        saveState();
    });

    // Обработчики для настроек редактора
    document.getElementById('language-select').addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
        document.getElementById('language-status').textContent = 
            e.target.options[e.target.selectedIndex].text;
    });

    document.getElementById('font-family').addEventListener('change', (e) => {
        editor.updateOptions({ fontFamily: e.target.value });
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        editor.updateOptions({ fontSize: parseInt(e.target.value) });
    });

    // Восстановление темы
    if (currentTheme === 'vs-dark') {
        document.body.classList.add('dark-theme');
        monaco.editor.setTheme(currentTheme);
    }

    // Начальное обновление UI
    updateTabsUI();
});