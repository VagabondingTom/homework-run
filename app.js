const STATE_VERSION = 3;
const STORAGE_KEY = 'homework-run-state-v3';
const LEGACY_STORAGE_KEYS = ['homework-run-state-v2', 'homework-run-state-v1'];
const screens = [...document.querySelectorAll('.screen')];
const form = document.querySelector('#quest-form');
const sessionForm = document.querySelector('#session-form');
const taskInput = document.querySelector('#task');
const rewards = ['Neuer Dirt-Helm', 'Flammen-Sticker', 'Orange Griffe', 'Neue Track-Rampe', 'Türkise Pedale'];

let state = {
  schemaVersion: STATE_VERSION,
  quest: { subject: 'Deutsch', task: '', scope: '' },
  progress: 0,
  elapsedSeconds: 0,
  currentScreen: 'planning',
  completedQuests: [],
  currentSession: null,
  sessions: [],
  lastCompletedSessionId: null,
  currentReward: rewards[0]
};
let timerId;
let screenBeforeHistory = 'entry';

function loadState() {
  try {
    const currentState = localStorage.getItem(STORAGE_KEY);
    const legacyState = LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    const saved = JSON.parse(currentState || legacyState);
    if (saved && typeof saved === 'object') {
      state = migrateState(saved);
      saveState();
      if (!currentState && legacyState) LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  }
}

function migrateState(saved) {
  const completedQuests = Array.isArray(saved.completedQuests) ? saved.completedQuests : [];
  const sessions = Array.isArray(saved.sessions) ? saved.sessions : [];

  if (saved.schemaVersion === STATE_VERSION) {
    const currentSession = saved.currentSession ? {
      ...saved.currentSession,
      goalLocked: Boolean(
        saved.currentSession.goalLocked ||
        saved.currentSession.runIds?.length ||
        ['active', 'confirm'].includes(saved.currentScreen)
      )
    } : null;
    return {
      ...state,
      ...saved,
      schemaVersion: STATE_VERSION,
      quest: { ...state.quest, ...(saved.quest || {}) },
      completedQuests,
      currentSession,
      sessions,
      lastCompletedSessionId: saved.lastCompletedSessionId || null
    };
  }

  if (saved.schemaVersion === 2) {
    const oldCurrentSession = saved.currentSession;
    const oldRunIds = Array.isArray(oldCurrentSession?.runIds) ? oldCurrentSession.runIds : [];
    const archivedSessions = [...sessions];

    if (oldCurrentSession && oldRunIds.length) {
      const archivedSession = {
        ...oldCurrentSession,
        targetRuns: oldRunIds.length,
        status: 'completed',
        goalChosenByUser: false,
        completedAt: oldCurrentSession.completedAt || new Date().toISOString(),
        runIds: oldRunIds
      };
      const existingIndex = archivedSessions.findIndex((session) => session.id === archivedSession.id);
      if (existingIndex >= 0) archivedSessions[existingIndex] = archivedSession;
      else archivedSessions.push(archivedSession);
    }

    return {
      ...state,
      ...saved,
      schemaVersion: STATE_VERSION,
      quest: { subject: 'Deutsch', task: '', scope: '' },
      elapsedSeconds: 0,
      progress: 0,
      currentScreen: 'planning',
      completedQuests,
      currentSession: null,
      sessions: archivedSessions,
      lastCompletedSessionId: oldRunIds.length ? oldCurrentSession.id : (saved.lastCompletedSessionId || null)
    };
  }

  if (!completedQuests.length) {
    return {
      ...state,
      ...saved,
      schemaVersion: STATE_VERSION,
      quest: { ...state.quest, ...(saved.quest || {}) },
      completedQuests: [],
      currentSession: null,
      sessions: [],
      lastCompletedSessionId: null
    };
  }

  const legacySessionId = `legacy-${Date.now()}`;
  const migratedQuests = completedQuests.map((quest) => ({
    ...quest,
    sessionId: quest.sessionId || legacySessionId
  }));
  const completionDates = migratedQuests.map((quest) => quest.completedAt).filter(Boolean).sort();

  return {
    ...state,
    ...saved,
    schemaVersion: STATE_VERSION,
    quest: { ...state.quest, ...(saved.quest || {}) },
    completedQuests: migratedQuests,
    currentSession: null,
    lastCompletedSessionId: legacySessionId,
    sessions: [{
      id: legacySessionId,
      targetRuns: Math.max(migratedQuests.length, Number(saved.progress) || 0, 1),
      status: 'completed',
      startedAt: null,
      completedAt: completionDates[completionDates.length - 1] || new Date().toISOString(),
      runIds: migratedQuests.map((quest) => quest.id)
    }]
  };
}

function createSession(targetRuns) {
  return {
    id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    targetRuns,
    status: 'active',
    goalChosenByUser: true,
    goalLocked: false,
    startedAt: new Date().toISOString(),
    completedAt: null,
    runIds: []
  };
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
  const completedSession = state.sessions.find((session) => session.id === state.lastCompletedSessionId);
  const visibleSession = state.currentSession || (state.currentScreen === 'session-complete' ? completedSession : null);
  const completedRuns = visibleSession?.runIds?.length || 0;
  const targetRuns = visibleSession?.targetRuns || null;
  const fraction = targetRuns ? Math.min(completedRuns / targetRuns, 1) : 0;

  document.querySelector('#progress-number').textContent = completedRuns;
  document.querySelector('#progress-target').textContent = targetRuns || '?';
  document.querySelector('#progress-bar').style.width = `${fraction * 100}%`;
  document.querySelector('#rider').style.left = `${2 + fraction * 76}%`;
  document.querySelector('.progress').setAttribute(
    'aria-label',
    targetRuns ? `Fortschritt: ${completedRuns} von ${targetRuns} Runs` : 'Noch keine Runde geplant'
  );
  renderRoundContext();
}

function renderRoundContext() {
  const session = state.currentSession;
  if (!session) return;
  const nextRun = Math.min(session.runIds.length + 1, session.targetRuns);
  document.querySelector('#round-context-label').textContent = `RUN ${nextRun} VON ${session.targetRuns}`;
  document.querySelector('#edit-target-button').hidden = session.goalLocked;
}

function renderPlanningSelection() {
  const target = state.currentSession && !state.currentSession.goalLocked ? state.currentSession.targetRuns : null;
  document.querySelector('#run-goal').value = target || '';
}

function renderSessionComplete() {
  const session = state.sessions.find((item) => item.id === state.lastCompletedSessionId);
  if (!session) return false;
  const runs = session.runIds
    .map((id) => state.completedQuests.find((quest) => quest.id === id))
    .filter(Boolean);
  const totalTime = runs.reduce((sum, run) => sum + run.elapsedSeconds, 0);

  document.querySelector('#session-finish-count').textContent = `${runs.length} / ${session.targetRuns}`;
  document.querySelector('#session-finish-time').textContent = formatTime(totalTime);
  document.querySelector('#session-finish-list').innerHTML = runs.map((run, index) => `
    <article class="session-finish-item">
      <span>${index + 1}</span>
      <div><span>${escapeHtml(run.subject.toUpperCase())}</span><strong>${escapeHtml(run.task)}</strong></div>
      <time>${formatTime(run.elapsedSeconds)}</time>
    </article>
  `).join('');
  return true;
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

sessionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const goalInput = document.querySelector('#run-goal');
  const targetRuns = Number(goalInput.value);
  const validGoal = Number.isInteger(targetRuns) && targetRuns >= 1;
  document.querySelector('#goal-error').classList.toggle('visible', !validGoal);
  if (!validGoal) { goalInput.focus(); return; }
  if (state.currentSession && !state.currentSession.goalLocked) {
    state.currentSession.targetRuns = targetRuns;
  } else {
    state.currentSession = createSession(targetRuns);
  }
  state.progress = 0;
  state.quest = { subject: 'Deutsch', task: '', scope: '' };
  state.elapsedSeconds = 0;
  restoreForm(); renderTimer(); updateProgress(); saveState(); show('entry');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.currentSession) { renderPlanningSelection(); show('planning'); return; }
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
  if (action === 'goal-decrease' || action === 'goal-increase') {
    const goalInput = document.querySelector('#run-goal');
    const currentValue = Number(goalInput.value);
    goalInput.value = action === 'goal-increase'
      ? (currentValue >= 1 ? currentValue + 1 : 1)
      : (currentValue >= 1 ? Math.max(1, currentValue - 1) : 1);
    document.querySelector('#goal-error').classList.remove('visible');
  }
  if (action === 'edit-target' && state.currentSession && !state.currentSession.goalLocked) {
    renderPlanningSelection(); show('planning');
  }
  if (action === 'start') {
    if (!state.currentSession) { renderPlanningSelection(); show('planning'); return; }
    state.currentSession.goalLocked = true;
    if (!state.currentSession.firstRunStartedAt) state.currentSession.firstRunStartedAt = new Date().toISOString();
    startTimer(true); show('active');
  }
  if (action === 'back') { startTimer(); show('active'); }
  if (action === 'done') { pauseTimer(); show('confirm'); }
  if (action === 'confirm') {
    pauseTimer();
    const session = state.currentSession;
    if (!session || session.status !== 'active' || session.runIds.length >= session.targetRuns) {
      updateProgress(); show(session ? 'session-complete' : 'planning'); return;
    }
    state.currentReward = rewards[Math.floor(Math.random() * rewards.length)];
    const completedQuest = {
      id: `${Date.now()}`,
      ...state.quest,
      elapsedSeconds: state.elapsedSeconds,
      completedAt: new Date().toISOString(),
      reward: state.currentReward,
      sessionId: session.id
    };
    state.completedQuests.push(completedQuest);
    session.runIds.push(completedQuest.id);
    state.progress = session.runIds.length;

    if (session.runIds.length >= session.targetRuns) {
      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      state.lastCompletedSessionId = session.id;
      state.sessions = [...state.sessions.filter((item) => item.id !== session.id), { ...session }];
      state.currentSession = null;
      saveState();
      renderSessionComplete(); show('session-complete'); updateProgress();
    } else {
      fillQuest(); updateProgress(); saveState(); show('success');
    }
  }
  if (action === 'new') {
    pauseTimer();
    state.quest = { subject: 'Deutsch', task: '', scope: '' };
    state.elapsedSeconds = 0;
    renderTimer(); restoreForm(); saveState(); show('entry');
  }
  if (action === 'new-session') {
    pauseTimer();
    state.currentSession = null;
    state.progress = 0;
    state.quest = { subject: 'Deutsch', task: '', scope: '' };
    state.elapsedSeconds = 0;
    renderTimer(); restoreForm(); renderPlanningSelection(); saveState(); show('planning'); updateProgress();
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
    if (state.currentScreen === 'session-complete' && renderSessionComplete()) { show('session-complete'); return; }
    if (state.currentScreen === 'success') { show('success'); return; }
    if (!state.currentSession) { renderPlanningSelection(); show('planning'); return; }
    show(state.quest.task ? 'proposal' : 'entry');
  }
});

loadState();
fillQuest();
restoreForm();
updateProgress();
renderTimer();
renderHistory();
renderPlanningSelection();

const restorableScreens = ['planning', 'entry', 'proposal', 'active', 'confirm', 'success', 'session-complete'];
let initialScreen = restorableScreens.includes(state.currentScreen) ? state.currentScreen : 'planning';
if (!state.currentSession && initialScreen !== 'session-complete') initialScreen = 'planning';
if (initialScreen === 'session-complete' && !renderSessionComplete()) initialScreen = 'planning';
if (state.currentSession?.runIds.length >= state.currentSession?.targetRuns) initialScreen = 'planning';
state.currentScreen = initialScreen;
updateProgress();
show(initialScreen, false);
if (initialScreen === 'active') startTimer();
