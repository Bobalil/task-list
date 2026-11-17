const STORAGE_KEY = 'todo-tasks-v1';
const THEME_KEY = 'todo-theme';

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const counter = document.getElementById('counter');
const themeToggle = document.getElementById('theme-toggle');

/* ---------- Тема ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    // По умолчанию — системная тема
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ---------- Задачи ---------- */
let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Удалить задачу';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, span, delBtn);
    list.appendChild(li);
  });

  emptyMsg.style.display = tasks.length ? 'none' : 'block';

  const doneCount = tasks.filter(t => t.done).length;
  counter.textContent = tasks.length
    ? `Выполнено ${doneCount} из ${tasks.length}`
    : '';
}

function addTask() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  tasks.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text,
    done: false
  });
  input.value = '';
  input.focus();
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

/* ---------- Инициализация ---------- */
initTheme();
render();