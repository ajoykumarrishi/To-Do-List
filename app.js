const taskNameInput = $('#taskNameInput');
const taskList = $('#taskList');

const addTask = (event) => {
  if(event.key === 'Enter') {
    const task = taskNameInput.val();
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1264',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        content: task,
      }),
      success: (response, textStatus) => {
        console.log(response);
        taskList.append(`<li>${task}</li>`);
        taskNameInput.val('');
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  }
}
taskNameInput.on('keydown', addTask);

