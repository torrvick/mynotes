export function addNote(title, content) {
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