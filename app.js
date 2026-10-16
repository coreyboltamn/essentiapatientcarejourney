import { agenda, stages, architecture, scenario } from './content.js';

const $ = (id) => document.getElementById(id);
let stageIndex = 0;
let agendaIndex = 0;
let scenarioIndex = 0;
let aslScenario = false;
let persona = 'spoken';
let journeyTimer = null;

const personaDetails = {
  spoken: { label: 'Spanish-speaking patient', path: 'spoken-language pathway' },
  asl: { label: 'Deaf ASL-using patient', path: 'ASL / visual communication pathway' },
};

const stageTouchpoints = [
  ['Website', 'Call Center', 'Patient Portal'],
  ['Appointment Scheduling', 'Patient Portal', 'Text/Email Reminders', 'Pre-Visit Instructions'],
  ['Front Desk/Registration', 'Kiosk Check-In'],
  ['Nurse Triage', 'Physician Consult'],
  ['Medication Administration', 'Care Planning'],
  ['Discharge Instructions', 'Medication Education'],
  ['Follow-Up Calls', 'Billing', 'Patient Surveys', 'Portal Messaging'],
];

function announce(text) {
  $('announcement').textContent = text;
}

function choiceButton(label, index, onSelect) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => onSelect(index));
  return button;
}

function selectButton(container, index) {
  [...container.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}

function showStage(index, notify = true) {
  stageIndex = index;
  const stage = stages[index];
  selectButton($('journey-stages'), index);
  const selectedPersona = personaDetails[persona];
  $('track').style.setProperty('--progress', `${3 + index * 94 / (stages.length - 1)}%`);
  $('stage-position').textContent = `STAGE ${index + 1} OF ${stages.length} / ${stage.label.toUpperCase()}`;
  $('stage-title').textContent = stage.title;
  $('stage-icon').textContent = stage.icon;
  $('stage-outcome').textContent = stage.outcome;
  $('persona-stage-label').textContent = `Following: ${selectedPersona.label} · ${selectedPersona.path}`;
  $('patient-need').textContent = persona === 'asl' ? stage.asl : stage.patient;
  $('care-action').textContent = stage.action;
  $('stage-solution').textContent = stage.solution;
  $('stage-agenda').href = `#agenda-${stage.agenda + 1}`;
  $('stage-prev').disabled = index === 0;
  $('stage-next').disabled = index === stages.length - 1;
  $('touchpoint-bands').querySelectorAll('[data-touchpoint]').forEach((item) => {
    const active = stageTouchpoints[index].includes(item.dataset.touchpoint);
    item.classList.toggle('tp-active', active);
    item.classList.toggle('tp-dim', !active);
  });
  $('touchpoint-bands').querySelectorAll('.touchpoint-card').forEach((card) => {
    card.classList.toggle('phase-active', card.querySelector('.tp-active') !== null);
    card.classList.toggle('phase-idle', card.querySelector('.tp-active') === null);
  });
  if (notify) announce(`${selectedPersona.label}, ${stage.title}. ${stage.solution}`);
}

function selectPersona(value, notify = true) {
  persona = value;
  aslScenario = persona === 'asl';
  [...$('persona-list').children].forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.persona === persona)));
  const selectedPersona = personaDetails[persona];
  $('persona-context').textContent = `Selected experience: ${selectedPersona.label} · ${selectedPersona.path}. The current stage, service connection, and demo scenario will keep this access need in view.`;
  showStage(stageIndex, false);
  showScenario(scenarioIndex, false);
  if (notify) announce(`Following the ${selectedPersona.label} through the patient journey.`);
}

function stopAutoPlay() {
  if (journeyTimer !== null) window.clearInterval(journeyTimer);
  journeyTimer = null;
  $('journey-play').textContent = '▶ Auto-play';
  $('journey-play').setAttribute('aria-pressed', 'false');
}

