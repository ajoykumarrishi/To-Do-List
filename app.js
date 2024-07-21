const API_ENDPOINT = 'https://fewd-todolist-api.onrender.com/tasks';
const API_KEY = '1264';

const taskNameInput = $('#taskNameInput');
const taskList = $('#taskList');

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

const handleDeleteSuccess = (taskId, response) => {
  console.log(response);
  $(`#taskDiv${taskId}`).remove();
};

const handleCompleteSuccess = (taskId, response) => {
  console.log(response);
  $(`#taskDiv${taskId}`).css('text-decoration', 'line-through');
};

const handleError = (errorMessage) => {
  console.log(errorMessage);
};

const deleteTask = (taskId) => {
  ajaxRequest({
    type: 'DELETE',
    url: `${API_ENDPOINT}/${taskId}?api_key=${API_KEY}`,
    success: (response) => handleDeleteSuccess(taskId, response),
    error: handleError,
  });
};

const completeTask = (taskId) => {
  ajaxRequest({
    type: 'PUT',
    url: `${API_ENDPOINT}/${taskId}/mark_complete?api_key=${API_KEY}`,
    success: (response) => handleCompleteSuccess(taskId, response),
    error: handleError,
  });
};

const createTaskElement = (task, taskId) => {
  const taskDiv = $('<div>').attr('id', `taskDiv${taskId}`).addClass('taskDiv');
  const taskContent = $('<li>').text(task).attr('id', 'taskContent');
  const deleteButton = $('<button>').text('Delete').attr('id', 'deleteButton').addClass('btn btn-danger');
  const completeButton = $('<label>').addClass('custom-checkbox-container');
  const checkboxInput = $('<input>').attr('type', 'checkbox').attr('id', `completeButton${taskId}`);
  const checkmarkSpan = $('<span>').addClass('custom-checkmark');
  completeButton.append(checkboxInput, checkmarkSpan);

  completeButton.on('click', () => completeTask(taskId));
  deleteButton.on('click', () => deleteTask(taskId));

  taskDiv.append(completeButton, taskContent, deleteButton);
  return taskDiv;
};

const handleAddTaskSuccess = (response) => {
  console.log(response);
  const taskId = response.task.id;
  const taskDiv = createTaskElement(taskNameInput.val(), taskId);
  taskList.append(taskDiv);
  taskNameInput.val('');
};

const addTask = (event) => {
  if (event.key === 'Enter') {
    const task = taskNameInput.val();
    if (task.trim() === '') {
      console.log('Task name cannot be empty');
      return;
    }
    ajaxRequest({
      type: 'POST',
      url: `${API_ENDPOINT}?api_key=${API_KEY}`,
      data: { content: task },
      success: handleAddTaskSuccess,
      error: handleError,
    });
  } else {
    console.log('Not the Enter key');
  }
};

taskNameInput.on('keydown', addTask);