# Development Plan: repo (bright-worlds-post branch)

*Generated on 2026-04-23 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Add a multiplayer scoring feature with per-player scribble sheets (canvas) for the dice app.

## Key Decisions
- **Canvas per player**: Each player gets their own drawing canvas
- **Flexible players**: Dynamic add/remove player sheets
- **No preset layout**: Pure blank canvas for freeform drawing/writing
- **Background image support**: Optional background image on canvas
- **Persistent storage**: Uses existing Pinia persistedstate pattern
- **UI**: Horizontal scrollable player tabs + full canvas area + toolbar
- **Storage optimization**: Store paths as JSON object (faster, smaller) instead of base64 image data

## Notes
*Additional context and observations*

## Explore
### Tasks
- [x] Explore existing Pinia stores pattern (persistence, structure)
- [x] Explore existing drawer/component patterns
- [x] Research canvas library options (raw Canvas API vs fabric.js vs konva)
- [x] Check if existing i18n keys need extending

### Completed
- [x] Created development plan file
- [x] Defined prototype concept with user
- [x] Explored codebase patterns

### Findings

#### Store Pattern
- Uses Pinia with `pinia-plugin-persistedstate`
- Pattern: `defineStore` with state, getters, actions, and `persist` config
- Storage key specified per store (e.g., `key: 'areas-store'`)
- Example from `areas.ts`:
  ```typescript
  export const useAreasStore = defineStore('areas', {
    state: () => ({ areas: [] as ParkingArea[] }),
    persist: { key: 'areas-store', storage: localStorage },
  });
  ```

#### UI Pattern (Drawers)
- Uses `DrawerWrapper` component with Teleport to body
- Pattern: `uiStore` toggles boolean flags (`showHistory`, `showConfig`, etc.)
- Components subscribe to store and render conditionally

#### TypeScript Types
- Centralized in `src/types/index.ts`
- Need to add `PlayerSheet` interface

#### i18n
- English and German translations in `locales/en.json` and `locales/de.json`
- Will need new keys under `sheets` namespace

#### Canvas Technology Decision
- **Recommendation: Raw Canvas API** (no external library)
  - Simpler to integrate
  - Less bundle size
  - Sufficient for drawing/writing use case
  - Can use `canvas.toDataURL()` for serialization
  - Touch and mouse event handling is straightforward

## Plan
### Tasks

#### Task 1: Define TypeScript Types for PlayerSheet
- [x] Add `PlayerSheet` interface to `src/types/index.ts`
- [x] Properties: id, playerName, paths (JSON stroke array), backgroundImage (optional base64), createdAt, updatedAt
- [x] Add `SheetPath` interface for stroke data: { points: {x,y}[], color, lineWidth, tool }
- [x] Add `SheetsState` interface for store state
- [x] Add undoStack (array of paths snapshots) and redoStack for undo/redo

#### Task 2: Create UseSheetsStore Pinia Store
- [x] Create `src/stores/sheets.ts` following areas.ts pattern
- [x] State: sheets array, activeSheetId
- [x] **Undo/Redo**: Add undoStack and redoStack per sheet for path history
- [x] Getters: activeSheet, sheetCount, sortedSheets, canUndo, canRedo
- [x] Actions: addPlayerSheet, removePlayerSheet, setActiveSheet, updateSheetPaths, updateSheetBackground, clearSheet, addPath, undo, redo
- [x] Persistence: key 'sheets-store', localStorage

#### Task 3: Extend UI Store
- [x] Add `showSheets: boolean` to ui.ts state
- [x] Add toggleSheets, openSheets, closeSheets actions

#### Task 4: Create i18n Translations
- [x] Add `sheets` namespace to en.json
- [x] Keys: title, player, addPlayer, removePlayer, noSheets, tools, pen, eraser, clear, background, save, newSheet, **undo, redo**
- [x] Add German translations to de.json

#### Task 5: Create DrawingToolbar Component
- [x] Props: currentColor, currentTool (pen/eraser), lineWidth, canUndo, canRedo
- [x] Emits: update:color, update:tool, update:lineWidth, clear, undo, redo
- [x] Tools: color picker, pen/eraser toggle, line width slider, clear button, **undo button, redo button**

#### Task 6: Create PlayerCanvas Component
- [x] Raw Canvas API implementation
- [x] Props: paths (initial SheetPath[]), backgroundImage
- [x] Emits: update:paths
- [x] Features: mouse/touch drawing, eraser tool, line width control
- [x] Handle resize and high-DPI displays
- [x] Redraw all paths on each frame/requestAnimationFrame

#### Task 7: Create PlayerTab Component
- [x] Props: playerName, isActive
- [x] Emits: select, delete
- [x] Click to select, delete button on hover

#### Task 8: Create SheetsDrawer Component
- [x] Use DrawerWrapper pattern
- [x] Horizontal scrollable player tabs at top
- [x] Full canvas area below tabs
- [x] DrawingToolbar at bottom
- [x] Add new player sheet button
- [x] Integrate PlayerCanvas and DrawingToolbar

#### Task 9: Integrate into App.vue
- [x] Import SheetsDrawer
- [x] Add header button to toggle sheets drawer
- [x] Wire up uiStore.showSheets

#### Task 10: Testing and Refinement
- [x] Build successful (vite build passes)
- [x] TypeScript check passes (vue-tsc --noEmit)
- [x] Test drawing on canvas
- [x] Test persistence across refresh
- [x] Test multiple player sheets
- [x] Test touch and mouse input
- [x] Test undo/redo for drawing actions
- [ ] Handle edge cases (empty canvas, large images)

### Dependencies & Edge Cases
- **Dependencies**: None - using raw Canvas API
- **Undo/Redo**: Implemented via undoStack/redoStack in sheet state
  - Stack limit: ~50 actions to prevent memory issues
  - Clear canvas action also pushes to undo stack
  - Switch to another sheet clears redo stack
- **Storage limit**: LocalStorage has ~5MB limit - solved by storing JSON paths instead of base64
- **Touch handling**: Must prevent page scroll while drawing on canvas
- **Resize handling**: Redraw canvas content on window resize

### Architecture Notes
- No new architecture needed - follows existing patterns
- Sheets persist independently from game config
- Each player has independent canvas state

## Code
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
- [x] Task 1: TypeScript types (PlayerSheet, SheetPath, SheetsState)
- [x] Task 2: Pinia store with undo/redo (sheets.ts)
- [x] Task 3: UI store extension (showSheets state)
- [x] Task 4: i18n translations (en/de)
- [x] Task 5: DrawingToolbar component
- [x] Task 6: PlayerCanvas component
- [x] Task 7: PlayerTab component
- [x] Task 8: SheetsDrawer component
- [x] Task 9: Integration into App.vue
- [x] Task 10: Build & TypeScript check pass
- [x] Edge case handling (undo limit, safe storage, touch handling)

## Commit
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