function startAutoPlay() {
  if (journeyTimer !== null) return;
  $('journey-play').textContent = 'Ⅱ Pause';
  $('journey-play').setAttribute('aria-pressed', 'true');
  announce('Auto-play started. Journey stages will advance.');
  journeyTimer = window.setInterval(() => {
    if (stageIndex >= stages.length - 1) {
      stopAutoPlay();
      announce('End of the patient journey.');
      return;
    }
    showStage(stageIndex + 1);
  }, 3500);
}

function addList(parent, title, items) {
  const heading = document.createElement('h4');
  heading.textContent = title;
  const list = document.createElement('ul');
  items.forEach((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  parent.append(heading, list);
}

function textElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function showAgenda(index, notify = true) {
  agendaIndex = index;
  const topic = agenda[index];
  selectButton($('agenda-list'), index);
  const detail = $('agenda-detail');
  detail.replaceChildren();
  const title = textElement('h3', topic.title);
  title.id = 'agenda-title';
  detail.append(textElement('p', `${String(index + 1).padStart(2, '0')} / ${topic.phase.toUpperCase()}`, 'eyebrow'), title, textElement('p', topic.summary, 'detail-summary'));
  addList(detail, 'Workflow to explore', topic.workflow);
  const solution = textElement('div', topic.solution, 'solution-chip');
  const asl = document.createElement('div');
  asl.className = 'asl-callout';
  asl.append(textElement('h4', 'ASL / communication access'), textElement('p', topic.asl));
  detail.append(solution, asl);
  const disclosure = document.createElement('details');
  disclosure.append(textElement('summary', 'Validation & implementation considerations'));
  addList(disclosure, 'Confirm together', topic.considerations);
  detail.append(disclosure, textElement('p', `DISCUSS → ${topic.question}`, 'discussion'));
  const controls = document.createElement('div');
  controls.className = 'controls';
  const previous = choiceButton('← Previous topic', index - 1, navigateAgenda);
  const next = choiceButton('Next topic →', index + 1, navigateAgenda);
  previous.disabled = index === 0;
  next.disabled = index === agenda.length - 1;
  controls.append(previous, textElement('span', `${index + 1} / ${agenda.length}`), next);
  detail.append(controls);
  if (notify) announce(`Agenda ${index + 1} of ${agenda.length}: ${topic.title}`);
}

function navigateAgenda(index) {
  if (index < 0 || index >= agenda.length) return;
  // Keep a stable focus target when replacing the detail pane controls.
  $('agenda-list').children[index].focus({ preventScroll: true });
  if (location.hash === `#agenda-${index + 1}`) showAgenda(index);
  else location.hash = `agenda-${index + 1}`;
}

function applyAgendaHash() {
  const match = location.hash.match(/^#agenda-(\d+)$/);
  if (!match) return;
  const index = Number(match[1]) - 1;
  if (index < 0 || index >= agenda.length) return;
  showAgenda(index);
  $('agenda').scrollIntoView({ behavior: 'instant', block: 'start' });
}

function showArchitecture(index, notify = true) {
  selectButton($('architecture-nodes'), index);
  $('architecture-title').textContent = architecture[index].title;
  $('architecture-description').textContent = architecture[index].detail;
  if (notify) announce(`Architecture: ${architecture[index].title}`);
}

function showScenario(index, notify = true) {
  scenarioIndex = index;
  selectButton($('scenario-steps'), index);
  $('scenario-number').textContent = String(index + 1).padStart(2, '0');
  $('scenario-title').textContent = scenario[index].title;
  $('scenario-path').textContent = aslScenario ? 'ASL / COMMUNICATION-ACCESS PATHWAY' : 'SPOKEN-LANGUAGE PATHWAY · SPANISH';
  $('scenario-description').textContent = scenario[index][aslScenario ? 'asl' : 'spoken'];
  $('scenario-count').textContent = `${index + 1} / ${scenario.length}`;
  $('scenario-prev').disabled = index === 0;
  $('scenario-next').disabled = index === scenario.length - 1;
  $('scenario-spoken').setAttribute('aria-pressed', String(!aslScenario));
  $('scenario-asl').setAttribute('aria-pressed', String(aslScenario));
  if (notify) announce(`${aslScenario ? 'ASL' : 'Spoken language'} scenario, step ${index + 1}: ${scenario[index].title}`);
}

stages.forEach((stage, index) => {
  const button = choiceButton('', index, showStage);
  button.append(textElement('small', `0${index + 1}`), textElement('strong', stage.title));
  button.setAttribute('aria-label', `Stage ${index + 1}: ${stage.title}`);
  $('journey-stages').append(button);
});
agenda.forEach((topic, index) => {
  const button = choiceButton('', index, navigateAgenda);
  button.append(textElement('span', String(index + 1).padStart(2, '0')), textElement('strong', topic.short), textElement('span', '↗', 'agenda-arrow'));
  $('agenda-list').append(button);
});
architecture.forEach((node, index) => {
  const button = choiceButton('', index, showArchitecture);
  button.append(textElement('span', `0${index + 1}`), textElement('strong', node.title), textElement('small', 'Explore connection ↗'));
  $('architecture-nodes').append(button);
});
scenario.forEach((step, index) => $('scenario-steps').append(choiceButton(`${index + 1}. ${step.title}`, index, showScenario)));

$('stage-prev').addEventListener('click', () => showStage(Math.max(0, stageIndex - 1)));
$('stage-next').addEventListener('click', () => showStage(Math.min(stages.length - 1, stageIndex + 1)));
$('journey-play').addEventListener('click', () => journeyTimer === null ? startAutoPlay() : stopAutoPlay());
$('persona-list').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-persona]');
  if (button) selectPersona(button.dataset.persona);
});
$('presentation-mode').addEventListener('change', (event) => {
  document.body.classList.toggle('presentation-mode', event.target.checked);
});
$('demo-handoff-button').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const started = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(started));
  button.textContent = started ? 'Return from live demo' : 'Mark live-demo handoff';
  announce(started
    ? 'Live-demo handoff: switch to the AMN technology demo now. Return to the microsite for the illustrative scenario.'
    : 'Return to the microsite after the live technology demo.');
});
$('journey-restart').addEventListener('click', () => {
  stopAutoPlay();
  persona = 'spoken';
  agendaIndex = 0;
  scenarioIndex = 0;
  aslScenario = false;
  $('presentation-mode').checked = false;
  document.body.classList.remove('presentation-mode');
  $('demo-handoff-button').setAttribute('aria-pressed', 'false');
  $('demo-handoff-button').textContent = 'Mark live-demo handoff';
  selectPersona(persona, false);
  showAgenda(0, false);
  showArchitecture(0, false);
  showScenario(0, false);
  if (location.hash) history.replaceState(null, '', `${location.pathname}${location.search}`);
  $('overview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  announce('Journey restarted at the first patient persona and stage.');
});
$('scenario-prev').addEventListener('click', () => showScenario(Math.max(0, scenarioIndex - 1)));
$('scenario-next').addEventListener('click', () => showScenario(Math.min(scenario.length - 1, scenarioIndex + 1)));
['spoken', 'asl'].forEach((path) => $(`scenario-${path}`).addEventListener('click', () => {
  selectPersona(path, true);
}));

// Arrow keys navigate within each selector; normal Tab navigation remains available.
['journey-stages', 'agenda-list', 'architecture-nodes', 'scenario-steps'].forEach((id) => {
  $(id).addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...$(id).children];
    let index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = buttons.length - 1;
    else index = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
    buttons[index].focus();
    buttons[index].click();
  });
});

$('present').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else announce('Fullscreen is unavailable. Use your browser’s full-screen command.');
  } catch {
    announce('Fullscreen could not start. Use your browser’s full-screen command.');
  }
});
document.addEventListener('fullscreenchange', () => {
  $('present').textContent = document.fullscreenElement ? 'Exit presentation ⛶' : 'Present ⛶';
});
window.addEventListener('hashchange', applyAgendaHash);
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#agenda-"]');
  if (!link || link.hash !== location.hash || event.defaultPrevented ||
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  applyAgendaHash();
});
showStage(0, false);
selectPersona(persona, false);
showAgenda(agendaIndex, false);
showArchitecture(0, false);
showScenario(0, false);
applyAgendaHash();
