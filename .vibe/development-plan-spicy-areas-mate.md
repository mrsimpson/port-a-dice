# Development Plan: repo (spicy-areas-mate branch)

*Generated on 2026-04-18 by Vibe Feature MCP*
*Workflow: [skilled-epcc](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/skilled-epcc)*

## Goal
Add a feature to record scores on a virtual writing sheet. This is a blank canvas for manual score entry where users can draw/write scores freely. Later, game-specific backgrounds (like Kniffel/Yahtzee sheets) can be added as layers behind the writing.

## Key Decisions
- **Manual entry only** - users type/write scores directly, no automatic calculation
- **Graphical writing focused** - this is about a writing surface, not data entry forms
- **Eraser tool** - will be added to correct mistakes
- **Simple blank sheet** - start with plain canvas, game-specific backgrounds later
- **Separate store** - new "scoreSheet" store for managing writing state
- **Canvas-based** - will use HTML5 Canvas for the writing surface

## Notes
*Additional context and observations*
- Project is a **3D Dice Roller** mobile web app built with Vue 3, Three.js, and physics simulation
- Uses **Pinia** for state management with localStorage persistence
- Existing **history system** stores dice roll results with timestamps for rollback
- The **virtual sheet** is different - it's a free-form writing surface for manual score recording
- The app uses **DrawerWrapper** component for side drawers (mobile-first, slides up from bottom)
- State management follows Pinia patterns with persist: { storage: localStorage } for data persistence
- UI state is managed through dedicated UI store with toggle/open/close actions

### Completed
- [x] Created development plan file
- [x] Explored project structure and identified key components
- [x] Clarified feature requirements with user
- [x] Identified existing patterns (Pinia stores, DrawerWrapper, localStorage persistence)
- [x] Defined key decisions and architecture approach (separate store, canvas-based, manual entry)
- [x] Reviewed component patterns (SingleDice, HistoryDrawer, ConfigDrawer) for UI consistency
- [x] Verified no existing canvas/drawing code in project - will implement from scratch
- [x] Completed Explore phase - all exploration tasks done

## Explore
### Tasks
- [x] Understand project structure and architecture
- [x] Review existing stores (dice, history, areas, ui)
- [x] Review existing components (HistoryDrawer, etc.)
- [x] Review internationalization setup
- [x] Clarify requirements - virtual sheet is a blank writing canvas for manual score entry
- [x] Identify existing patterns - Pinia stores, DrawerWrapper, localStorage persistence
- [x] Decide on separate store for score sheet
- [x] Define data structure - canvas drawing state with paths/points

## Plan
### Tasks
- [x] Create score sheet store with drawing state management
- [x] Create ScoreSheet component with canvas-based drawing surface
- [x] Add drawing tools (pen, eraser) to the component
- [x] Integrate with DrawerWrapper for UI presentation
- [x] Add i18n translations for the new feature
- [x] Add store persistence for saving drawings
- [x] Implement clear canvas functionality
- [x] Design drawing state structure (paths array with points)
- [x] Design store actions (addPoint, endPath, clearCanvas, setTool)
- [x] Plan canvas event handling (mousedown, mousemove, mouseup, touch events)
- [x] Plan tool switching (pen vs eraser with different colors)
- [x] Plan canvas resize handling for responsive design
- [x] Plan persistence strategy (save/restore paths to localStorage)

### Completed
- [x] Designed data structure for drawing paths (points with coordinates, color, width, mode)
- [x] Designed store with paths array, currentTool, canvasRef
- [x] Planned component structure with canvas element and tool buttons
- [x] Added i18n entries for score sheet feature
- [x] Completed Plan phase - all planning tasks done

## Code
### Tasks
- [x] Create score sheet store with drawing state management
- [x] Create ScoreSheet component with canvas-based drawing surface
- [x] Add drawing tools (pen, eraser) to the component
- [x] Integrate with DrawerWrapper for UI presentation
- [x] Add i18n translations for the new feature
- [x] Add store persistence for saving drawings
- [x] Implement clear canvas functionality
- [x] Update UI store to add showScoreSheet toggle
- [x] Add ScoreSheet button to App header
- [x] Test drawing functionality
- [x] Verify localStorage persistence
- [x] Run typecheck and lint

### Completed
- [x] Created scoreSheet store with drawing state management
- [x] Created ScoreSheet component with canvas-based drawing surface
- [x] Added drawing tools (pen, eraser, clear canvas)
- [x] Integrated with DrawerWrapper for UI presentation
- [x] Added i18n translations for the new feature (en and de)
- [x] Added store persistence for saving drawings
- [x] Updated UI store to add showScoreSheet toggle
- [x] Added ScoreSheet button to App header
- [x] TypeScript validation passed
- [x] Linting passed

## Commit
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
