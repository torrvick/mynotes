// export function addNote(content) {
//     fetch('/api/notes', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ content })
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => console.error(error));
// }
export function addNote(content) {
    return fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            throw error; // Пробросить ошибку для обработки в вызывающем коде
        });
}

export const getNotes = async () => {
    try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getOneNote = async (noteId) => {
    try {
        const response = await fetch('/api/notes/' + noteId);
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

//     try {
//         const response = await fetch('/api/notes/' + id, {
//             method: 'DELETE'
//         });
//         const data = await response.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }; 

// export function deleteNote(id) {
//     try {
//         response = await fetch('/api/notes/' + id, {
//             method: 'DELETE'
//         });
//         const data = await response.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// };

export function deleteNote(id) {
    return fetch('/api/notes/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
        });
}

export function editNote(id, content) {
    console.log(JSON.stringify({ content }));
    return fetch('/api/notes/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
        });
}