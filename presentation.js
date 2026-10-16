import { agenda, stages, scenario } from './content.js';

export const slides = [
  {
    id: 'overview', type: 'overview', chapter: 'Welcome',
    label: 'A 120-minute facilitated conversation',
    title: 'Connected care. Every conversation.',
  },
  ...stages.map((data, index) => ({
    id: `journey-${index + 1}`, type: 'journey', chapter: 'Patient journey',
    label: `Journey ${index + 1} of ${stages.length} · ${data.label}`,
    title: data.title, data,
  })),
  ...agenda.flatMap((data, index) => {
    const topic = {
      id: `agenda-${index + 1}`, type: 'agenda', chapter: 'Solutions & discussion',
      label: `Agenda ${index + 1} of ${agenda.length} · ${data.phase}`,
      title: data.title, data,
    };
    if (index === 1) return [topic, {
      id: 'architecture', type: 'architecture', chapter: 'Connected ecosystem',
      label: 'Conceptual architecture', title: 'Access where care happens.',
    }];
    if (index === 8) return [topic, ...scenario.map((step, stepIndex) => ({
      id: `scenario-${stepIndex + 1}`, type: 'scenario', chapter: 'Journey in practice',
      label: `Urgent care ${stepIndex + 1} of ${scenario.length} · Fictional scenario`,
      title: step.title, data: step,
    }))];
    return [topic];
  }),
  {
    id: 'next-steps', type: 'closing', chapter: 'Next steps',
    label: 'From alignment to adoption', title: 'A practical path forward.',
  },
];

export function slideIndexForHash(hash) {
  const aliases = { journey: 'journey-1', agenda: 'agenda-1', scenario: 'scenario-1' };
  const id = hash.replace(/^#/, '');
  const index = slides.findIndex((slide) => slide.id === (aliases[id] || id));
  return index < 0 ? 0 : index;
}
