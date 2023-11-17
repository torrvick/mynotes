const noteForm = document.querySelector('.note-form');
const titleInput = document.querySelector('.title-input');
const contentInput = document.querySelector('.content-input');
const notesList = document.querySelector('.notes-list');


// var md = window.markdownit({
//   breaks: true,
//   html: false,
//   linkify: true,
//   typographer: true,
// });
marked.use({
  pedantic: false,
  gfm: true,
  breaks: true,
});

// Функция для отправки запроса на добавление заметки
function addNote() {
  const title = titleInput.value;
  const content = contentInput.value;

  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      titleInput.value = '';
      contentInput.value = '';
      getNotes();
    })
    .catch(error => console.error(error));
}

// Функция для получения списка заметок
function getNotes() {
  fetch('/api/notes')
    .then(response => response.json())
    .then(data => {
      notesList.innerHTML = '';
      data.forEach(note => {
        const noteBlock = document.createElement(`div`);
        noteBlock.dataset.noteId = note.id;
        noteBlock.classList.add('note');
        noteBlock.innerHTML = `<div class="note-header">
                              <h3 class="note-title">${note.title}</h3>
                              <button class="note-menu-button" data-action="note-menu">
                              <img class="note-menu-icon" data-action="note-menu" src="/assets/img/icon_menu.png">
                              </button>
                              </div>`;
        // note_div.innerHTML += `<div class="note-content">${md.render(note.content)}</div>`;
        noteBlock.innerHTML += `<div class="note-content">${marked.parse(note.content)}</div>`;
        noteBlock.innerHTML += `<div class="note-menu">
                                <button class="note-inmenu-button" data-action="note-edit">
                                <img class="note-inmenu-icon" src="/assets/img/icon_edit.png" alt="">Редактировать
                                </button>
                                <button class="note-inmenu-button" data-action="note-share">
                                <img class="note-inmenu-icon" src="/assets/img/icon_share.png" alt="">Поделиться
                                </button>
                                <button class="note-inmenu-button" data-action="note-archive">
                                <img class="note-inmenu-icon" src="/assets/img/icon_archive.png" alt="">Архивировать
                                </button>
                                <button class="note-inmenu-button danger" data-action="note-delete">
                                <img class="note-inmenu-icon" src="/assets/img/icon_trash.png" alt="">Удалить
                                </button>
                                </div>`;

        notesList.appendChild(noteBlock);

        let codeBlocks = noteBlock.querySelectorAll('code');
        // if (codeBlock) {Prism.highlightElement(codeBlock);}
        if (codeBlocks) {
          codeBlocks.forEach(codeBlock => {
            hljs.highlightElement(codeBlock)
          });
        }
      });

    })
    .catch(error => console.error(error));
}

document.addEventListener('click', e => {
  const target = e.target;
  const action = target.dataset.action;


  if (action === 'note-menu') {
    
    const note = target.closest('.note');
    const menu = note.querySelector('.note-menu');

    const openedMenu = findOpenedMenu();
    if (openedMenu && openedMenu != menu) {
      console.log('sdfsdf');
      openedMenu.classList.remove('note-menu-open');
    }

    menu.classList.toggle('note-menu-open');
  }

  if (target.closest('.note-inmenu-button')) {
    const noteId = target.closest('.note').dataset.noteId;
    if (action === 'note-delete') {
      deleteNote(noteId);
    }
  }
  
  if (!target.closest('.note-menu') && !target.closest('.note-menu-button')) {
    const openedMenu = findOpenedMenu();
    if (openedMenu) {
      openedMenu.classList.remove('note-menu-open');
    }
  }

  function findOpenedMenu() {
    const notesList = document.querySelector('.notes-list');
    return notesList.querySelector('.note-menu-open');
  }
});

function deleteNote(id) {
  fetch('/api/notes/' + id, {
    method: 'DELETE'
  })
    .then(response => {
      getNotes();
    });
}

// Обработчик отправки формы
noteForm.addEventListener('submit', e => {
  e.preventDefault();
  addNote();
});

// Получение списка заметок при загрузке страницы
getNotes();




