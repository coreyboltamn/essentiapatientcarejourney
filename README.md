# Essentia Health × AMN Healthcare — patient journey

A responsive, facilitator-led language-access presentation for a two-hour call. One active slide and one Previous/Next control pair guide the group through seven patient journey stages, all 11 agenda topics, a conceptual architecture, and a nine-step urgent-care scenario. Spoken-language and ASL pathways appear together, without toggles or branching.

## Run locally

Requires Python 3. From the repository root, run `python3 -m http.server 4173` and open **http://localhost:4173**. Alternatively, with Node.js/npm installed, use `npm start`. No dependency installation or build is needed.

The site has no external fonts, images, APIs, analytics, or CDN requests. Once served locally, it works without an internet connection. Serve the files over HTTP rather than opening `index.html` directly, because browsers restrict local JavaScript modules. Static hosting works with the repository root as the publish directory and no build command.

## Present

- Follow the 30-slide sequence with **Previous / Next** or the left/right arrow keys. There is no autoplay; pause for discussion at the group’s pace.
- Suggested pacing: introduction 10 minutes, patient journey 20, solutions and architecture 50, urgent-care scenario 20, reporting/implementation/next steps 20.
- Both pathways stay visible at every journey and scenario step. Telehealth, translation, and follow-up retain explicit ASL guidance.
- Each agenda slide uses three concise talking points. Optional **Facilitator notes · workflow detail & validation** disclosures retain the full workflows and implementation considerations without crowding the main discussion.
- Direct links such as `#agenda-6`, `#journey-3`, and `#scenario-7` open a specific slide. Existing section links (`#journey`, `#agenda`, `#architecture`, `#scenario`, `#next-steps`) still work. Browser Back/Forward retraces visited slides.
- Tab/Enter operates controls and notes. Slide changes focus the heading; arrow shortcuts do not intercept focused controls. Use browser fullscreen and zoom as needed. Mobile layouts stack the paired pathways; no animation is required.

## Edit content

- `content.js`: agenda copy, journey stages, solution alignment, architecture nodes, and scenario pathways. Journey `agenda` references are zero-based indexes into the agenda array.
- `index.html`: introduction, navigation, next steps, and presentation disclosures.
- `styles.css`: color tokens, responsive layout, and visual treatment.
- `presentation.js`: linear slide order and deep-link resolution.
- `app.js`: single-slide rendering and navigation. Content is rendered using text nodes, not injected HTML.

The visual treatment follows the reference microsite’s soft blue background, blue introduction, white panels, and restrained accents, with fewer controls and larger presentation type. No external assets are required; brand names are presentation context, not official logo assets.

## Validation

With Node.js 18+ installed, run `npm run check` for JavaScript syntax and `npm test` for content completeness, slide ordering, and deep-link checks. Manually verify Previous/Next boundaries, browser history, direct links, optional notes, paired pathways, keyboard navigation, and mobile layouts in a browser.

## Content boundaries

All examples are fictional and no patient data is collected or stored. This is a discussion microsite—not a clinical system, live integration demo, compliance certification, or service commitment. Confirm AMN capabilities, language/specialty coverage, ASL availability, APIs/SDKs/webhooks/HL7/FHIR, hosting, security, commercial terms, timelines, turnaround times, and SLAs before presenting them as commitments. ASL requires effective visual communication; audio-only or written English must not be presented as a substitute.
