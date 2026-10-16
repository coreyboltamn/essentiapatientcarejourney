import { architecture } from './content.js';
import { slides, slideIndexForHash } from './presentation.js';

const $ = (id) => document.getElementById(id);
let index = slideIndexForHash(location.hash);

function textElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function list(items) {
  const element = document.createElement('ul');
  items.forEach((item) => element.append(textElement('li', item)));
  return element;
}

function card(title, copy, className = '') {
  const element = document.createElement('article');
  element.className = `card ${className}`;
  element.append(textElement('h2', title));
  element.append(Array.isArray(copy) ? list(copy) : textElement('p', copy));
  return element;
}

function pairedPathways(spoken, asl, spokenTitle = 'Spoken-language pathway') {
  const pair = document.createElement('div');
  pair.className = 'pathways';
  pair.append(card(spokenTitle, spoken), card('ASL / communication access', asl, 'asl'));
  return pair;
}

function showSlide(focus = false) {
  const slide = slides[index];
  const data = slide.data;
  const panel = $('slide');
  panel.className = `slide ${slide.type}`;
  const heading = textElement('h1', slide.title);
  heading.id = 'slide-title';
  heading.tabIndex = -1;
  panel.replaceChildren(textElement('p', slide.label, 'eyebrow'), heading);
  $('chapter').textContent = slide.chapter;

  if (slide.type === 'overview') {
    panel.append(
      textElement('p', 'One partner. Every language access need.', 'lead'),
      textElement('p', 'Follow the patient from first contact to ongoing care. Connect each moment to AMN language services, with spoken-language and ASL access side by side.'),
      list([
        'Align on the opportunity · 10 min',
        'Map the patient journey · 20 min',
        'Connect solutions and architecture · 50 min',
        'Walk through urgent care together · 20 min',
        'Agree on reporting, implementation, and next steps · 20 min',
      ]),
      textElement('p', 'Our guiding question: where could a patient lose communication access—and how will we keep it connected?', 'discussion'),
    );
  } else if (slide.type === 'journey') {
    panel.append(textElement('p', data.outcome, 'lead'));
    const spoken = [data.patient, data.action];
    panel.append(pairedPathways(spoken, data.asl, 'Patient experience & care-team workflow'));
    panel.append(textElement('p', `AMN connection · ${data.solution}`, 'solution'));
    panel.append(textElement('p', 'Patient preference and effective communication guide the modality. Audio-only is not an ASL fallback.', 'access-note'));
  } else if (slide.type === 'agenda') {
    panel.append(textElement('p', data.summary, 'lead'));
    panel.append(pairedPathways(data.talkingPoints, data.asl, 'Workflow to discuss'));
    panel.append(textElement('p', data.solution, 'solution'));
    const notes = document.createElement('details');
    notes.append(
      textElement('summary', 'Facilitator notes · workflow detail & validation'),
      textElement('h2', 'Workflow detail'), list(data.workflow),
      textElement('h2', 'Validate together'), list(data.considerations),
    );
    panel.append(notes, textElement('p', `Discuss · ${data.question}`, 'discussion'));
  } else if (slide.type === 'architecture') {
    panel.append(textElement('p', 'From familiar entry points to language support and actionable insights.', 'lead'));
    const flow = document.createElement('ol');
    flow.className = 'architecture-flow';
    architecture.forEach((node) => {
      const item = document.createElement('li');
      item.append(card(node.title, node.detail));
      flow.append(item);
    });
    panel.append(flow, textElement('p', 'Conceptual only. Validate hosting, interfaces, identity, security, data flows, and availability together. No live system connections are made.', 'access-note'));
  } else if (slide.type === 'scenario') {
    panel.append(textElement('p', 'One fictional urgent-care visit. Compare the communication decisions at each handoff.', 'lead'));
    panel.append(pairedPathways(data.spoken, data.asl, 'Spoken language · Spanish'));
    panel.append(textElement('p', 'Pause together · What would help the patient stay understood at this step?', 'discussion'));
  } else {
    panel.append(textElement('p', 'Align on the moments that matter. Validate the workflow. Start with a manageable pilot.', 'lead'));
    panel.append(list([
      'Align on priorities: identify patient access barriers, ASL requirements, and the highest-impact care settings.',
      'Validate the fit: confirm capabilities, integration scope, security, reporting, ownership, and service expectations.',
      'Plan the pilot: select a facility or service line; agree on training, acceptance criteria, escalation, and success measures.',
    ]));
    panel.append(textElement('p', 'Leave with a shared priority, a named owner, and a next conversation.', 'discussion'));
  }

  $('previous').disabled = index === 0;
  $('next').disabled = index === slides.length - 1;
  $('slide-count').textContent = `${index + 1} of ${slides.length} · ${slide.chapter}`;
  $('slide-progress').max = slides.length;
  $('slide-progress').value = index + 1;
  if (focus) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function navigate(nextIndex) {
  if (nextIndex < 0 || nextIndex >= slides.length || nextIndex === index) return;
  location.hash = slides[nextIndex].id;
}

$('previous').addEventListener('click', () => navigate(index - 1));
$('next').addEventListener('click', () => navigate(index + 1));
document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
      event.target.closest('input, textarea, select, button, summary, a, [contenteditable]')) return;
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  navigate(index + (event.key === 'ArrowRight' ? 1 : -1));
});
window.addEventListener('hashchange', () => {
  if (location.hash === '#main') return;
  index = slideIndexForHash(location.hash);
  showSlide(true);
});
showSlide();
