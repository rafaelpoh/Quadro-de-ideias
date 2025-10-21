document.addEventListener('DOMContentLoaded', () => {
    const notebook = document.getElementById('notebook');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const textColorPicker = document.getElementById('textColorPicker');
    const colorPickerLabel = document.getElementById('colorPickerLabel');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const loadingSpinner = document.querySelector('.loading-spinner');

    const storageKey = 'myNotebookContent';
    let debounceTimer;

    // Set initial label color
    colorPickerLabel.style.color = textColorPicker.value;

    // --- Funções de Persistência ---
    function saveContent(show_alert = true) {
        loadingSpinner.style.display = 'block';
        const contentToSave = notebook.innerHTML;
        localStorage.setItem(storageKey, contentToSave);
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            if(show_alert){
                alert('Conteúdo salvo com sucesso!');
            }
        }, 500);
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
    saveButton.addEventListener('click', () => saveContent());
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
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            saveContent(false);
        }, 1000); // Salva 1 segundo após o usuário parar de digitar
    });
});