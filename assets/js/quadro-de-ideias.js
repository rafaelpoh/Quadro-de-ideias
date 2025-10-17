document.addEventListener('DOMContentLoaded', () => {
    const notebook = document.getElementById('notebook');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const textColorPicker = document.getElementById('textColorPicker');
    const colorPickerLabel = document.getElementById('colorPickerLabel');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');

    const storageKey = 'myNotebookContent'; // Changed key to reflect HTML content

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
    function applyTextColor(color) {
        notebook.focus();
        document.execCommand('foreColor', false, color);
    }

    function applyFontSize(size) {
        notebook.focus();
        document.execCommand('fontSize', false, size);
    }

    // --- Event Listeners ---
    saveButton.addEventListener('click', saveContent);
    clearButton.addEventListener('click', clearContent);

    undoButton.addEventListener('click', () => {
        document.execCommand('undo');
    });

    redoButton.addEventListener('click', () => {
        document.execCommand('redo');
    });
    
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