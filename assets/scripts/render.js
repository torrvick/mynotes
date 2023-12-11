const renderer = new marked.Renderer();
renderer.checkbox = function (checked) {
    return '<input type="checkbox"' + (checked ? ' checked' : '') + '>';
};


// renderer.listitem = function (text, task, checked) {
//     if (task) {
//         const checkboxHtml = '<input type="checkbox" ' + (checked ? 'checked' : '') + '> ';
//         console.log(checkboxHtml);
//         return '<li style="list-style: none;">' + checkboxHtml + '<label>' + text + '</label></li>';
//     }
//     // Возвращаем стандартный элемент списка, если это не задача
//     return '<li>' + text + '</li>';
// };

marked.use({
    breaks: true,
    renderer,
});


export function renderNotes(notes) {
    const targetElem = document.querySelector('.notes-list');
    targetElem.innerHTML = '';
    if (targetElem.classList.contains('masonry')) {
        const leftColumn = document.createElement('div');
        leftColumn.classList.add('masonry-flex');
        targetElem.appendChild(leftColumn);
        const rightColumn = document.createElement('div');
        rightColumn.classList.add('masonry-flex');
        targetElem.appendChild(rightColumn);

        notes.forEach((note, i) => {
            i % 2 == 0 ? renderNote(note, leftColumn) : renderNote(note, rightColumn); 
        });

        const hightestColumn =
            leftColumn.offsetHeight > rightColumn.offsetHeight
                ? leftColumn
                : rightColumn;

        const lowestColumn =
            hightestColumn === leftColumn
                ? rightColumn
                : leftColumn;

        // if (hightestColumn.offsetHeight - hightestColumn.lastChild.offsetHeight > lowestColumn.offsetHeight) {
        //     lowestColumn.appendChild(hightestColumn.lastChild);
        // }
        while (hightestColumn.offsetHeight - hightestColumn.lastChild.offsetHeight > lowestColumn.offsetHeight) {
            lowestColumn.appendChild(hightestColumn.lastChild);
        }

    } else {
        notes.forEach(note => {
            renderNote(note, targetElem);
        });
    }
}

function renderNote(note, targetElem) {
    const noteBlock = document.createElement(`div`);
    let noteTitle = '';
    let noteContent = note.content;
    noteBlock.dataset.noteId = note.id;
    if (noteContent.startsWith('# ')) {
        // noteTitle = noteContent.substring(noteContent.indexOf('#') + 1, noteContent.indexOf('\n')).trim();
        noteTitle = noteContent.substring(
                    noteContent.indexOf('#') + 1, 
                    noteContent.indexOf('\n') < 0 ? noteContent.lenght : noteContent.indexOf('\n')
                    ).trim();
        noteContent = noteContent.substring(noteContent.indexOf('\n') + 1);
    } else {
        noteTitle = `Заметка #${note.id}`;
    }
    // if (!noteContent) noteContent = 'sddsd'
    noteBlock.classList.add('note');
    noteBlock.innerHTML =
        `<div class="note-header">
        <h3 class="note-title">${noteTitle}</h3>
        <button class="note-menu-button" data-action="note-menu">
        <img class="note-menu-icon" data-action="note-menu" src="/assets/img/icon_menu.png">
        </button>
        </div>`;
    // let unMarkedContent = marked.parse(noteContent, { renderer, sanitize: true, breaks: true });
    const unMarkedContent = marked.parse(noteContent);
    noteBlock.innerHTML += `<div class="note-content">${unMarkedContent}</div>`;
    noteBlock.innerHTML +=
        `<div class="note-menu">
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

    targetElem.appendChild(noteBlock);

    let codeBlocks = noteBlock.querySelectorAll('code');
    // if (codeBlock) {Prism.highlightElement(codeBlock);}
    if (codeBlocks) {
        codeBlocks.forEach(codeBlock => {
            hljs.highlightElement(codeBlock);
        });
    }

}