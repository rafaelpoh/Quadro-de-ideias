document.addEventListener('DOMContentLoaded', () => {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteContainer = document.getElementById('note-container');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Carrega as notas salvas ao iniciar
    notes.forEach(noteText => {
        addNote(noteText);
    });

    addNoteBtn.addEventListener('click', () => {
        addNote('');
        saveNotes();
    });

    function addNote(noteText) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');

        const noteContent = document.createElement('textarea');
        noteContent.classList.add('note-content');
        noteContent.placeholder = 'Digite seu lembrete aqui...';
        noteContent.value = noteText;
        noteDiv.appendChild(noteContent);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';
        noteDiv.appendChild(deleteBtn);

        noteContainer.appendChild(noteDiv);

        noteContent.addEventListener('input', saveNotes);
        deleteBtn.addEventListener('click', () => {
            noteDiv.remove();
            saveNotes();
        });
    }

    function saveNotes() {
        const noteElements = document.querySelectorAll('.note-content');
        const notesToSave = Array.from(noteElements).map(note => note.value);
        localStorage.setItem('notes', JSON.stringify(notesToSave));
    }
});