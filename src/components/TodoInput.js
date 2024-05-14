import React from 'react';

function TodoInput({ handleTitleChange, handleDescriptionChange, addTodo, newTitle, newDescription }) {
    const onAdd = () => {
        addTodo(newTitle, newDescription);
    };

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
                <button onClick={onAdd} className="primaryBtn">Add</button>
            </div>
        </div>
    );
}

export default TodoInput;