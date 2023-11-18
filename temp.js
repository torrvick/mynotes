export const getNotes = async (offset, limit, searchText) => {
	try {
		const response = await fetch(
			`/api/notes?offset=${offset}&limit=${limit}&searchText=${searchText}`
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};

const loadMoreNotes = async () => {
	const searchText = searchInput.value.toLowerCase();
	const notes = await getNotes(offset, limit, searchText);
	offset += limit;

	notes.forEach((note) => {
		renderNote(note, targetElem);
	});
};

const searchText = searchInput.value.toLowerCase();

if (
	searchText &&
	noteTitle.toLowerCase().includes(searchText) === false &&
	noteContent.toLowerCase().includes(searchText) === false
) {
	return; // Пропустить отображение заметки, если она не соответствует поисковому запросу
}

//server

app.get("/api/notes", (req, res) => {
	const { offset, limit, searchText } = req.query;
	let query = "SELECT * FROM notes";

	if (searchText) {
		query += ` WHERE title LIKE '%${searchText}%' OR content LIKE '%${searchText}%'`;
	}

	query += ` ORDER BY id DESC`;

	db.all(query, (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: "Internal Server Error" });
		} else {
			let filteredRows = rows;

			if (offset && limit) {
				const startIndex = parseInt(offset);
				const endIndex = startIndex + parseInt(limit);
				filteredRows = filteredRows.slice(startIndex, endIndex);
			}

			res.json(filteredRows);
		}
	});
});

//Rest API
// Получение всех заметок
app.get("/api/notes", (req, res) => {
	// ... код для получения всех заметок ...
});

// Получение заметок, соответствующих фильтру
app.get("/api/notes/search", (req, res) => {
	// ... код для получения заметок, соответствующих фильтру ...
});

// Получение всех заметок
app.get("/api/notes", (req, res) => {
	// ... код для получения всех заметок ...

	if (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal Server Error" });
	} else {
		res.status(200).json(rows);
	}
});

// Получение заметок, соответствующих фильтру
app.get("/api/notes/search", (req, res) => {
	// ... код для получения заметок, соответствующих фильтру ...

	if (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal Server Error" });
	} else {
		res.status(200).json(filteredRows);
	}
});
