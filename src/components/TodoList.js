import React from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function TodoList({ displayedList, deleteTodo, completeTodo, startEdit, editTodo, editId, editTitle, handleTitleChange, editDescription, handleDescriptionChange }) {
    return (
        <div className="todo-list">
            {displayedList.map((item, index) => {
                return (
                    <div key={item.id} className="todo-list-item">
                        <div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <small>
                                {item.status === 'complete' ?
                                    `Finished at: ${item.finishedAt}` :
                                    item.updatedAt ? `Updated at: ${item.updatedAt}` :
                                        `Created at: ${item.createdAt}`
                                }
                            </small>
                        </div>
                        <div className="actions">
                            <AiOutlineDelete onClick={() => deleteTodo(item.id)} className='delete-icon' />
                            {item.status !== 'complete' && <BsCheckLg onClick={() => completeTodo(item.id)} className='check-icon' />}
                            {item.status !== 'complete' && <AiOutlineEdit onClick={() => startEdit(item.id)} className='edit-icon' />}
                        </div>
                        {editId === item.id && (
                            <div className="edit-section">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    editTodo(item.id, {
                                        title: editTitle,
                                        description: editDescription
                                    });
                                }}>
                                    <div className="todo-input-item">
                                        <label>Title</label>
                                        <input type="text" value={editTitle} onChange={(e) => handleTitleChange(e.target.value)} />
                                    </div>
                                    <div className="todo-input-item">
                                        <label>Description</label>
                                        <input type="text" value={editDescription} onChange={(e) => handleDescriptionChange(e.target.value)} />
                                    </div>
                                    <button type="submit" className="primaryBtn">Update</button>
                                </form>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default TodoList;