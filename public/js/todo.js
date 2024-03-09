const deleteButtons = document.querySelectorAll('.todo_delete');
const deleteTasksButtons = document.querySelectorAll('.task_delete');

const collapseButtons = document.querySelectorAll('.todo_collapse');

const doneButtons = document.querySelectorAll('.task_done');

const filterButtons = document.querySelectorAll('.todo_tasks__filters button');

let currentFilter = 'all';

filterButtons.forEach((btn) => {
  const filter = btn.getAttribute('data-filter');
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    if (filter === currentFilter) return;
    currentFilter = filter;
    const tasks = document.querySelectorAll(
      `.task[data-todoId="${btn.getAttribute('data-todoId')}"]`,
    );
    const empty = document.querySelector(
      `.null[data-todoId="${btn.getAttribute('data-todoId')}"]`,
    );
    empty.classList.remove('active');
    if (filter === 'all') {
      tasks.forEach((task) => {
        task.style.display = 'flex';
      });
    } else if (filter === 'active') {
      tasks.forEach((task) => {
        const done = JSON.parse(task.getAttribute('data-done'));
        if (done) {
          task.style.display = 'none';
        } else {
          task.style.display = 'flex';
        }
      });
      if (!Array.from(tasks).some((t) => t.style.display === 'flex')) {
        empty.classList.add('active');
      }
    } else {
      tasks.forEach((task) => {
        const done = JSON.parse(task.getAttribute('data-done'));
        if (done) {
          task.style.display = 'flex';
        } else {
          task.style.display = 'none';
        }
      });
      if (!Array.from(tasks).some((t) => t.style.display === 'flex')) {
        empty.classList.add('active');
      }
    }
  });
});

window.addEventListener('load', function (e) {
  const id = window.location.href.split('#')[1];
  if (!id) return;
  console.log(document.getElementById(id));
  collapseButtons.forEach((btn) => {
    const tasksRoot = document.querySelector(
      `.todo_tasks[data-todoId="${btn.getAttribute('data-todoId')}"]`,
    );
    if (!tasksRoot) return;
    tasksRoot.style.maxHeight = tasksRoot.scrollHeight + 'px';
    tasksRoot.style.marginTop = '30px';
  });
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  });
});

doneButtons.forEach((btn) => {
  const taskId = btn.getAttribute('data-taskId');
  if (!taskId) return;
  const task = document.querySelector(
    `.task[data-id="${btn.getAttribute('data-taskId')}"]`,
  );
  const text = task.querySelector('h4');
  btn.addEventListener('click', () => {
    fetch(`/todo/task/${taskId}`, {
      method: 'put',
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          btn.classList.add('active');
          task.setAttribute('data-done', 'true');
          text.classList.add('done');
        } else {
          btn.classList.remove('active');
          task.setAttribute('data-done', 'false');
          text.classList.remove('done');
        }
      });
  });
});

deleteButtons.forEach((btn) => {
  const todoId = btn.getAttribute('data-todoId');
  if (!todoId) return;
  btn.addEventListener('click', () => {
    fetch(`/todo/${todoId}`, { method: 'delete' })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        window.location.replace('/');
      });
  });
});

deleteTasksButtons.forEach((btn) => {
  const taskId = btn.getAttribute('data-taskId');
  const todoId = btn.getAttribute('data-todoId');
  if (!taskId) return;
  btn.addEventListener('click', () => {
    fetch(`/todo/task/${taskId}`, { method: 'delete' })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        window.location.replace(`/#${todoId.split('-').join('')}`);
        window.location.reload();
      });
  });
});

collapseButtons.forEach((btn) => {
  const tasksRoot = document.querySelector(
    `.todo_tasks[data-todoId="${btn.getAttribute('data-todoId')}"]`,
  );
  if (!tasksRoot) return;
  btn.addEventListener('click', () => {
    tasksRoot.classList.toggle('active');
    btn.classList.toggle('active');
    if (tasksRoot.style.maxHeight) {
      tasksRoot.style.maxHeight = null;
      tasksRoot.style.marginTop = '0px';
    } else {
      tasksRoot.style.maxHeight = tasksRoot.scrollHeight + 'px';
      tasksRoot.style.marginTop = '30px';
    }
  });
});

document.querySelectorAll('.todo_popup__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const popup = document.querySelector(
      `.todo_popup[data-todoId="${btn.getAttribute('data-todoId')}"]`,
    );
    if (!popup) return;
    popup.classList.toggle('active');
  });
});

document.querySelectorAll('.todo_popup').forEach((p) => {
  p.addEventListener('click', function (event) {
    if (!event.target.closest('.todo_popup form')) {
      this.classList.remove('active');
    }
  });
});

let currentTodoId = null;
let currentTodoOrder = null;

const todosRoot = document.querySelector('.todos');
const todos = document.querySelectorAll('.todo');
const container = document.body;

todos.forEach((todo) => {
  const id = todo.getAttribute('data-id');
  const order = todo.getAttribute('data-order');
  if (!id) return;
  const tasksRoot = todo.querySelector('.todo_tasks');
  todo.addEventListener('dragstart', (event) => {
    currentTodoId = id;
    currentTodoOrder = order;
    todo.classList.add('drag');
    tasksRoot.style.maxHeight = null;
    tasksRoot.style.marginTop = '0px';
  });

  todo.addEventListener('dragend', () => {
    todo.classList.remove('drag');
  });
  todo.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (id !== currentTodoId) {
      if (currentTodoOrder > order) {
        todo.classList.add('bottom');
      } else {
        todo.classList.add('top');
      }
    }
  });

  todo.addEventListener('dragleave', (e) => {
    todo.classList.remove('bottom');
    todo.classList.remove('top');
  });
  todo.addEventListener('drop', (e) => {
    e.preventDefault();
    todo.classList.remove('drag');
    document.removeEventListener('mousemove', scroll);
    if (!currentTodoId || currentTodoId === id) return;
    fetch(`/todo/${id}/order/${currentTodoId}`, {
      method: 'put',
    }).then((res) => {
      window.location.replace(`/#${currentTodoId.split('-').join('')}`);
      window.location.reload();
    });
  });
});
