import React, { Component } from 'react';
import './App.css';
import { openDB } from 'idb';
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from 'react-icons/bs';
import { MdModeEdit } from "react-icons/md";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";

const ITEMS_PER_PAGE = 4;

const initializeDb = async () => {
  return openDB('todo-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('completed')) {
        db.createObjectStore('completed', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCompletedScreen: false,
      todoList: [],
      completedTodoList: [],
      newTitle: '',
      newDescription: '',
      editIndex: -1,
      editTitle: '',
      editDescription: '',
      searchKeyword: '',
      currentPage: 0,
    };
  }

  async componentDidMount() {
    const db = await initializeDb();
    const savedTodoList = await db.getAll('todos');
    const savedCompletedTodoList = await db.getAll('completed');

    this.setState({
      todoList: savedTodoList.reverse(),
      completedTodoList: savedCompletedTodoList.reverse(),
    });
  }

  getGlobalIndex = (index) => {
    const { currentPage } = this.state;
    return currentPage * ITEMS_PER_PAGE + index;
  };

  moveUp = (index) => {
    const { todoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    if (globalIndex > 0) {
      const newList = [...todoList];
      [newList[globalIndex], newList[globalIndex - 1]] = [
        newList[globalIndex - 1],
        newList[globalIndex],
      ];
      this.setState({ todoList: newList });
    }
  };

  moveDown = (index) => {
    const { todoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    if (globalIndex < todoList.length - 1) {
      const newList = [...todoList];
      [newList[globalIndex], newList[globalIndex + 1]] = [
        newList[globalIndex + 1],
        newList[globalIndex],
      ];
      this.setState({ todoList: newList });
    }
  };

  addTodo = async () => {
    const { todoList, newTitle, newDescription } = this.state;
    if (todoList.some((todo) => todo.title === newTitle)) {
      alert('This title already exists. Please choose a different title.');
      return;
    }

    if (newTitle.trim() === '' || newDescription.trim() === '') {
      alert('Title and description must not be empty.');
      return;
    }

    const currentTime = new Date();
    const createdAt = formatDateTime(currentTime);

    const newTodo = {
      title: newTitle,
      description: newDescription,
      createdAt,
    };

    const db = await initializeDb();
    await db.add('todos', newTodo);
    const updatedTodoList = await db.getAll('todos');
    this.setState({
      todoList: updatedTodoList.reverse(),
      newTitle: '',
      newDescription: '',
    });
  };

  startEdit = (index) => {
    const { editIndex, todoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    const newEditIndex = editIndex === globalIndex ? -1 : globalIndex;

    this.setState({
      editIndex: newEditIndex,
      editTitle: todoList[globalIndex].title,
      editDescription: todoList[globalIndex].description,
    });
  };

  editTodo = async () => {
    const { editIndex, editTitle, editDescription, todoList } = this.state;
    if (editIndex >= 0) {
      const db = await initializeDb();

      if (
        todoList.some(
          (todo, idx) =>
            todo.title === editTitle &&
            this.getGlobalIndex(idx) !== editIndex
        )
      ) {
        alert('This title already exists. Please choose a different title.');
        return;
      }

      if (editTitle.trim() === '' || editDescription.trim() === '') {
        alert('Title and description must not be empty.');
        return;
      }

      const currentTime = new Date();
      const updatedAt = formatDateTime(currentTime);

      const updatedTodo = {
        ...todoList[editIndex],
        title: editTitle,
        description: editDescription,
        updatedAt,
      };

      await db.put('todos', updatedTodo);

      const updatedTodoList = await db.getAll('todos');
      this.setState({
        todoList: updatedTodoList.reverse(),
        editIndex: -1,
      });
    }
  };

  deleteTodo = async (index) => {
    const { todoList, editIndex } = this.state;
    const globalIndex = this.getGlobalIndex(index);

    if (globalIndex >= 0 && globalIndex < todoList.length) {
      const db = await initializeDb();
      const idToDelete = todoList[globalIndex].id;
      await db.delete('todos', idToDelete);

      const updatedTodoList = await db.getAll('todos');
      const newEditIndex = editIndex > globalIndex ? editIndex - 1 : editIndex;

      this.setState({
        todoList: updatedTodoList.reverse(),
        editIndex: newEditIndex === globalIndex ? -1 : newEditIndex,
      });
    }
  };

  completeTodo = async (index) => {
    const { todoList, completedTodoList, editIndex } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    if (globalIndex >= 0 && globalIndex < todoList.length) {
      const db = await initializeDb();

      const currentTime = new Date();
      const finishedAt = formatDateTime(currentTime);

      const completedTodo = {
        ...todoList[globalIndex],
        finishedAt,
      };

      await db.add('completed', completedTodo);

      const idToDelete = todoList[globalIndex].id;
      await db.delete('todos', idToDelete);

      const updatedCompletedTodoList = [completedTodo, ...completedTodoList];

      const updatedTodoList = await db.getAll('todos');

      const newEditIndex = editIndex > globalIndex ? editIndex - 1 : editIndex;

      this.setState({
        todoList: updatedTodoList.reverse(),
        completedTodoList: updatedCompletedTodoList,
        editIndex: newEditIndex === globalIndex ? -1 : newEditIndex,
      });
    }
  };

  deleteCompletedTodo = async (index) => {
    const { completedTodoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);

    if (globalIndex >= 0 && globalIndex < completedTodoList.length) {
      const db = await initializeDb();
      const idToDelete = completedTodoList[globalIndex].id;
      await db.delete('completed', idToDelete);

      const updatedCompletedTodoList = await db.getAll('completed');
      this.setState({ completedTodoList: updatedCompletedTodoList });
    }
  };

  moveUpComplete = (index) => {
    const { completedTodoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    if (globalIndex > 0) {
      const newList = [...completedTodoList];
      [newList[globalIndex], newList[globalIndex - 1]] = [newList[globalIndex - 1], newList[globalIndex]];
      this.setState({ completedTodoList: newList });
    }
  };

  moveDownComplete = (index) => {
    const { completedTodoList } = this.state;
    const globalIndex = this.getGlobalIndex(index);
    if (globalIndex < completedTodoList.length - 1) {
      const newList = [...completedTodoList];
      [newList[globalIndex], newList[globalIndex + 1]] = [newList[globalIndex + 1], newList[globalIndex]];
      this.setState({ completedTodoList: newList });
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchKeyword: e.target.value, currentPage: 0 });
  };

  switchScreen = (isCompletedScreen) => {
    this.setState({ isCompletedScreen, currentPage: 0 });
  };

  changePage = (direction) => {
    const { currentPage } = this.state;
    if (direction === 'next') {
      this.setState({ currentPage: currentPage + 1 });
    } else if (direction === 'previous') {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  render() {
    const {
      isCompletedScreen,
      todoList,
      completedTodoList,
      newTitle,
      newDescription,
      editIndex,
      editTitle,
      editDescription,
      searchKeyword,
      currentPage,
    } = this.state;

    const currentList = isCompletedScreen ? completedTodoList : todoList;

    const filteredList = currentList.filter(
      (item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE);

    const displayedList = filteredList.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
      <div className="App">
        <h1>Todo List</h1>

        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => this.setState({ newTitle: e.target.value })}
                placeholder="Enter your task"
              />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => this.setState({ newDescription: e.target.value })}
                placeholder="Describe your task"
              />
            </div>
            <div className="todo-input-item">
              <button type="button" onClick={this.addTodo} className="primaryBtn">
                Add
              </button>
            </div>
          </div>

          <div className="search-area">
            <input
              type="text"
              value={searchKeyword}
              onChange={this.handleSearchChange}
              placeholder="Search by title or description"
            />
          </div>

          <div className="btn-area">
            <button
              className={`isCompletedScreen ${!isCompletedScreen && 'active'}`}
              onClick={() => this.switchScreen(false)}
            >
              Todo
            </button>
            <button
              className={`isCompletedScreen ${isCompletedScreen && 'active'}`}
              onClick={() => this.switchScreen(true)}
            >
              Completed
            </button>
          </div>

          <div className="todo-list">
            {!isCompletedScreen &&
              displayedList.map((item, index) => (
                <div key={index} className="todo-list-item">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.updatedAt ? (
                      <p>
                        <small>Updated At: {item.updatedAt}</small>
                      </p>
                    ) : (
                      <p>
                        <small>Created At: {item.createdAt}</small>
                      </p>
                    )}
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="delete-icon"
                      onClick={() => this.deleteTodo(index)}
                    />
                    <BsCheckLg
                      className="check-icon"
                      onClick={() => this.completeTodo(index)}
                    />
                    <MdModeEdit
                      className="edit-icon"
                      onClick={() => this.startEdit(index)}
                    />
                    {!(currentPage === 0 && index === 0) && (
                      <FaArrowAltCircleUp
                        className="move-up-icon"
                        onClick={() => this.moveUp(index)}
                      />
                    )}
                    {!(currentPage === totalPages - 1 && index === displayedList.length - 1) && (
                      <FaArrowAltCircleDown
                        className="move-down-icon"
                        onClick={() => this.moveDown(index)}
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
                          onChange={(e) => this.setState({ editTitle: e.target.value })}
                        />
                      </div>
                      <div className="todo-input-item">
                        <label>Description</label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => this.setState({ editDescription: e.target.value })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={this.editTodo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {isCompletedScreen &&
              displayedList.map((item, index) => (
                <div key={index} className="todo-list-item">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Finished At: {item.finishedAt}</small>
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="delete-icon"
                      onClick={() => this.deleteCompletedTodo(index)}
                    />
                    {!(currentPage === 0 && index === 0) && (
                      <FaArrowAltCircleUp
                        className="move-up-icon"
                        onClick={() => this.moveUpComplete(index)}
                      />
                    )}
                    {!(currentPage === totalPages - 1 && index === displayedList.length - 1) && (
                      <FaArrowAltCircleDown
                        className="move-down-icon"
                        onClick={() => this.moveDownComplete(index)}
                      />
                    )}
                  </div>
                </div>
              ))}

            <div className="pagination">
              <button
                disabled={currentPage === 0}
                onClick={() => this.changePage('previous')}
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => this.changePage('next')}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;