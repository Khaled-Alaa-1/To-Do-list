import './style.css';
import {
  add, render, remove, edit, move,
} from './module/addremove.js';

import { TODO, clearAll } from './module/interactive.js';

const addButton = document.querySelector('.add-button');
addButton.addEventListener('click', () => {
  add();
  render();
});

const addTask = document.querySelector('.add-task');
addTask.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    add();
    render();
  }
});

const tasksContainer = document.querySelector('.list-container');

tasksContainer.addEventListener('click', (event) => {
  const deleteTaskIcon = event.target.closest('.delete-task-icon');
  if (deleteTaskIcon) {
    const deleteTaskIcons = tasksContainer.querySelectorAll('.delete-task-icon');
    const index = Array.from(deleteTaskIcons).indexOf(deleteTaskIcon);
    render();
  }
});

tasksContainer.addEventListener('click', (event) => {
  const textInput = event.target.closest('.text-input');
  if (textInput) {
    const textInputs = tasksContainer.querySelectorAll('.text-input');
    const index = Array.from(textInputs).indexOf(textInput);
    edit(index);
  }
});

tasksContainer.addEventListener('dragstart', (event) => {
  const taskDiv = event.target.closest('.task');
  taskDiv.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', taskDiv.getAttribute('data-index'));
});

tasksContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
  const draggingTask = document.querySelector('.dragging');
  const closestTask = event.target.closest('.task');
  if (closestTask !== draggingTask && closestTask) {
    const draggingIndex = parseInt(draggingTask.getAttribute('data-index'), 10);
    const closestIndex = parseInt(closestTask.getAttribute('data-index'), 10);
    if (draggingIndex < closestIndex) {
      closestTask.parentNode.insertBefore(draggingTask, closestTask.nextSibling);
      move(draggingIndex - 1, closestIndex - 1);
    } else {
      closestTask.parentNode.insertBefore(draggingTask, closestTask);
      move(draggingIndex - 1, closestIndex);
    }
    draggingTask.setAttribute('data-index', closestIndex);
    closestTask.setAttribute('data-index', draggingIndex);
  }
});

const todo = new TODO();
tasksContainer.addEventListener('click', (event) => {
  const checkBox = event.target.closest('.checkbox-input');
  if (checkBox) {
    const checkBoxes = tasksContainer.querySelectorAll('.checkbox-input');
    const index = Array.from(checkBoxes).indexOf(checkBox);
    todo.strikeThrough(index);
    render();
  }
});

const clearAllButton = document.querySelector('.clear-all-completed');
clearAllButton.addEventListener('click', () => {
  clearAll();
  render();
});

tasksContainer.addEventListener('click', (event) => {
  const deleteTaskIcon = event.target.closest('.delete-task-icon');
  if (deleteTaskIcon) {
    const deleteTaskIcons = tasksContainer.querySelectorAll('.delete-task-icon');
    const index = Array.from(deleteTaskIcons).indexOf(deleteTaskIcon);
    remove(index);
    render();
  }
});

tasksContainer.addEventListener('click', (event) => {
  const textInput = event.target.closest('.text-input');
  if (textInput) {
    const textInputs = tasksContainer.querySelectorAll('.text-input');
    const index = Array.from(textInputs).indexOf(textInput);
    edit(index);
  }
});

tasksContainer.addEventListener('dragstart', (event) => {
  const taskDiv = event.target.closest('.task');
  taskDiv.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', taskDiv.getAttribute('data-index'));
});

tasksContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
  const draggingTask = document.querySelector('.dragging');
  const closestTask = event.target.closest('.task');
  if (closestTask !== draggingTask && closestTask) {
    const draggingIndex = parseInt(draggingTask.getAttribute('data-index'), 10);
    const closestIndex = parseInt(closestTask.getAttribute('data-index'), 10);
    if (draggingIndex < closestIndex) {
      closestTask.parentNode.insertBefore(draggingTask, closestTask.nextSibling);
      move(draggingIndex - 1, closestIndex - 1);
    } else {
      closestTask.parentNode.insertBefore(draggingTask, closestTask);
      move(draggingIndex - 1, closestIndex);
    }
    draggingTask.setAttribute('data-index', closestIndex);
    closestTask.setAttribute('data-index', draggingIndex);
  }
});

window.onload = render;
