const STATE_VERSION = 3;
const STORAGE_KEY = 'homework-run-state-v3';
const LEGACY_STORAGE_KEYS = ['homework-run-state-v2', 'homework-run-state-v1'];
const screens = [...document.querySelectorAll('.screen')];
const form = document.querySelector('#quest-form');
const sessionForm = document.querySelector('#session-form');
const taskInput = document.querySelector('#task');
const rewardCatalog = [
  { name: 'Neuer Dirt-Helm', icon: 'helmet' },
  { name: 'Flammen-Sticker', icon: 'flame' },
  { name: 'Orange Griffe', icon: 'grips' },
  { name: 'Neue Track-Rampe', icon: 'ramp' },
  { name: 'Fancy Pedale', icon: 'pedals' },
  { name: 'Dirt-Rahmen', icon: 'frame' },
  { name: 'All-Terrain-Reifen', icon: 'tire' },
  { name: 'Race-Sattel', icon: 'saddle' },
  { name: 'Goldene Kette', icon: 'chain' },
  { name: 'Pro-Nummernschild', icon: 'plate' }
];

const rewardIcons = {
  helmet: '<path class="icon-main" d="M10 36c0-17 9-27 24-27 12 0 20 7 22 18l-15 3-8 13H16z"/><path class="icon-accent" d="m34 11 5 18 16-3C52 16 45 11 34 11Z"/><path class="icon-line" d="M15 37h18l8-7m-24 14h12"/>',
  flame: '<path class="icon-main" d="M34 5c4 13-8 16-2 25 3-6 9-9 11-16 10 12 14 23 8 34-8 15-31 15-39 0-7-14 2-26 12-35-1 10 2 14 5 17 4-9 0-16 5-25Z"/><path class="icon-accent" d="M32 34c7 7 8 12 5 17-3 6-12 6-15 0-3-6 2-11 10-17Z"/>',
  grips: '<path class="icon-line" d="M12 22h13l7 12 7-12h13M32 34v19"/><path class="icon-main" d="M5 17h13v11H5zm41 0h13v11H46z"/><circle class="icon-accent" cx="32" cy="36" r="5"/>',
  ramp: '<path class="icon-main" d="M7 51h50L50 17 17 42Z"/><path class="icon-accent" d="M17 42 50 17l3 10-29 23Z"/><path class="icon-line" d="M8 52h49M18 42l8 10m9-24 11 24"/>',
  pedals: '<circle class="icon-line" cx="32" cy="32" r="9"/><path class="icon-line" d="m26 26-9-9m21 21 9 9"/><rect class="icon-main" x="7" y="11" width="17" height="8" rx="3"/><rect class="icon-main" x="40" y="45" width="17" height="8" rx="3"/><circle class="icon-accent" cx="32" cy="32" r="4"/>',
  frame: '<circle class="icon-line" cx="14" cy="45" r="10"/><circle class="icon-line" cx="50" cy="45" r="10"/><path class="icon-main icon-stroke" d="m14 45 13-22 11 22H14Zm13-22h13l10 22M38 45l7-28"/><path class="icon-line" d="M41 17h10M23 20h9"/>',
  tire: '<circle class="icon-main icon-stroke" cx="32" cy="32" r="24"/><circle class="icon-line" cx="32" cy="32" r="15"/><path class="icon-line" d="M32 17v30M17 32h30M21 21l22 22m0-22L21 43"/><circle class="icon-accent" cx="32" cy="32" r="4"/>',
  saddle: '<path class="icon-main" d="M8 22c12-5 26-6 45-1 5 1 6 8 1 11-11 6-27 8-43 3-7-2-8-10-3-13Z"/><path class="icon-line" d="m31 36-3 17m2-8h12"/><path class="icon-accent" d="M12 23c12-3 25-3 38 0-13 2-26 3-38 0Z"/>',
  chain: '<circle class="icon-main icon-stroke" cx="25" cy="33" r="16"/><circle class="icon-line" cx="25" cy="33" r="7"/><circle class="icon-accent icon-stroke" cx="49" cy="33" r="7"/><path class="icon-line" d="M25 17h24M25 49h24"/><path class="icon-line" d="m25 13 2 7m12-5-4 7m-18-4 6 5m-14 5 8 1M9 39l8-2m0 11 6-6"/>',
  plate: '<path class="icon-main" d="M13 10h38l5 9-5 35H13L8 19Z"/><path class="icon-accent" d="M16 16h32l2 7H14Z"/><path class="icon-line" d="M20 10 16 4m28 6 4-6"/><path class="icon-number" d="M29 28h8v19h-6V34h-5Z"/>',
  badge: '<circle class="icon-main icon-stroke" cx="32" cy="28" r="21"/><path class="icon-accent" d="m32 15 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1Z"/><path class="icon-line" d="m20 46-3 14 15-8 15 8-3-14"/>'
};

