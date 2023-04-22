const add = () => {
  const addTask = document.getElementById('addTask'); // get the input field element
  if (addTask.value !== '') {
    const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
    tasksArray.push({ completed: false, description: addTask.value });
    for (let i = 1; i <= tasksArray.length; i += 1) {
      tasksArray[i - 1].index = i;
    }
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  }
  addTask.value = '';
};

const remove = (index) => {
  const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];

  if (index >= 0 && index < tasksArray.length) {
    tasksArray.splice(index, 1);

    for (let i = 1; i <= tasksArray.length; i += 1) {
      tasksArray[i - 1].index = i;
    }

    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  }
};

const edit = (index) => {
  const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
  const textInputs = document.querySelectorAll('.text-input');
  textInputs[index].addEventListener('change', () => {
    tasksArray[index].description = textInputs[index].value;
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  });
};

const move = (fromIndex, toIndex) => {
  const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
  const taskToMove = tasksArray[fromIndex];
  tasksArray.splice(fromIndex, 1);
  tasksArray.splice(toIndex, 0, taskToMove);
  for (let i = 1; i <= tasksArray.length; i += 1) {
    tasksArray[i - 1].index = i;
  }
  localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
};

const render = () => {
  const tasksContainer = document.querySelector('.list-container');
  const tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];
  tasksArray.sort((a, b) => a.index - b.index);
  tasksContainer.innerHTML = '';

  let checked = '';
  let strike = '';
  for (let i = 0; i < tasksArray.length; i += 1) {
    if (tasksArray[i].completed) {
      checked = 'checked';
      strike = 'strike-through';
    } else {
      checked = '';
      strike = '';
    }
    const html = `
      <div class="task">
        <input type="checkbox" class="checkbox-input" ${checked}>
        <input type="text" class="text-input ${strike}" value="${tasksArray[i].description}">
        <div class="delete-task-icon">&#x1F5D1;</div>
        <!-- <div class="drag-to-order">&#x22EE;</div> -->        
      </div>
      <hr>
    `;
    tasksContainer.innerHTML += html;
  }
};

module.exports = {
  add, render, remove, edit, move,
};