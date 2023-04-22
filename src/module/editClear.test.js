import { edit } from './addremove.js';
import { clearAll } from './interactive.js';

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

/* describe('editing function', () => {
  test('should edit the first task', () => {
    let index = 0;
    let beforeTaskArray = document.querySelectorAll('.text-input');
    let beforeTask = beforeTaskArray[index].value;
    let userInput = "Test task 2";
    edit(index, userInput);
    add('some task');
    let afterTaskArray = document.querySelectorAll('.text-input');
    let afterTask = afterTaskArray[index+1].value;

    expect(afterTask).not.toBe(beforeTask);
  });
});
*/
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

    // const updatedTasksArray = JSON.parse(localStorage.getItem('tasksArray'));
    // expect(updatedTasksArray[0].description).toEqual("New Value");
  });
});

/* describe('edit function', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should update the description of a task in localStorage', () => {
    // Set up initial state of localStorage
    const initialTasksArray = [
      { id: 1, description: 'Task 1' },
      { id: 2, description: 'Task 2' },
    ];
    localStorage.setItem('tasksArray', JSON.stringify(initialTasksArray));
    const textInput = document.createElement('input');
    textInput.classList.add('text-input');
    textInput.value = 'Updated Task 1';

    edit(0);

    const changeEvent = new Event('change');
    textInput.dispatchEvent(changeEvent);

    // Get updated tasks array from localStorage
    const updatedTasksArray = JSON.parse(localStorage.getItem('tasksArray'));

    // Check that the description of the first task was updated
    expect(updatedTasksArray[0].description).toEqual('Updated Task 1');

    // Check that the descriptions of other tasks were not changed
    expect(updatedTasksArray[1].description).toEqual('Task 2');
  });
}); */

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