const rewardRenames = { 'Türkise Pedale': 'Fancy Pedale' };

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
  currentReward: null
};
let timerId;
let screenBeforeHistory = 'entry';
let screenBeforeGarage = 'entry';
let confirmLock = false;

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
  const completedQuests = Array.isArray(saved.completedQuests)
    ? saved.completedQuests.map((quest) => ({
        ...quest,
        reward: rewardRenames[quest.reward] || quest.reward
      }))
    : [];
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
      lastCompletedSessionId: saved.lastCompletedSessionId || null,
      currentReward: rewardRenames[saved.currentReward] || saved.currentReward || state.currentReward
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
  const track = document.querySelector('.track');
  track.classList.remove('show-landing', 'show-finish');
  if (name === 'success') track.classList.add('show-landing');
  if (name === 'session-complete') track.classList.add('show-finish');
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
  document.querySelector('#rider').classList.add('is-riding');
  timerId = window.setInterval(() => {
    state.elapsedSeconds += 1;
    renderTimer();
    saveState();
  }, 1000);
}

function pauseTimer() {
  window.clearInterval(timerId);
  timerId = undefined;
  document.querySelector('#rider').classList.remove('is-riding');
  saveState();
}

function animateRiderJump(isFinalRun = false) {
  const rider = document.querySelector('#rider');
  rider.classList.remove('is-jumping', 'is-finishing');
  void rider.offsetWidth;
  rider.classList.add(isFinalRun ? 'is-finishing' : 'is-jumping');
  window.setTimeout(() => rider.classList.remove('is-jumping', 'is-finishing'), isFinalRun ? 1500 : 1100);
}

function fillQuest() {
  const { subject, task, scope } = state.quest;
  document.querySelector('#proposal-subject').textContent = subject.toUpperCase();
  document.querySelector('#proposal-title').textContent = task;
  document.querySelector('#proposal-scope').textContent = scope || 'Eine Aufgabe bis zum Ziel';
  document.querySelector('#active-subject').textContent = subject.toUpperCase();
  document.querySelector('#active-title').textContent = task;
  document.querySelector('#active-scope').textContent = scope || 'Dein heutiges Moto';
  document.querySelector('#confirm-title').textContent = task;
}

function getRewardMeta(rewardName) {
  return rewardCatalog.find((reward) => reward.name === rewardName) || { name: rewardName, icon: 'badge' };
}

function getRewardIcon(rewardName, compact = false) {
  const iconName = getRewardMeta(rewardName).icon;
  const icon = rewardIcons[iconName] || rewardIcons.badge;
  const sticker = compact ? '' : `
    <path class="icon-sticker-shadow" d="M7 15 18 5l13 3L43 3l13 9-1 14 6 12-9 11-13 1-11 9-13-7-11-12 5-12Z"/>
    <path class="icon-sticker" d="M5 12 18 3l13 4L44 2l12 9-2 14 7 11-8 12-14 1-10 10-14-8L3 40l5-13Z"/>
    <path class="icon-scuff" d="m12 18 7-4M47 42l6-4M12 44l5 3"/>
  `;
  const art = compact ? icon : `<g class="icon-art" transform="translate(8 8) scale(.75)">${icon}</g>`;
  return `<svg class="reward-svg reward-svg-${iconName}${compact ? ' reward-svg-compact' : ''}" viewBox="0 0 64 64" aria-hidden="true">${sticker}${art}</svg>`;
}

