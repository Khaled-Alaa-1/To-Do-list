const add = require('./addremove');

// Define a mock implementation of localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: key => {
      delete store[key];
    }
  };
})();

// Set the mock implementation of localStorage as the global localStorage object
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Set up the jsdom environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Now you can write your test as before
describe('add function', () => {
  beforeEach(() => {
    localStorage.clear(); // reset localStorage before each test
  });

  test('adds task to localStorage', () => {
    // ...

    const addTask = document.createElement('input');
    addTask.setAttribute('id', 'addTask');
    addTask.value = 'We have a meeting by 5 pm';
    document.body.appendChild(addTask);

    add();

    const tasksArray = JSON.parse(localStorage.getItem('tasksArray'));

    expect(tasksArray).toHaveLength(1);
    expect(tasksArray[0].completed).toBe(false);
    expect(tasksArray[0].description).toBe('We have a meeting by 5 pm');
    expect(tasksArray[0].index).toBe(1);
  });

  test('does not add task to localStorage if input field is empty', () => {
    // ...

    const addTask = document.createElement('input');
    addTask.setAttribute('id', 'addTask');
    addTask.value = '';
    document.body.appendChild(addTask);

    add();

    const tasksArray = JSON.parse(localStorage.getItem('tasksArray'));

    expect(tasksArray).toBeNull();
  });
});
