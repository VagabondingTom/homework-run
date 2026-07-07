const STORAGE_KEY = 'homework-run-state-v1';
const screens = [...document.querySelectorAll('.screen')];
const form = document.querySelector('#quest-form');
const taskInput = document.querySelector('#task');
const rewards = ['Neuer Dirt-Helm', 'Flammen-Sticker', 'Orange Griffe', 'Neue Track-Rampe', 'Türkise Pedale'];

let state = {
  quest: { subject: 'Deutsch', task: '', scope: '' },
  progress: 0,
  elapsedSeconds: 0,
  currentScreen: 'entry',
  completedQuests: [],
  currentReward: rewards[0]
};
let timerId;
let screenBeforeHistory = 'entry';

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      state = {
        ...state,
        ...saved,
        quest: { ...state.quest, ...(saved.quest || {}) },
        completedQuests: Array.isArray(saved.completedQuests) ? saved.completedQuests : []
      };
    }
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function show(name, save = true) {
  state.currentScreen = name;
  screens.forEach((screen) => screen.classList.toggle('active', screen.dataset.screen === name));
  if (save && name !== 'history') saveState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function renderTimer() {
  const formattedTime = formatTime(state.elapsedSeconds);
  document.querySelector('#elapsed-time').textContent = formattedTime;
  document.querySelector('#confirm-elapsed-time').textContent = formattedTime;
}

function startTimer(reset = false) {
  if (reset) state.elapsedSeconds = 0;
  renderTimer();
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    state.elapsedSeconds += 1;
    renderTimer();
    saveState();
  }, 1000);
}

function pauseTimer() {
  window.clearInterval(timerId);
  timerId = undefined;
  saveState();
}

function fillQuest() {
  const { subject, task, scope } = state.quest;
  document.querySelector('#proposal-subject').textContent = subject.toUpperCase();
  document.querySelector('#proposal-title').textContent = task;
  document.querySelector('#proposal-scope').textContent = scope || 'Eine Aufgabe bis zum Ziel';
  document.querySelector('#active-subject').textContent = subject.toUpperCase();
  document.querySelector('#active-title').textContent = task;
  document.querySelector('#active-scope').textContent = scope || 'Dein heutiger Run';
  document.querySelector('#confirm-title').textContent = task;
  document.querySelector('#reward-name').textContent = state.currentReward;
}

function updateProgress() {
  document.querySelector('#progress-number').textContent = state.progress;
  document.querySelector('#progress-bar').style.width = `${state.progress * 20}%`;
  document.querySelector('#rider').style.left = `${2 + state.progress * 15.2}%`;
  document.querySelector('.progress').setAttribute('aria-label', `Fortschritt: ${state.progress} von 5 Runs`);
}

function renderHistory() {
  const items = [...state.completedQuests].reverse();
  const totalTime = state.completedQuests.reduce((sum, item) => sum + item.elapsedSeconds, 0);
  document.querySelector('#history-count').textContent = items.length;
  document.querySelector('#history-total-time').textContent = formatTime(totalTime);
  const list = document.querySelector('#history-list');

  if (!items.length) {
    list.innerHTML = '<div class="history-empty">Noch kein Run abgeschlossen. Deine erste Ziellinie wartet schon.</div>';
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="history-item">
      <span class="history-subject">${escapeHtml(item.subject.toUpperCase())}</span>
      <strong>${escapeHtml(item.task)}</strong>
      <time datetime="${item.completedAt}">${formatDate(item.completedAt)}</time>
      <span class="history-duration">${formatTime(item.elapsedSeconds)}</span>
      <span class="history-reward">Freigeschaltet: ${escapeHtml(item.reward)}</span>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(isoDate));
}

function restoreForm() {
  document.querySelector('#subject').value = state.quest.subject;
  taskInput.value = state.quest.task;
  document.querySelector('#scope').value = state.quest.scope;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const task = taskInput.value.trim();
  document.querySelector('#task-error').classList.toggle('visible', !task);
  if (!task) { taskInput.focus(); return; }
  state.quest = {
    subject: document.querySelector('#subject').value,
    task,
    scope: document.querySelector('#scope').value.trim()
  };
  fillQuest();
  show('proposal');
});

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'edit') show('entry');
  if (action === 'start') { startTimer(true); show('active'); }
  if (action === 'back') { startTimer(); show('active'); }
  if (action === 'done') { pauseTimer(); show('confirm'); }
  if (action === 'confirm') {
    pauseTimer();
    state.progress = Math.min(5, state.progress + 1);
    state.currentReward = rewards[Math.floor(Math.random() * rewards.length)];
    state.completedQuests.push({
      id: `${Date.now()}`,
      ...state.quest,
      elapsedSeconds: state.elapsedSeconds,
      completedAt: new Date().toISOString(),
      reward: state.currentReward
    });
    fillQuest(); updateProgress(); saveState(); show('success');
  }
  if (action === 'new') {
    pauseTimer();
    state.quest = { subject: 'Deutsch', task: '', scope: '' };
    state.elapsedSeconds = 0;
    renderTimer(); restoreForm(); saveState(); show('entry');
  }
  if (action === 'history') {
    screenBeforeHistory = state.currentScreen === 'history' ? 'entry' : state.currentScreen;
    pauseTimer(); renderHistory(); show('history', false);
  }
  if (action === 'history-back') {
    const destination = screenBeforeHistory || 'entry';
    show(destination);
    if (destination === 'active') startTimer();
  }
  if (action === 'home') {
    if (state.currentScreen === 'active') pauseTimer();
    show(state.quest.task ? 'proposal' : 'entry');
  }
});

loadState();
fillQuest();
restoreForm();
updateProgress();
renderTimer();
renderHistory();

const restorableScreens = ['entry', 'proposal', 'active', 'confirm', 'success'];
const initialScreen = restorableScreens.includes(state.currentScreen) ? state.currentScreen : 'entry';
show(initialScreen, false);
if (initialScreen === 'active') startTimer();