function chooseUniqueReward() {
  const earnedRewards = new Set(state.completedQuests.map((quest) => quest.reward).filter(Boolean));
  const availableRewards = rewardCatalog.filter((reward) => !earnedRewards.has(reward.name));
  if (availableRewards.length) return availableRewards[Math.floor(Math.random() * availableRewards.length)].name;
  return `Dirt-Abzeichen ${earnedRewards.size - rewardCatalog.length + 1}`;
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
    targetRuns ? `Fortschritt: ${completedRuns} von ${targetRuns} Motos` : 'Noch keine Session geplant'
  );
  renderRoundContext();
}

function renderRoundContext() {
  const session = state.currentSession;
  if (!session) return;
  const nextRun = Math.min(session.runIds.length + 1, session.targetRuns);
  document.querySelector('#round-context-label').textContent = `MOTO ${nextRun} VON ${session.targetRuns}`;
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
  const sessionReward = [...runs].reverse().find((run) => run.reward)?.reward;

  document.querySelector('#session-finish-count').textContent = `${runs.length} / ${session.targetRuns}`;
  document.querySelector('#session-finish-time').textContent = formatTime(totalTime);
  const rewardBox = document.querySelector('#session-reward-box');
  rewardBox.hidden = !sessionReward;
  if (sessionReward) {
    document.querySelector('#session-reward-name').textContent = sessionReward;
    document.querySelector('#session-reward-symbol').innerHTML = getRewardIcon(sessionReward);
  }
  document.querySelector('#session-finish-list').innerHTML = runs.map((run, index) => `
    <article class="session-finish-item">
      <span>${index + 1}</span>
      <div><span>${escapeHtml(run.subject.toUpperCase())}</span><strong>${escapeHtml(run.task)}</strong></div>
      <time>${formatTime(run.elapsedSeconds)}</time>
      ${run.reward ? `<span class="session-finish-reward">${getRewardIcon(run.reward, true)} ${escapeHtml(run.reward)}</span>` : ''}
    </article>
  `).join('');
  return true;
}

function renderGarage() {
  const collected = new Map();
  state.completedQuests.forEach((quest) => {
    if (quest.reward) collected.set(quest.reward, quest);
  });
  const items = [...collected.values()].reverse();
  document.querySelector('#garage-count').textContent = items.length;
  const list = document.querySelector('#garage-list');

  if (!items.length) {
    list.innerHTML = '<div class="garage-empty">Noch ist die Garage leer. Der erste Gegenstand wartet hinter deiner nächsten Ziellinie.</div>';
    return;
  }

  list.innerHTML = items.map((item) => {
    const reward = getRewardMeta(item.reward);
    return `
      <article class="garage-item">
        <span class="garage-symbol" aria-hidden="true">${getRewardIcon(item.reward)}</span>
        <strong>${escapeHtml(item.reward)}</strong>
        <time datetime="${item.completedAt}">${formatDate(item.completedAt)}</time>
      </article>
    `;
  }).join('');
}

function buildHistoryGroups(sourceState = state) {
  const quests = Array.isArray(sourceState.completedQuests) ? sourceState.completedQuests : [];
  const sessionMap = new Map();
  (sourceState.sessions || []).forEach((session) => sessionMap.set(session.id, session));
  if (sourceState.currentSession) sessionMap.set(sourceState.currentSession.id, sourceState.currentSession);

  const usedQuestIds = new Set();
  const groups = [...sessionMap.values()].map((session) => {
    const runIdSet = new Set(session.runIds || []);
    const motos = quests.filter((quest) => runIdSet.has(quest.id) || quest.sessionId === session.id);
    motos.forEach((quest) => usedQuestIds.add(quest.id));
    return { ...session, motos };
  });

  const orphanedMotos = quests.filter((quest) => !usedQuestIds.has(quest.id));
  if (orphanedMotos.length) {
    const legacyDates = orphanedMotos.map((moto) => moto.completedAt).filter(Boolean).sort();
    groups.push({
      id: 'unassigned-legacy',
      targetRuns: orphanedMotos.length,
      status: 'legacy',
      startedAt: null,
      completedAt: legacyDates[legacyDates.length - 1] || null,
      motos: orphanedMotos
    });
  }

  return groups.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    const dateA = new Date(a.completedAt || a.startedAt || 0).getTime();
    const dateB = new Date(b.completedAt || b.startedAt || 0).getTime();
    return dateB - dateA;
  });
}

