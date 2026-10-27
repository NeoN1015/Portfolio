# Gerald C. Esplana — Portfolio

A React portfolio for presenting my computer engineering background, skills, projects, and contact information. The visual style uses a dark technical interface with grid backgrounds, software/hardware accents, subtle motion, and responsive layouts.

## About the portfolio

- **Education:** BS Computer Engineering, Colegio de Muntinlupa; expected May 2027.
- **Interests:** Cybersecurity, embedded systems, hardware prototyping, web development, and applied AI research.
- **Experience:** Bioinformatics Engineering Intern at KE TEXH Solutions Inc. (300-hour OJT), working on the BioSentinel ASF platform and SENAITE LIMS workflows.
- **Featured work:** PsycheScan, SmartPOS, ProtectTag, Hand-Gesture Rover, Smart Irrigation System, Contactless Hand Sanitizer, and school websites.

Keep personal details such as a home address out of public project documentation. Verify resume information, dates, project descriptions, and technology claims before publishing changes.

## Technology

- React 19
- React Router
- Vite
- Plain CSS
- ESLint

## Run locally

From the `my-portfolio` directory:

```sh
npm install
npm run dev
```

Other useful commands:

```sh
npm run lint
npm run build
npm run preview
```

## Project structure

```text
src/
  App.jsx                 Routes and shared page layout
  components/             Navigation and shared UI components
  data/projects.js        Default project content and diagram node data
  pages/
    Home.jsx              Landing page and featured projects
    About.jsx             Biography, profile, and interests
    Skills.jsx            Skills grouped by software and hardware
    Projects.jsx          Project cards, diagrams, filters, and editing
    Contact.jsx           Contact details and email form
  *.css                   Page and component styles
public/                   Static assets
```

## Updating content

- **Home page:** Edit the introductory text and featured project list in `src/pages/Home.jsx`.
- **About page:** Update biography, focus areas, timeline, and interests in `src/pages/About.jsx`.
- **Skills page:** Update skill groups and descriptions in `src/pages/Skills.jsx`.
- **Projects page:** Edit the default project records in `src/data/projects.js`. Keep project IDs unique and use valid `YYYY-MM-DD` dates.
- **Contact page:** Update contact links and email in `src/pages/Contact.jsx`.
- **Visual design:** Edit the corresponding page stylesheet in `src/pages/` or component stylesheet in `src/components/`.

### Project diagrams

Project records currently contain a `nodes` array in `src/data/projects.js`. The `Diagram` component in `src/pages/Projects.jsx` renders those nodes as a simple flow, and diagram appearance is styled in `src/pages/Projects.css`.

For a complete architecture diagram using HTML and CSS, the future implementation will need more than the current one-dimensional node list:

1. Decide the components, layers, external services, and data flows for each project.
2. Represent that structure in a data format that supports groups and connections, or create a dedicated React diagram component for the project.
3. Render the components and connectors with semantic HTML and CSS; use responsive layouts so diagrams remain readable on small screens.
4. Add a legend, labels for protocols or data, and accessible text describing the flow.
5. Verify that the diagram describes the actual implementation rather than an assumed design.

## Project page behavior

- Project dates are stored in `src/data/projects.js`; cards show relative dates (for example, “2 months ago”) and refresh while the page is open.
- The Projects page stores project edits, votes, and comments in browser `localStorage`. This is local to a browser and is not a shared database.
- Local project data takes precedence over the defaults in `src/data/projects.js`. If source changes do not appear, use the Projects page **Reset** action to restore the current defaults. Export project data first if you want to preserve local edits.
- The project page has owner editing controls, JSON import/export, filtering, sorting, sharing, and local voting/commenting.
- The contact form prepares a message in the visitor’s email application; it does not send messages through a backend.

## Suggested upgrade roadmap

### Priority 1 — Complete and verify the content

- Confirm project dates, names, descriptions, technologies, and completion status against the resume and project documentation.
- Add the missing implementation details for PsycheScan and ProtectTag, including their software/app portions.
- Review the Hand-Gesture Rover description and replace any inferred hardware or behavior with verified details from its project document.
- Add live demos, source repositories, screenshots, and project-specific images when available.
- Check all contact and social links before publishing.

### Priority 2 — Build full architecture diagrams

- Replace the current linear node flow with project-specific architecture diagrams.
- Show device/sensor, firmware, network, backend/database, app/interface, and user flows where applicable.
- Include meaningful direction and labels on connectors; ensure that branches and feedback paths can be shown.
- Use responsive HTML/CSS and provide an accessible text summary.

### Priority 3 — Improve data persistence

- Replace browser-only `localStorage` editing, voting, and comments with a backend only if shared persistence is needed.
- If adding a backend, define validation, moderation, authorization, and backups before enabling public writes.
- Keep a clear source-of-truth workflow so defaults, exports, and stored project edits do not conflict.

### Priority 4 — Polish and release readiness

- Add focused tests for project validation, filtering/sorting, date display, and diagram behavior.
- Test the UI at mobile, tablet, and desktop widths, and verify keyboard navigation and reduced-motion behavior.
- Check color contrast and ensure motion or glow effects do not obscure content.
- Add deployment instructions and configure the final production URL when a hosting provider is selected.
- Keep dependencies current and run `npm run lint` and `npm run build` before publishing.

## Notes

- Project architecture, dates, and technical claims should be based on the actual project implementation or its documentation.
- Do not expose secrets, private credentials, or personal information that should not be public.
