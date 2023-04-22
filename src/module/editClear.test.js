import { edit } from './addremove.js';
import { clearAll, TODO } from './interactive.js';

const { JSDOM } = require('jsdom');

// Define a mock implementation of localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

// Set the mock implementation of localStorage as the global localStorage object
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('editing function', () => {
  test('should edit the first task', () => {
    // Set up the initial state
    const tasksArray = [{ id: 1, description: 'Test task 1' }];
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
    document.body.innerHTML = `
      <div>
        <input class="text-input" id='0' value="${tasksArray[0].description}">
      </div>
    `;
    document.querySelector('.text-input').addEventListener('change', (e) => {
      edit(e.target.id);
    });

    const textInput = document.querySelector('.text-input');
    textInput.value = 'New Value';

    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true);
    textInput.dispatchEvent(evt);
    expect(textInput.value).toEqual('New Value');
  });
});

describe('clearAll', () => {
  test('should remove all completed tasks from localStorage', () => {
    // Set up the initial state of localStorage
    const initialTasksArray = [
      { description: 'Task 1', completed: false },
      { description: 'Task 2', completed: true },
      { description: 'Task 3', completed: true },
    ];
    localStorage.setItem('tasksArray', JSON.stringify(initialTasksArray));

    // Call the clearAll function
    clearAll();

    // Assert that the completed tasks were removed from localStorage
    const updatedTasksArray = JSON.parse(localStorage.getItem('tasksArray'));
    expect(updatedTasksArray).toHaveLength(1);
    expect(updatedTasksArray[0].description).toBe('Task 1');
  });

  test('should update the indexes of the remaining tasks in localStorage', () => {
    // Set up the initial state of localStorage
    const initialTasksArray = [
      { description: 'Task 1', completed: false },
      { description: 'Task 2', completed: true },
      { description: 'Task 3', completed: true },
    ];
    localStorage.setItem('tasksArray', JSON.stringify(initialTasksArray));

    // Call the clearAll function
    clearAll();

    // Assert that the indexes of the remaining tasks were updated in localStorage
    const updatedTasksArray = JSON.parse(localStorage.getItem('tasksArray'));
    expect(updatedTasksArray[0].index).toBe(1);
  });
});

describe('TODO', () => {
  let todo;

  beforeEach(() => {
    // Initialize a new instance of the TODO class before each test
    todo = new TODO();
  });

  it('should toggle task completion status in localStorage when strikeThrough is called with a checked checkbox', () => {
    // Set up initial tasksArray and checked checkbox
    const tasksArray = [{ text: 'Task 1', completed: false }, { text: 'Task 2', completed: false }];
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
    document.body.innerHTML = `
      <div>
        <input type="checkbox" class="checkbox-input" checked>
      </div>
    `;

    // Call strikeThrough with index 0 (the first task)
    todo.strikeThrough(0);

    // Check tasksArray is updated with the correct completed status for the first task
    expect(JSON.parse(localStorage.getItem('tasksArray'))[0].completed).toBe(true);
  });

  it('toggle task completion status in localStorage when strikeThrough is called with an unchecked checkbox', () => {
    // Set up initial tasksArray and unchecked checkbox
    const tasksArray = [{ text: 'Task 1', completed: true }, { text: 'Task 2', completed: false }];
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
    document.body.innerHTML = `
      <div>
        <input type="checkbox" class="checkbox-input">
      </div>
    `;

    // Call strikeThrough with index 0 (the first task)
    todo.strikeThrough(0);

    // Check tasksArray is updated with the correct completed status for the first task
    expect(JSON.parse(localStorage.getItem('tasksArray'))[0].completed).toBe(false);
  });
});
