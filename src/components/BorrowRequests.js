// BorrowRequests.js
import React from "react";

function BorrowRequests({ requests, acceptRequest }) {
    return (
        <div>
            <h2>Borrow Requests</h2>
            {requests.length === 0 ? <p>No requests yet.</p> : (
                <ul>
                    {requests.map((request) => (
                        <li key={request.id}>
                            Book ID: {request.bookId} - Request from: {request.borrowerId} - Status: {request.status}
                            {request.status === "pending" && (
                                <button onClick={() => acceptRequest(request.id, request.bookId)}>Accept</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BorrowRequests;