function renderHistoryMoto(item) {
  return `
    <article class="history-moto">
      <span>${escapeHtml(item.subject.toUpperCase())}</span>
      <strong>${escapeHtml(item.task)}</strong>
      <time>${formatTime(item.elapsedSeconds)}</time>
    </article>
  `;
}

function renderHistory() {
  const groups = buildHistoryGroups();
  const totalTime = state.completedQuests.reduce((sum, item) => sum + item.elapsedSeconds, 0);
  document.querySelector('#history-total-time').textContent = formatTime(totalTime);
  const list = document.querySelector('#history-list');

  document.querySelector('#history-count').textContent = state.completedQuests.length;

  if (!groups.length) {
    list.innerHTML = '<div class="history-empty">Noch kein Moto abgeschlossen. Deine erste Ziellinie wartet schon.</div>';
    return;
  }

  list.innerHTML = groups.map((group) => {
    const totalSessionTime = group.motos.reduce((sum, moto) => sum + moto.elapsedSeconds, 0);
    const rewards = [...new Set(group.motos.map((moto) => moto.reward).filter(Boolean))];
    const statusLabel = group.status === 'active' ? 'SESSION LÄUFT' : group.status === 'legacy' ? 'FRÜHERE MOTOS' : 'SESSION DIALED';
    const sessionDate = group.completedAt || group.startedAt;
    const rewardMarkup = rewards.length === 1
      ? `<div class="history-session-reward">${getRewardIcon(rewards[0], true)}<span><small>SESSION-GEWINN</small><strong>${escapeHtml(rewards[0])}</strong></span></div>`
      : rewards.length > 1
        ? `<div class="history-session-legacy-rewards"><small>GEWINNE AUS FRÜHERER VERSION</small><span>${rewards.map(escapeHtml).join(' · ')}</span></div>`
        : '';

    return `
    <article class="history-session ${group.status === 'active' ? 'is-active' : ''}">
      <header>
        <div><span>${statusLabel}</span><strong>${group.motos.length} / ${group.targetRuns || group.motos.length} MOTOS</strong></div>
        ${sessionDate ? `<time datetime="${sessionDate}">${formatDate(sessionDate)}</time>` : ''}
      </header>
      <div class="history-session-time"><span>ZEIT AUF DEM TRACK</span><strong>${formatTime(totalSessionTime)}</strong></div>
      ${rewardMarkup}
      <div class="history-moto-list">
        ${group.motos.length ? group.motos.map(renderHistoryMoto).join('') : '<p>Noch kein Moto abgeschlossen.</p>'}
      </div>
    </article>
  `;
  }).join('');
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
    if (confirmLock) return;
    confirmLock = true;
    const confirmButton = document.querySelector('[data-action="confirm"]');
    confirmButton.disabled = true;
    window.setTimeout(() => {
      confirmLock = false;
      confirmButton.disabled = false;
    }, 700);
    pauseTimer();
    const session = state.currentSession;
    if (!session || session.status !== 'active' || session.runIds.length >= session.targetRuns) {
      updateProgress(); show(session ? 'session-complete' : 'planning'); return;
    }
    const finishesSession = session.runIds.length + 1 >= session.targetRuns;
    state.currentReward = finishesSession ? chooseUniqueReward() : null;
    const completedQuest = {
      id: `${Date.now()}`,
      ...state.quest,
      elapsedSeconds: state.elapsedSeconds,
      completedAt: new Date().toISOString(),
      reward: state.currentReward || null,
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
      renderSessionComplete(); show('session-complete'); updateProgress(); animateRiderJump(true);
    } else {
      fillQuest(); updateProgress(); animateRiderJump(); saveState(); show('success');
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
  if (action === 'garage') {
    screenBeforeGarage = state.currentScreen === 'garage' ? 'planning' : state.currentScreen;
    pauseTimer(); renderGarage(); show('garage', false);
  }
  if (action === 'garage-back') {
    const destination = screenBeforeGarage || 'planning';
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
renderGarage();
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
