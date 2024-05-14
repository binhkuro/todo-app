import React, { Component } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoSearch from './components/TodoSearch';
import TodoSwitchScreen from './components/TodoSwitchScreen';
import TodoList from './components/TodoList';
import TodoPagination from './components/TodoPagination';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from './database/indexedDb';

const ITEMS_PER_PAGE = 4;

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
  state = {
    isCompletedScreen: false,
    todoList: [],
    newTitle: '',
    newDescription: '',
    editId: null,
    editTitle: '',
    editDescription: '',
    searchKeyword: '',
    currentPage: 0
  };

  async componentDidMount() {
    const todos = await getAllTodos();
    this.setState({ todoList: todos });
  }

  handleAddTodo = async (title, description) => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Title and description must not be empty.');
      return;
    }
    const newTodo = {
      title: title.trim(),
      description: description.trim(),
      createdAt: formatDateTime(new Date()),
      status: 'incomplete'
    };
    const updatedTodoList = await addTodo(newTodo);
    this.setState({
      todoList: updatedTodoList,
      newTitle: '',
      newDescription: ''
    });
  };

  startEdit = (id) => {
    if (this.state.editId === id) {
      this.setState({
        editId: null,
        editTitle: '',
        editDescription: ''
      });
    } else {
      const todo = this.state.todoList.find(todo => todo.id === id);
      this.setState({
        editId: id,
        editTitle: todo.title,
        editDescription: todo.description
      });
    }
  };

  handleTitleChange = (value) => {
    this.setState({
      editTitle: value
    });
  };

  handleDescriptionChange = (value) => {
    this.setState({
      editDescription: value
    });
  };

  handleUpdateTodo = async (id, changes) => {
    const todo = this.state.todoList.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      ...changes,
      updatedAt: formatDateTime(new Date()),
      finishedAt: todo.status !== 'complete' && changes.status === 'complete' ? formatDateTime(new Date()) : todo.finishedAt
    };

    const updatedTodoList = await updateTodo(updatedTodo);
    this.setState({
      todoList: updatedTodoList,
      editId: null,
      editTitle: '',
      editDescription: ''
    });
  };

  handleDeleteTodo = async (id) => {
    const updatedTodoList = await deleteTodo(id);
    this.setState({ todoList: updatedTodoList });
  };

  handleSearchChange = (e) => {
    this.setState({ searchKeyword: e.target.value });
  };

  switchScreen = (isCompletedScreen) => {
    this.setState({ isCompletedScreen, currentPage: 0 });
  };

  nextPage = () => {
    if ((this.state.currentPage + 1) * ITEMS_PER_PAGE < this.state.todoList.length) {
      this.setState({ currentPage: this.state.currentPage + 1 });
    }
  };

  prevPage = () => {
    if (this.state.currentPage > 0) {
      this.setState({ currentPage: this.state.currentPage - 1 });
    }
  };

  render() {
    const { isCompletedScreen, todoList, searchKeyword, currentPage } = this.state;
    const filteredList = todoList.filter(todo =>
      (todo.title.toLowerCase().includes(searchKeyword.toLowerCase()) || todo.description.toLowerCase().includes(searchKeyword.toLowerCase())) &&
      (isCompletedScreen ? todo.status === 'complete' : todo.status === 'incomplete')
    );

    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
    const displayedList = filteredList.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
      <div className="App">
        <h1>Todo List</h1>
        <div className="todo-wrapper">
          <TodoInput
            newTitle={this.state.newTitle}
            newDescription={this.state.newDescription}
            handleTitleChange={(e) => this.setState({ newTitle: e.target.value })}
            handleDescriptionChange={(e) => this.setState({ newDescription: e.target.value })}
            addTodo={this.handleAddTodo}
          />
          <TodoSearch
            searchKeyword={searchKeyword}
            onSearchChange={this.handleSearchChange}
          />
          <TodoSwitchScreen
            isCompletedScreen={isCompletedScreen}
            onSwitchScreen={(isCompletedScreen) => this.switchScreen(isCompletedScreen)}
          />
          <TodoList
            displayedList={displayedList}
            deleteTodo={this.handleDeleteTodo}
            completeTodo={(id) => this.handleUpdateTodo(id, { status: 'complete' })}
            startEdit={this.startEdit}
            editId={this.state.editId}
            editTodo={this.handleUpdateTodo}
            editTitle={this.state.editTitle}
            editDescription={this.state.editDescription}
            handleTitleChange={this.handleTitleChange}
            handleDescriptionChange={this.handleDescriptionChange}
          />
          <TodoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            prevPage={this.prevPage}
            nextPage={this.nextPage}
          />
        </div>
      </div>
    );
  }
}

export default App;