import test from 'node:test';
import assert from 'node:assert/strict';
import { agenda, stages, scenario } from './content.js';
import { slides, slideIndexForHash } from './presentation.js';

test('one linear deck preserves every journey, agenda, and paired scenario', () => {
  assert.equal(slides.length, 30);
  assert.equal(new Set(slides.map((slide) => slide.id)).size, slides.length);
  for (const [type, data] of [['journey', stages], ['agenda', agenda], ['scenario', scenario]]) {
    assert.deepEqual(slides.filter((slide) => slide.type === type).map((slide) => slide.data), data);
  }
  assert.equal(slides[0].id, 'overview');
  assert.equal(slides.at(-1).id, 'next-steps');
  assert.equal(slides[slides.findIndex((slide) => slide.id === 'agenda-2') + 1].id, 'architecture');
  assert.equal(slides[slides.findIndex((slide) => slide.id === 'agenda-9') + 1].id, 'scenario-1');
  assert.equal(slides[slides.findIndex((slide) => slide.id === 'scenario-9') + 1].id, 'agenda-10');
});

test('every slide supports a direct link and legacy section links still work', () => {
  slides.forEach((slide, index) => assert.equal(slideIndexForHash(`#${slide.id}`), index));
  for (const section of ['journey', 'agenda', 'scenario']) {
    assert.equal(slideIndexForHash(`#${section}`), slideIndexForHash(`#${section}-1`));
  }
});

test('empty, unknown, and out-of-range links safely open the introduction', () => {
  for (const hash of ['', '#missing', '#agenda-0', '#agenda-12', '#scenario-10', '#journey-8', '#toString', '#__proto__']) {
    assert.equal(slideIndexForHash(hash), 0);
  }
});
