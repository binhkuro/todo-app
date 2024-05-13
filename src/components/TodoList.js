import React, { Component } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from 'react-icons/bs';
import { MdModeEdit } from "react-icons/md";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";

const ITEMS_PER_PAGE = 4;

class TodoList extends Component {
    getGlobalIndex = (index) => {
        const { currentPage } = this.props;
        return currentPage * ITEMS_PER_PAGE + index;
    };
    render() {
        const {
            displayedList,
            isCompletedScreen,
            currentPage,
            totalPages,
            deleteTodo,
            completeTodo,
            startEdit,
            moveUp,
            moveDown,
            editIndex,
            editTitle,
            editDescription,
            handleTitleChange,
            handleDescriptionChange,
            editTodo,
            deleteCompletedTodo,
            moveUpComplete,
            moveDownComplete,
            changePage
        } = this.props;
        return (
            <div className="todo-list">
                {displayedList.map((item, index) => (
                    <div key={index} className="todo-list-item">
                        <div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            {isCompletedScreen ? (
                                <p>
                                    <small>Finished At: {item.finishedAt}</small>
                                </p>
                            ) : (
                                <p>
                                    {item.updatedAt ? (
                                        <small>Updated At: {item.updatedAt}</small>
                                    ) : (
                                        <small>Created At: {item.createdAt}</small>
                                    )}
                                </p>
                            )}
                        </div>
                        <div>
                            <AiOutlineDelete
                                className="delete-icon"
                                onClick={() => (isCompletedScreen ? deleteCompletedTodo(index) : deleteTodo(index))}
                            />
                            {!isCompletedScreen && (
                                <>
                                    <BsCheckLg
                                        className="check-icon"
                                        onClick={() => completeTodo(index)}
                                    />
                                    <MdModeEdit
                                        className="edit-icon"
                                        onClick={() => startEdit(index)}
                                    />
                                </>
                            )}
                            {!(currentPage === 0 && index === 0) && (
                                <FaArrowAltCircleUp
                                    className="move-up-icon"
                                    onClick={() => (isCompletedScreen ? moveUpComplete(index) : moveUp(index))}
                                />
                            )}
                            {!(currentPage === totalPages - 1 && index === displayedList.length - 1) && (
                                <FaArrowAltCircleDown
                                    className="move-down-icon"
                                    onClick={() => (isCompletedScreen ? moveDownComplete(index) : moveDown(index))}
                                />
                            )}
                        </div>

                        {editIndex === this.getGlobalIndex(index) && (
                            <div className="edit-section">
                                <div className="todo-input-item">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                    />
                                </div>
                                <div className="todo-input-item">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        value={editDescription}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => editTodo(index)}
                                    className="primaryBtn"
                                >
                                    Update
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="pagination">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => changePage('previous')}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => changePage('next')}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

export default TodoList;
