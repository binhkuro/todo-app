import React, { Component } from 'react';

class TodoInput extends Component {
    render() {
        const { newTitle, newDescription, handleTitleChange, handleDescriptionChange, addTodo } = this.props;
        return (
            <div className="todo-input">
                <div className="todo-input-item">
                    <label>Title</label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={handleTitleChange}
                        placeholder="Enter your task"
                    />
                </div>
                <div className="todo-input-item">
                    <label>Description</label>
                    <input
                        type="text"
                        value={newDescription}
                        onChange={handleDescriptionChange}
                        placeholder="Describe your task"
                    />
                </div>
                <div className="todo-input-item">
                    <button type="button" onClick={addTodo} className="primaryBtn">
                        Add
                    </button>
                </div>
            </div>
        );
    }
}

export default TodoInput;