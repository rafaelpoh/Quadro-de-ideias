document.addEventListener('DOMContentLoaded', () => {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteContainer = document.getElementById('note-container');
    const archivedNoteContainer = document.getElementById('archived-note-container');
    const noteColorPicker = document.getElementById('noteColorPicker');
    const fontColorPicker = document.getElementById('fontColorPicker');
    const showArchivedBtn = document.getElementById('showArchivedBtn');
    const archivedNotesContainer = document.getElementById('archived-notes-container');

    // --- Initialize SortableJS ---
    new Sortable(noteContainer, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: saveNotes
    });

    new Sortable(archivedNoteContainer, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: saveNotes
    });

    // --- Data Migration and Loading ---
    function loadAndDisplayNotes() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        let archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];

        // Data migration for notes
        if (notes.length > 0) {
            if (typeof notes[0] === 'string') {
                notes = notes.map(noteText => ({ text: noteText, color: '#ffff00', fontColor: '#000000' }));
                saveNotes(); 
            } 
            else if (notes[0].fontColor === undefined) {
                notes = notes.map(note => ({ ...note, fontColor: '#000000' }));
                saveNotes();
            }
        }

        // Data migration for archived notes
        if (archivedNotes.length > 0) {
            if (typeof archivedNotes[0] === 'string') {
                archivedNotes = archivedNotes.map(noteText => ({ text: noteText, color: '#ffff00', fontColor: '#000000' }));
                saveNotes(); 
            } 
            else if (archivedNotes[0].fontColor === undefined) {
                archivedNotes = archivedNotes.map(note => ({ ...note, fontColor: '#000000' }));
                saveNotes();
            }
        }
        
        noteContainer.innerHTML = '';
        archivedNoteContainer.innerHTML = '';

        notes.forEach(noteData => addNote(noteData, false));
        archivedNotes.forEach(noteData => addNote(noteData, true));
    }

    addNoteBtn.addEventListener('click', () => {
        const newNoteData = { 
            text: '', 
            color: noteColorPicker.value,
            fontColor: fontColorPicker.value
        };
        addNote(newNoteData, false);
        saveNotes();
    });

    showArchivedBtn.addEventListener('click', () => {
        const isHidden = archivedNotesContainer.style.display === 'none';
        archivedNotesContainer.style.display = isHidden ? 'block' : 'none';
        showArchivedBtn.textContent = isHidden ? 'Ocultar Arquivados' : 'Ver Arquivados';
    });

    function addNote(noteData, isArchived) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.style.backgroundColor = noteData.color;

        const noteContent = document.createElement('textarea');
        noteContent.classList.add('note-content');
        noteContent.placeholder = 'Digite seu lembrete aqui...';
        noteContent.value = noteData.text;
        noteContent.style.color = noteData.fontColor;
        noteDiv.appendChild(noteContent);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';
        noteDiv.appendChild(deleteBtn);

        const archiveBtn = document.createElement('button');
        archiveBtn.classList.add('archive-btn');
        archiveBtn.innerHTML = isArchived ? '&#x21A5;' : '&#x1F4C2;'; // Unarchive vs Archive icon
        noteDiv.appendChild(archiveBtn);

        if (isArchived) {
            archivedNoteContainer.appendChild(noteDiv);
        } else {
            noteContainer.appendChild(noteDiv);
        }

        // Event listeners
        noteContent.addEventListener('input', saveNotes);
        deleteBtn.addEventListener('click', () => {
            noteDiv.remove();
            saveNotes();
        });
        archiveBtn.addEventListener('click', () => {
            const noteElement = archiveBtn.closest('.note');
            if (isArchived) {
                archivedNoteContainer.removeChild(noteElement);
                noteContainer.appendChild(noteElement);
                archiveBtn.innerHTML = '&#x1F4C2;'; // Change to archive icon
                isArchived = false;
            } else {
                noteContainer.removeChild(noteElement);
                archivedNoteContainer.appendChild(noteElement);
                archiveBtn.innerHTML = '&#x21A5;'; // Change to unarchive icon
                isArchived = true;
            }
            saveNotes();
        });
    }

    function saveNotes() {
        const notesToSave = Array.from(noteContainer.querySelectorAll('.note')).map(noteDiv => {
            const content = noteDiv.querySelector('.note-content').value;
            const color = noteDiv.style.backgroundColor;
            const fontColor = noteDiv.querySelector('.note-content').style.color;
            return { text: content, color: color, fontColor: fontColor };
        });
        const archivedNotesToSave = Array.from(archivedNoteContainer.querySelectorAll('.note')).map(noteDiv => {
            const content = noteDiv.querySelector('.note-content').value;
            const color = noteDiv.style.backgroundColor;
            const fontColor = noteDiv.querySelector('.note-content').style.color;
            return { text: content, color: color, fontColor: fontColor };
        });
        localStorage.setItem('notes', JSON.stringify(notesToSave));
        localStorage.setItem('archivedNotes', JSON.stringify(archivedNotesToSave));
    }

    // Initial load
    loadAndDisplayNotes();
});