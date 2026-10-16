import test from 'node:test';
import assert from 'node:assert/strict';
import { agenda, stages, architecture, scenario } from './content.js';

test('all eleven agenda topics contain workflows and explicit ASL guidance', () => {
  assert.equal(agenda.length, 11);
  assert.equal(new Set(agenda.map((topic) => topic.title)).size, 11);
  for (const topic of agenda) {
    for (const key of ['title', 'short', 'phase', 'summary', 'solution', 'asl', 'question']) {
      assert.ok(topic[key]?.trim(), `${topic.title}: missing ${key}`);
    }
    assert.ok(topic.workflow.length >= 3);
    assert.ok(topic.considerations.length >= 2);
  }
});

test('seven journey stages preserve both pathways and valid agenda alignment', () => {
  assert.equal(stages.length, 7);
  for (const stage of stages) {
    for (const key of ['title', 'label', 'patient', 'action', 'asl', 'solution', 'outcome']) {
      assert.ok(stage[key]?.trim(), `${stage.title}: missing ${key}`);
    }
    assert.ok(Number.isInteger(stage.agenda) && stage.agenda >= 0 && stage.agenda < agenda.length);
  }
  assert.match(stages[6].asl, /not audio-only/i);
});

test('urgent-care walkthrough includes all nine steps in both pathways', () => {
  assert.deepEqual(scenario.map((step) => step.title), [
    'Arrival', 'Registration', 'Triage', 'Clinical encounter', 'Consent',
    'Diagnostics', 'Discharge', 'Follow-up', 'Documentation',
  ]);
  for (const step of scenario) {
    assert.ok(step.spoken?.trim());
    assert.ok(step.asl?.trim());
    assert.notEqual(step.spoken, step.asl);
  }
  assert.match(scenario[6].asl, /not an ASL substitute/i);
});

test('conceptual architecture covers entry, integration, service, and insights', () => {
  assert.equal(architecture.length, 4);
  for (const node of architecture) {
    assert.ok(node.title?.trim());
    assert.ok(node.detail?.trim());
  }
  assert.match(architecture[1].detail, /HL7\/FHIR/);
  assert.match(agenda[5].asl, /Audio-only is not an ASL fallback/);
});
