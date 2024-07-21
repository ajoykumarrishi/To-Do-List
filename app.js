const API_ENDPOINT = 'https://fewd-todolist-api.onrender.com/tasks';
const API_KEY = '1264';

const taskNameInput = $('#taskNameInput');
const taskList = $('#taskList');

// ----- AJAX Utility Function -----

const ajaxRequest = (options) => {
  $.ajax({
    type: options.type,
    url: options.url,
    contentType: options.contentType || 'application/json',
    dataType: options.dataType || 'json',
    data: JSON.stringify(options.data),
    success: options.success,
    error: options.error,
  });
};

// ----- Task Handling Functions -----

const deleteTask = (taskId) => {
  ajaxRequest({
    type: 'DELETE',
    url: `${API_ENDPOINT}/${taskId}?api_key=${API_KEY}`,
    success: () => handleDeleteSuccess(taskId),
    error: handleError,
  });
};

const toggleTaskComplete = (taskId) => {
  const checkbox = $(`#completeButton${taskId}`);
  const newCompletedState = !checkbox.prop('checked');

  // Disable the checkbox while the request is in progress
  checkbox.prop('disabled', true);

  ajaxRequest({
    type: 'PUT',
    url: `${API_ENDPOINT}/${taskId}/${newCompletedState ? 'mark_complete' : 'mark_active'}?api_key=${API_KEY}`,
    success: () => {
      handleToggleCompleteSuccess(taskId, newCompletedState);
      checkbox.prop('disabled', false); // Re-enable after the request
    },
    error: (error) => {
      handleError(error);
      checkbox.prop('checked', !newCompletedState); // Revert to the original state on error
      checkbox.prop('disabled', false); 
    },
  });
};

// ----- UI Update Functions -----

const handleDeleteSuccess = (taskId) => {
  $(`#taskDiv${taskId}`).remove();
};

const handleToggleCompleteSuccess = (taskId, completed) => {
  $(`#taskContent${taskId}`).css('text-decoration', completed ? 'line-through' : 'none');
  $(`#completeButton${taskId}`).prop('checked', completed); 
};

const handleError = (errorMessage) => {
  console.log(errorMessage);
};

// ----- Task Element Creation -----

const createTaskElement = (task, taskId, completed) => {
  const taskDiv = $('<div>').attr('id', `taskDiv${taskId}`).addClass('taskDiv');
  const taskContent = $('<li>').text(task).attr('id', `taskContent${taskId}`).addClass('taskContent');
  const deleteButton = $('<button>').text('X').attr('id', 'deleteButton').addClass('deleteButton');

  const taskContentWrapper = $('<div>').addClass('task-content-wrapper');

  const completeButton = $('<label>').addClass('custom-checkbox-container');
  const checkboxInput = $('<input>').attr('type', 'checkbox').attr('id', `completeButton${taskId}`);
  const checkmarkSpan = $('<span>').addClass('custom-checkmark');
  completeButton.append(checkboxInput, checkmarkSpan);
  taskContentWrapper.append(completeButton, taskContent);

  // Set initial checkbox and text state based on "completed"
  checkboxInput.prop('checked', completed);
  taskContent.css('text-decoration', completed ? 'line-through' : 'none');

  completeButton.on('click', () => toggleTaskComplete(taskId));
  deleteButton.on('click', () => deleteTask(taskId));

  taskDiv.append(taskContentWrapper, deleteButton);
  return taskDiv;
};

// ----- Event Handlers -----

const handleAddTaskSuccess = (response) => {
  const taskId = response.task.id;
  const taskDiv = createTaskElement(taskNameInput.val(), taskId, false);
  taskList.append(taskDiv);
  taskNameInput.val('');
};

const addTask = (event) => {
  if (event.key === 'Enter') {
    const task = taskNameInput.val();
    if (task.trim() === '') return;
    ajaxRequest({
      type: 'POST',
      url: `${API_ENDPOINT}?api_key=${API_KEY}`,
      data: { content: task },
      success: handleAddTaskSuccess,
      error: handleError,
    });
  }
};

taskNameInput.on('keydown', addTask);

// Load existing tasks on page load
$(document).ready(() => {
  allTasksEventListener();
});

// ----- Organize Later -----
const allTasksToggle = $('#allTasksToggle');
const activeTasksToggle = $('#activeTasksToggle');
const completedTasksToggle = $('#completedTasksToggle');

const allTasksEventListener = () => {
  allTasksToggle.addClass('active');
  activeTasksToggle.removeClass('active');
  completedTasksToggle.removeClass('active');
  taskList.empty();
  ajaxRequest({
    type: 'GET',
    url: `${API_ENDPOINT}?api_key=${API_KEY}`,
    success: (response) => {
      response.tasks.forEach((task) => {
        const taskDiv = createTaskElement(task.content, task.id, task.completed);
        taskList.append(taskDiv);
      });
    },
    error: handleError,
  });
};

const activeTasksEventListener = () => {
  allTasksToggle.removeClass('active');
  activeTasksToggle.addClass('active');
  completedTasksToggle.removeClass('active');
  taskList.empty();
  ajaxRequest({
    type: 'GET',
    url: `${API_ENDPOINT}?api_key=${API_KEY}`,
    success: (response) => {
      response.tasks.forEach((task) => {
        if (!task.completed) {
          const taskDiv = createTaskElement(task.content, task.id, task.completed);
          taskList.append(taskDiv);
        }
      });
    },
    error: handleError,
  });
}

const completedTasksEventListener = () => {
  allTasksToggle.removeClass('active');
  activeTasksToggle.removeClass('active');
  completedTasksToggle.addClass('active');
  taskList.empty();
  ajaxRequest({
    type: 'GET',
    url: `${API_ENDPOINT}?api_key=${API_KEY}`,
    success: (response) => {
      response.tasks.forEach((task) => {
        if (task.completed) {
          const taskDiv = createTaskElement(task.content, task.id, task.completed);
          taskList.append(taskDiv);
        }
      });
    },
    error: handleError,
  });
}

allTasksToggle.on('click', allTasksEventListener);
activeTasksToggle.on('click', activeTasksEventListener);
completedTasksToggle.on('click', completedTasksEventListener);