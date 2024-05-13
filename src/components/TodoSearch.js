import React, { Component } from 'react';

class TodoSearch extends Component {
    render() {
        const { searchKeyword, onSearchChange } = this.props;
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
}

export default TodoSearch;