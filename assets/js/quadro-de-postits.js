document.addEventListener('DOMContentLoaded', () => {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteContainer = document.getElementById('note-container');
    const noteColorPicker = document.getElementById('noteColorPicker');
    const fontColorPicker = document.getElementById('fontColorPicker');

    // --- Data Migration and Loading ---
    function loadAndDisplayNotes() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        // Data migration
        if (notes.length > 0) {
            // from string array to object array
            if (typeof notes[0] === 'string') {
                notes = notes.map(noteText => ({ text: noteText, color: '#ffff00', fontColor: '#000000' }));
                saveNotes(notes); 
            } 
            // from {text, color} to {text, color, fontColor}
            else if (notes[0].fontColor === undefined) {
                notes = notes.map(note => ({ ...note, fontColor: '#000000' }));
                saveNotes(notes);
            }
        }
        
        noteContainer.innerHTML = ''; // Clear existing notes before loading
        notes.forEach(noteData => {
            addNote(noteData);
        });
    }

    addNoteBtn.addEventListener('click', () => {
        const newNoteData = { 
            text: '', 
            color: noteColorPicker.value,
            fontColor: fontColorPicker.value
        };
        addNote(newNoteData);
        saveNotes();
    });

    function addNote(noteData) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.style.backgroundColor = noteData.color;

        const noteContent = document.createElement('textarea');
        noteContent.classList.add('note-content');
        noteContent.placeholder = 'Digite seu lembrete aqui...';
        noteContent.value = noteData.text;
        noteContent.style.color = noteData.fontColor; // Set font color
        noteDiv.appendChild(noteContent);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';
        noteDiv.appendChild(deleteBtn);

        noteContainer.appendChild(noteDiv);

        // Event listeners
        noteContent.addEventListener('input', saveNotes);
        deleteBtn.addEventListener('click', () => {
            noteDiv.remove();
            saveNotes();
        });
    }

    function saveNotes() {
        const noteElements = document.querySelectorAll('.note');
        const notesToSave = Array.from(noteElements).map(noteDiv => {
            const content = noteDiv.querySelector('.note-content').value;
            const color = noteDiv.style.backgroundColor;
            const fontColor = noteDiv.querySelector('.note-content').style.color;
            return { text: content, color: color, fontColor: fontColor };
        });
        localStorage.setItem('notes', JSON.stringify(notesToSave));
    }

    // Initial load
    loadAndDisplayNotes();
});