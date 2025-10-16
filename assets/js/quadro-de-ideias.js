// Obtém referências para os elementos do HTML
const notebook = document.getElementById('notebook');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');

// A chave que usaremos para salvar no localStorage
const storageKey = 'myNotebookText';

// Função para salvar o texto no localStorage
function saveText() {
    const textToSave = notebook.value;
    localStorage.setItem(storageKey, textToSave);
    alert('Texto salvo com sucesso!');
}

// Função para carregar o texto do localStorage
function loadText() {
    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
        notebook.value = savedText;
        alert('Texto carregado com sucesso!');
    } else {
        alert('Nenhum texto salvo para carregar.');
    }
}

// Função para limpar o texto
function clearText() {
    // Limpa a área de texto na página
    notebook.value = '';
    // Remove o item do localStorage
    localStorage.removeItem(storageKey);
    alert('Texto limpo e removido do armazenamento local!');
}

// Adiciona os "ouvintes" de eventos aos botões
saveButton.addEventListener('click', saveText);
loadButton.addEventListener('click', loadText);
clearButton.addEventListener('click', clearText);

// Opcional: Carregar o texto automaticamente ao abrir a página
// Essa é uma forma mais "inteligente" de um bloco de notas
// Isso faz com que o texto persista mesmo se o usuário não clicar em "Salvar"
window.addEventListener('load', () => {
    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
        notebook.value = savedText;
    }
});