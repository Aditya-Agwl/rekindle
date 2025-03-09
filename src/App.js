import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import BorrowRequests from "./components/BorrowRequests";
import Login from "./components/Login";

const allGenres = [
    "Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy",
    "Romance", "Horror", "Biography", "Self-Help", "History",
    "Philosophy", "Poetry", "Graphic Novel", "Children's", "Classics"
];

function App() {
    const [books, setBooks] = useState([]);
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [genres, setGenres] = useState({});
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [user, setUser] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [genreHeading, setGenreHeading] = useState("Search by Genres");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
                const booksArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBooks(booksArray);

                const genreCount = allGenres.reduce((acc, genre) => {
                    acc[genre] = 0;
                    return acc;
                }, {});

                booksArray.forEach(book => {
                    if (book.genre && allGenres.includes(book.genre)) {
                        genreCount[book.genre]++;
                    }
                });

                setGenres(genreCount);
            });
            return () => unsubscribe();
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchRequests = async () => {
                const q = query(collection(db, "borrowRequests"), where("ownerId", "==", user.uid));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    setBorrowRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                return () => unsubscribe();
            };
            fetchRequests();
        }
    }, [user]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const matchedBooks = books
                .filter(book => 
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(book => book.title);
            setSuggestions(matchedBooks);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, books]);

    const addBook = async (title, author, pages, genre) => {
        if (!user) return;
        await addDoc(collection(db, "books"), { 
            title, 
            author, 
            pages, 
            genre, 
            ownerId: user.uid, 
            ownerEmail: user.email, 
            isBorrowed: false 
        });
        setIsAddingBook(false);
    };

    const editBook = async (bookId, title, author, pages, genre) => {
        if (!user) return;
        await updateDoc(doc(db, "books", bookId), { title, author, pages, genre });
        setEditingBook(null);
    };

    const borrowBook = async (bookId, ownerId) => {
        if (!user) return;
        await addDoc(collection(db, "borrowRequests"), { 
            bookId, 
            borrowerId: user.uid, 
            ownerId, 
            status: "pending" 
        });
        alert("Borrow request sent!");
    };

    const acceptRequest = async (requestId, bookId) => {
        await updateDoc(doc(db, "borrowRequests", requestId), { status: "accepted" });
        await updateDoc(doc(db, "books", bookId), { isBorrowed: true });
    };

    const returnBook = async (bookId) => {
        await updateDoc(doc(db, "books", bookId), { isBorrowed: false });
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        setGenreHeading(`Books in ${genre}`);
    };

    const resetGenreFilter = () => {
        setSelectedGenre(null);
        setGenreHeading("Search by Genres");
    };

    const filteredBooks = books.filter(book => 
        (selectedGenre ? book.genre === selectedGenre : true) &&
        (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div>
            {!user ? (
                <Login />
            ) : (
                <>
                    <button onClick={handleLogout} style={{ float: "right" }}>Logout</button>

                    <h2>Your Books</h2>
                    <button onClick={() => setIsAddingBook(true)}>Add a Book</button>

                    {isAddingBook && (
                        <BookForm addBook={addBook} genres={genres} allGenres={allGenres} />
                    )}

                    <BookList 
                        books={books.filter(book => book.ownerId === user?.uid)} 
                        onEdit={(book) => setEditingBook(book)}
                    />

                    {editingBook && (
                        <BookForm 
                            addBook={(title, author, pages, genre) => editBook(editingBook.id, title, author, pages, genre)}
                            genres={genres} 
                            allGenres={allGenres}
                            initialBook={editingBook}
                        />
                    )}

                    <h2>{genreHeading}</h2>
                    {selectedGenre && (
                        <button onClick={resetGenreFilter} style={{ marginBottom: "10px" }}>Show All Genres</button>
                    )}
                    <ul>
                        {allGenres.map(genre => (
                            <li key={genre} style={{ cursor: "pointer", color: "blue" }} onClick={() => handleGenreClick(genre)}>
                                {genre}: {genres[genre] || 0} books
                            </li>
                        ))}
                    </ul>

                    <div>
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ marginRight: "10px" }}
                        />
                        {suggestions.length > 0 && (
                            <ul style={{ background: "white", position: "absolute", zIndex: 10 }}>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => setSearchQuery(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <h2>Books Available</h2>
                    <BookList books={filteredBooks} borrowBook={borrowBook} />

                    <BorrowRequests requests={borrowRequests} acceptRequest={acceptRequest} />
                </>
            )}
        </div>
    );
}

export default App;
