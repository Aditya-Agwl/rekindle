import React, { useState } from "react";

function BookList({ books, borrowBook }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredBooks.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <ul>
                    {filteredBooks.map((book) => (
                        <li key={book.id}>
                            <strong>{book.title}</strong> by {book.author} ({book.pages} pages) - Genre: {book.genre}
                            {!book.isBorrowed && borrowBook && (
                                <button onClick={() => borrowBook(book.id, book.ownerId)}>Borrow</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BookList;
