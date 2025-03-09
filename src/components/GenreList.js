// GenreList.js
import React from "react";

function GenreList({ genres, setSelectedGenre }) {
    return (
        <div>
            <h2>Genres Available</h2>
            {Object.keys(genres).length === 0 ? (
                <p>No genres available.</p>
            ) : (
                Object.keys(genres).map((genre) => (
                    <button key={genre} onClick={() => setSelectedGenre(genre)}>
                        {genre} ({genres[genre]})
                    </button>
                ))
            )}
        </div>
    );
}

export default GenreList;
