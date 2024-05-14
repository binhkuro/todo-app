import { openDB } from 'idb';

export const initializeDb = async () => {
    return openDB('todo-db', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('todos')) {
                const store = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
                store.createIndex('status', 'status', { unique: false });
            }
        },
    });
};

export const addTodo = async (newTodo) => {
    const db = await initializeDb();
    await db.add('todos', newTodo);
    return db.getAll('todos');
};

export const updateTodo = async (updatedTodo) => {
    const db = await initializeDb();
    await db.put('todos', updatedTodo);
    return db.getAll('todos');
};

export const deleteTodo = async (id) => {
    const db = await initializeDb();
    await db.delete('todos', id);
    return db.getAll('todos');
};

export const getAllTodos = async () => {
    const db = await initializeDb();
    return db.getAll('todos');
};