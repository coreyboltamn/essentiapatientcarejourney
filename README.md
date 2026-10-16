# Essentia Health × AMN Healthcare — patient journey

A responsive, presenter-led language-access microsite with seven patient journey stages, parallel spoken-language and ASL pathways, all 11 agenda topics, a conceptual architecture explorer, and a nine-step urgent-care scenario.

## Run locally

Requires Python 3. From the repository root, run `python3 -m http.server 4173` and open **http://localhost:4173**. Alternatively, with Node.js/npm installed, use `npm start`. No dependency installation or build is needed.

The site has no external fonts, images, APIs, analytics, or CDN requests. Once served locally, it works without an internet connection. Serve the files over HTTP rather than opening `index.html` directly, because browsers restrict local JavaScript modules. Static hosting works with the repository root as the publish directory and no build command.

## Present

- Use the section navigation to scroll through the story.
- Select journey stages to update both communication-access lanes together.
- Select any agenda topic for workflow detail, ASL guidance, discovery questions, and expandable validation considerations. Links such as `#agenda-6` open specific topics.
- Explore each architecture connection and step through the urgent-care scenario. The scenario’s ASL toggle keeps the current step for easy comparison.
- Use **Present** for browser fullscreen (where supported); Escape exits. Use browser zoom to suit the display.
- All selectors support Tab/Enter and arrow/Home/End navigation. Reduced-motion preferences are respected.

## Edit content

- `content.js`: agenda copy, journey stages, solution alignment, architecture nodes, and scenario pathways. Journey `agenda` references are zero-based indexes into the agenda array.
- `index.html`: introduction, navigation, next steps, and presentation disclosures.
- `styles.css`: color tokens, responsive layout, and visual treatment.
- `app.js`: presentation interactions. Content is rendered using text nodes, not injected HTML.

No reference images were present in the repository. The journey illustration is an original CSS visual; brand names and color cues are presentation context, not official logo assets. Replace with approved assets when available.

## Validation

With Node.js 18+ installed, run `npm run check` for JavaScript syntax and `npm test` for content-structure checks. Manually verify journey selection, all agenda topics, deep links, disclosure controls, architecture selection, both scenario paths, keyboard navigation, and mobile layouts in a browser.

## Content boundaries

All examples are fictional and no patient data is collected or stored. This is a discussion microsite—not a clinical system, live integration demo, compliance certification, or service commitment. Confirm AMN capabilities, language/specialty coverage, ASL availability, APIs/SDKs/webhooks/HL7/FHIR, hosting, security, commercial terms, timelines, turnaround times, and SLAs before presenting them as commitments. ASL requires effective visual communication; audio-only or written English must not be presented as a substitute.
