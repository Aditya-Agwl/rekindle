import React, { useState } from "react";

function Book(props){
    const [available, setAvailable] = useState(true);

    return(
        <div>
            <h1>{props.title}</h1>
            <p>Author: {props.author}</p>
            <p>Pages: {props.pages}</p>
            <p>Status: {available ? "Avaliable" : "Not avaliable"}</p>
            <button onClick={() => setAvailable(!available)}>
                {available ? "Rent out" : "Return"}
            </button>
        </div>
    );
}

export default Book;