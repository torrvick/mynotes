import * as api from './api.js';
import * as render from './render.js';

const noteForm = document.querySelector('.note-form');
const titleInput = document.querySelector('.title-input');
const contentInput = document.querySelector('.content-input');
const notesList = document.querySelector('.notes-list');
let allNotes = [];

document.addEventListener('click', e => {
    const target = e.target;
    // const action = target.dataset.action;
    const actionButton = e.target.closest('[data-action]');

    if (actionButton) {
        const action = actionButton.dataset.action;

        if (action === 'note-menu') {
            const currentNote = target.closest('.note');
            const currentMenu = currentNote.querySelector('.note-menu');
            const currentMenubutton = target;
            toggleMenu(currentMenu);
            toggleMenuButton(currentMenubutton);
        }

        if (target.closest('.note-inmenu-button')) {
            const currentNote = target.closest('.note');
            const currentNoteId = currentNote.dataset.noteId;
            const currentMenu = currentNote.querySelector('.note-menu');
            const clickedMenuButton = findClickedMenuButtons();
    
            if (action === 'note-delete') {
                api.deleteNote(currentNoteId)
                    .then(() => {
                        return updateNotes();
                    }).catch(error => {
                        console.error(error);
                    });
            }
    
            if (action === 'note-edit') {
                api.getOneNote(currentNoteId)
                    .then(note => {
                        contentInput.value = note.content;
                        contentInput.focus();
                        adjustTextareaHeight(contentInput);
                        toggleAddButton();
                        noteForm.dataset.action = "edit";
                        noteForm.dataset.noteId = currentNoteId;
                        // console.log(currentNoteId);
                        // console.log(allNotes.find(note => note.id == currentNoteId));
                    });
            }
    
            toggleMenu(currentMenu);
            toggleMenuButton(clickedMenuButton);
        }

    }


    if (!target.closest('.note-menu') && !target.closest('.note-menu-button')) {
        const openedMenu = findOpenedMenues();
        if (openedMenu) {
            openedMenu.classList.remove('note-menu-open');
        }
        const clickedMenuButton = findClickedMenuButtons();
        if (clickedMenuButton) {
            clickedMenuButton.classList.remove('clicked');
        }
    }

    

    if (target.matches('input[type="checkbox"]')) {
        // console.log('sdfsdfsd');
        const currentNote = target.closest('.note');
        const currentNoteId = currentNote.dataset.noteId;
        const currentCheck = target;
        const isChecked = currentCheck.checked;
        const currentCheckLabel = currentCheck.closest('li').textContent;
        api.getOneNote(currentNoteId)
            .then(note => {
                let unMarked = note.content;
                const checkIndex = unMarked.indexOf(currentCheckLabel) - 2;
                String.prototype.replaceAt = function (index, replacement) {
                    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
                }
                if (isChecked) {
                    unMarked = unMarked.replaceAt(checkIndex, 'x');
                } else {
                    unMarked = unMarked.replaceAt(checkIndex, ' ');
                }
                return unMarked;
            })
            .then(unMarked => {
                api.editNote(currentNoteId, unMarked);
            })
        // .then(updateNotes());
    }


});

noteForm.addEventListener('submit', e => {
    e.preventDefault();
    const formAction = noteForm.dataset.action;
    if (formAction === 'add') {
        api.addNote(contentInput.value)
            .then(() => {
                clearTextarea(contentInput);
                return updateNotes(); // Возвращаем промис для обновления списка заметок
            })
            .then(() => {
                // Дополнительные действия после обновления списка заметок
            })
            .catch(error => {
                console.error(error);
            });
    }

    if (formAction === 'edit') {
        api.editNote(noteForm.dataset.noteId, contentInput.value)
            .then(() => {
                clearTextarea(contentInput);
                noteForm.dataset.action = "add";
                noteForm.removeAttribute('data-note-id');
                return updateNotes(); // Возвращаем промис для обновления списка заметок
            })
            .then(() => {
                noteForm.removeAttribute('data-note-id');
                // Дополнительные действия после обновления списка заметок
            })
            .catch(error => {
                console.error(error);
            });
    }
});

contentInput.addEventListener('input', function () {
    adjustTextareaHeight(this);
    toggleAddButton();
    if (contentInput.value.trim().length == 0) {
        noteForm.removeAttribute('data-note-id');
        noteForm.dataset.action = "add";
    }
});

// Получение списка заметок при загрузке страницы
window.onload = () => {
    updateNotes();
};

function updateNotes() {
    api.getNotes()
        .then(notes => {
            allNotes = notes;
            render.renderNotes(notes);
        });
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function clearTextarea(textarea) {
    textarea.value = '';
    adjustTextareaHeight(textarea);
}

function findOpenedMenues() {
    return document.querySelector('.note-menu-open');
}

function findClickedMenuButtons() {
    return document.querySelector('.note-menu-icon.clicked');
}

function toggleMenuButton(button) {
    const clickedMenuButtons = findClickedMenuButtons();
    if (clickedMenuButtons && clickedMenuButtons != button) {
        clickedMenuButtons.classList.remove('clicked');
    }
    button.classList.toggle('clicked');
}

function toggleMenu(menu) {
    const openedMenu = findOpenedMenues();
    if (openedMenu && openedMenu != menu) {
        openedMenu.classList.remove('note-menu-open');
    }
    menu.classList.toggle('note-menu-open');
}

function toggleAddButton() {
    const addNoteButton = noteForm.querySelector('.add-note-button');
    if (contentInput.value.trim().length > 0) {
        addNoteButton.removeAttribute('disabled');
    } else {
        addNoteButton.setAttribute('disabled', '');
    }
}

