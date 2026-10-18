# Homepage motion implementation plan

> **For agentic workers:** Execute each task with verification before committing.

**Goal:** Give the homepage workflow clear state-change feedback, then verify whether existing route transitions slow navigation.

**Architecture:** Keep the homepage as a server-rendered page. Add state-driven animation only inside its existing `BusinessWorkflow` client component; preserve immediate content and link updates. Audit the shared route wrapper separately.

**Tech stack:** Next.js 16, React 19, existing `framer-motion` 12, CSS.

## Global constraints

- Follow `design.md`: animation serves operation feedback; key information cannot wait for entrance animation.
- Respect `prefers-reduced-motion`; keep keyboard focus and 44px touch targets.
- Do not animate other content surfaces or replace the current animation dependency.
- Verify desktop, 390px, and 320px views.

---

### Task 1: Animate workflow selection

**Files:** `components/business-workflow.tsx`, `app/portfolio.css`

**Outcome:** On selection, the active tab treatment moves smoothly and the detail content fades in over 150–200ms. Text and the case link switch in the same React update. Reduced-motion users receive the final state immediately.

- [x] Add a state-driven shared active treatment inside the selected button. Keep `aria-pressed`, `aria-controls`, and focus behavior intact.
- [x] Animate only the detail presentation, without an exit sequence or delayed mounting. Use stable layout dimensions where practical.
- [x] Add CSS for positioning, stacking, and reduced-motion fallback.
- [x] Run `npm run typecheck`, `npm run lint`, and `npm test`.
- [x] In a browser, test mouse and keyboard switching, immediate link destination, reduced motion, and 390px/320px widths.
- [x] Commit as task 1.

### Task 2: Audit route transitions

**Files:** `components/animations.tsx` only if the audit finds a navigation delay or reduced-motion issue.

**Outcome:** Back/forward and repeated navigation work without a stale page waiting on its exit animation. Reduced-motion navigation has no transition delay.

- [x] Measure current navigation behavior in a browser, including back/forward and repeated clicks.
- [x] If there is a problem, make the smallest change to the shared wrapper and recheck the same paths.
- [x] Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
- [x] Record the finding; commit a code change as task 2 if one is needed.

**Audit result:** No wrapper change needed. In the production build, the new page heading appeared 12ms after the `/about` history update. Back/forward restored the expected headings, and quick successive navigation ended on the last selected route. With and without reduced motion, the route wrapper had no active animation when the new heading entered the DOM. The initial dev-server navigation was slower while compiling `/about`, so the production build was used for the decision. The local Vercel analytics endpoint returned a 404; this does not affect navigation.

### Deferred scope

Existing case-card hover, gallery reveal, and article position feedback remain as they are.
