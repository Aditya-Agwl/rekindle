import React, { useState } from "react";

function BookForm({ addBook, genres }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [pages, setPages] = useState("");
    const [genre, setGenre] = useState("");
    const [newGenre, setNewGenre] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalGenre = genre === "new" ? newGenre : genre;
        if (title && author && pages && finalGenre) {
            addBook(title, author, pages, finalGenre);
            setTitle("");
            setAuthor("");
            setPages("");
            setGenre("");
            setNewGenre("");
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                required
            />

            <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                <option value="">Select Genre</option>
                {Object.keys(genres).map((g) => (
                    <option key={g} value={g}>{g}</option>
                ))}
                <option value="new">Add New Genre</option>
            </select>

            {genre === "new" && (
                <input
                    type="text"
                    placeholder="New Genre"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    required
                />
            )}

            <button type="submit">Add Book</button>
        </form>
    );
}

export default BookForm;
