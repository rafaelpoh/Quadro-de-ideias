document.addEventListener('DOMContentLoaded', () => {
    const notebook = document.getElementById('notebook');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const textColorPicker = document.getElementById('textColorPicker');
    const colorPickerLabel = document.getElementById('colorPickerLabel');
    const fontSizeSelector = document.getElementById('fontSizeSelector');

    const storageKey = 'myNotebookContent';

    // Set initial label color
    colorPickerLabel.style.color = textColorPicker.value;

    // --- Funções de Persistência ---
    function saveContent() {
        const contentToSave = notebook.innerHTML;
        localStorage.setItem(storageKey, contentToSave);
        alert('Conteúdo salvo com sucesso!');
    }

    function clearContent() {
        notebook.innerHTML = '';
        localStorage.removeItem(storageKey);
        alert('Conteúdo limpo e removido do armazenamento local!');
    }

    // --- Funções da Barra de Ferramentas ---
    function applyStyle(style, value) {
        notebook.focus();
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            const span = document.createElement('span');
            span.style[style] = value;
            span.textContent = selectedText;
            
            range.deleteContents();
            range.insertNode(span);

            // Move o cursor para o final do texto inserido
            range.setStartAfter(span);
            range.setEndAfter(span);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function applyTextColor(color) {
        applyStyle('color', color);
    }

    function applyFontSize(size) {
        const sizeMap = {
            '2': '12px',
            '3': '16px',
            '4': '20px',
            '5': '24px',
            '6': '28px'
        };
        applyStyle('fontSize', sizeMap[size]);
    }

    // --- Event Listeners ---
    saveButton.addEventListener('click', saveContent);
    clearButton.addEventListener('click', clearContent);

    textColorPicker.addEventListener('input', () => {
        const selectedColor = textColorPicker.value;
        colorPickerLabel.style.color = selectedColor;
        applyTextColor(selectedColor);
    });

    fontSizeSelector.addEventListener('change', () => {
        const selectedSize = fontSizeSelector.value;
        applyFontSize(selectedSize);
    });

    // Carregar o conteúdo automaticamente ao abrir a página
    window.addEventListener('load', () => {
        const savedContent = localStorage.getItem(storageKey);
        if (savedContent) {
            notebook.innerHTML = savedContent;
        }
    });

    // Opcional: salvar automaticamente ao parar de digitar
    notebook.addEventListener('input', () => {
        localStorage.setItem(storageKey, notebook.innerHTML);
    });
});