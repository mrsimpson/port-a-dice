# Development Plan: repo (fast-dogs-drive branch)

*Generated on 2026-05-06 by Vibe Feature MCP*
*Workflow: [minor](https://codemcp.github.io/workflows/workflows/minor)*

## Goal
Improve mobile usability of the ScoreSheet (virtual paper) feature in `ScoreSheetDrawer.vue`:
1. **Max-width fit on mobile**: The 800x1200 virtual paper should scale to fill the available width on mobile (currently it scales to fit both width AND height, which leaves it too small on portrait phones).
2. **Pinch-to-zoom**: Users can use two fingers to zoom in/out on the virtual paper.
3. **Two-finger pan**: Users can use two fingers to pan around the canvas when zoomed in.

## Key Decisions

### Architecture
- All changes are contained in `ScoreSheetDrawer.vue` — no new files or dependencies needed.
- `@vueuse/core` is already a project dependency; we can use `useEventListener` if needed, but raw touch events in the component are simpler and avoid extra imports.
- The `vue-drawing-canvas` library handles single-touch drawing. We need to intercept **two-finger** touches for zoom/pan and prevent them from reaching the canvas.
- We will NOT add an external pan/zoom library (e.g. `hammerjs`, `panzoom`) to keep the bundle small and avoid conflicts with the drawing canvas.

### Mobile max-width scaling
- **Current behaviour**: `calculateScale()` uses `Math.min(scaleX, scaleY, 1)` — fits to both width and height, keeping the sheet tiny on portrait phones.
- **New behaviour on mobile (< 768 px wide)**: use only `scaleX` (width-based scaling), allowing the sheet to extend beyond the visible vertical area and require scrolling. The `canvas-container` switches from `overflow: hidden` to `overflow-y: auto` on mobile so the user can scroll the taller sheet.
- On desktop (≥ 768 px) keep the current fit-both behaviour so the sheet stays fully visible in the modal.

### Pinch-to-zoom & two-finger pan
- Added `userZoom` ref (scale multiplier, initial `1`, min `0.5`, max `4`) and `panOffset` ref `{ x: 0, y: 0 }`.
- The `fixed-sheet` transform is: `scale(scaleFactor * userZoom) translate(panOffset.x, panOffset.y)`.
- Touch event handlers on `.canvas-container`:
  - `touchstart` (passive): record initial two-finger distance and midpoint.
  - `touchmove`: if two fingers, compute new distance → update `userZoom`; compute midpoint delta → update `panOffset`. Call `event.preventDefault()` to block scroll and stop drawing canvas from receiving the event.
  - `touchend`/`touchcancel`: reset `touchState.active` when fewer than 2 fingers remain.
- Single-finger touches are not intercepted, so drawing continues to work normally.
- A **Reset zoom** pill button (positioned top-right inside `.canvas-container`) is shown only when `isZoomOrPanActive` is true (computed: `userZoom !== 1 || panOffset !== {0,0}`).

### UX detail
- `touch-action: none` is set on `.canvas-container` to prevent the browser from interpreting pinch as a page zoom gesture.
- `touchstart` uses `.passive` modifier (read-only, no `preventDefault` needed at start).
- `touchmove` does NOT use `.passive` so we can call `e.preventDefault()` to block scroll during two-finger gestures.
- A plain JS `touchState` object (not reactive) is used for gesture tracking state — no need to trigger Vue re-renders for mid-gesture tracking values.
- Pan delta is divided by `effectiveScale` so panning feels 1:1 with finger movement regardless of zoom level.

### Canvas persistence — stroke array approach (final)
- **Root cause of original bug**: `vue-drawing-canvas` treats `:image` as output-only; it never reads it back to restore content.
- **Attempt 1 (broken eraser)**: `:background-image` restored visually but broke the eraser. The eraser uses `destination-out` on a transparent `baseCanvas` overlay; that overlay is then composited over the main canvas which has `backgroundImage` drawn on it. The `destination-out` only cuts holes in the transparent `baseCanvas` — those holes become transparent when composited over the main canvas with `source-over` semantics, revealing the `backgroundImage` beneath. Net result: the background image is always redrawn on every `redraw()`, making erasing invisible.
- **Attempt 2 (restore broken)**: Drawing the saved PNG directly onto the canvas DOM element after mount was wiped on every subsequent `redraw()` call (which calls `setBackground()` → `clear()` → white fill before replaying strokes).
- **Final solution — stroke array persistence**: Switch from storing a flattened PNG to storing the full stroke array (`Stroke[]`):
  - Store updated to hold `strokes: Stroke[]` alongside `canvasData: string | null` (PNG kept for export only)
  - `initialImage` prop on `drawing-canvas` feeds the persisted stroke array on each mount — the library's own `drawInitialImage()` loads them into `this.images` and calls `redraw()`, which faithfully replays all strokes including eraser strokes (type `'eraser'`) with `destination-out` against the white background
  - `onCanvasUpdate` (fires on every `@update:image` emit) saves both the updated stroke array (from `lib.images`) and the new PNG to the store
  - Undo/redo/clear all call `redraw()` internally which emits `@update:image` → `onCanvasUpdate` → auto-persists
  - `hasDrawing` now based on `strokes.length > 0` (accurate) rather than `canvasData !== null`
- **Benefits**: true erase (eraser strokes replayed with `destination-out`), undo removes strokes faithfully, session-to-session persistence via `pinia-plugin-persistedstate` in `localStorage`.

### Build verification
- `vite build` from root `node_modules/.bin/vite` succeeds cleanly (106 modules, no errors).

## Notes
- The project is a Vue 3 + Vite monorepo. The target file is `packages/dice-app/src/components/ScoreSheetDrawer.vue`.
- `DrawerWrapper.vue` wraps content in a flex column. `ScoreSheetDrawer` slots its toolbar + canvas directly via the default slot (`drawer-content` has `overflow-y: auto; padding: 1.5rem`). We may need to override padding on `.drawer-content` for the canvas area (use a named slot or negative margin trick).
- The `canvas-container` previously had `overflow: hidden` — on mobile it now has `overflow-y: auto`; on desktop (≥768px) it keeps `overflow: hidden` via a media query.
- `@vueuse/core` `usePointerSwipe` / `useGesture` are available but unnecessary; plain `touchstart/touchmove/touchend` listeners are sufficient.

## Explore
### Tasks
- [x] Identify the sheet component and file location
- [x] Understand current scaling logic (`calculateScale`)
- [x] Identify how DrawerWrapper lays out content
- [x] Assess available dependencies (vue-drawing-canvas, @vueuse/core)
- [x] Design pinch-to-zoom / two-finger-pan approach
- [x] Decide mobile vs desktop scaling strategy

### Completed
- [x] Created development plan file
- [x] Read `ScoreSheetDrawer.vue`, `DrawerWrapper.vue`, `scoresheet.ts`, `package.json`, `style.css`

## Implement
### Tasks
- [x] Update `calculateScale` to use width-only scaling on mobile (< 768 px)
- [x] Change `.canvas-container` to `overflow-y: auto` on mobile
- [x] Add `userZoom` and `panOffset` reactive state
- [x] Add touch event handlers for pinch-to-zoom and two-finger pan
- [x] Update `.fixed-sheet` `:style` binding to include userZoom and panOffset
- [x] Add `touch-action: none` to `.canvas-container`
- [x] Add "Reset zoom" button (visible only when zoom/pan is active)

### Completed
- [x] All implement tasks completed in `ScoreSheetDrawer.vue`
- [x] Build verified clean with `vite build` (106 modules, 0 errors)
- [x] Fixed canvas persistence: switched to stroke-array persistence (`initialImage` prop + `Stroke[]` in store); eraser, undo/redo, and cross-session restore all work correctly

## Finalize
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
