import React from 'react';

function TodoSearch({ searchKeyword, onSearchChange }) {
    return (
        <div className="search-area">
            <input
                type="text"
                value={searchKeyword}
                onChange={onSearchChange}
                placeholder="Search by title or description"
            />
        </div>
    );
}

export default TodoSearch;