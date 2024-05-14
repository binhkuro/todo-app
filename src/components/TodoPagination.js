import React from 'react';

function TodoPagination({ currentPage, totalPages, prevPage, nextPage }) {
    return (
        <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 0}>Prev</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage + 1 >= totalPages}>Next</button>
        </div>
    );
}

export default TodoPagination;