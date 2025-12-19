# Development Plan: other-geometries (other-geometries branch)

*Generated on 2025-12-19 by Vibe Feature MCP*
*Workflow: [epcc](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/epcc)*

## Goal
Add support for multiple dice types (d8, d10, d12, d20) in addition to the existing d6 dice. Users should be able to select which type of dice to add and the application should properly render and roll each dice type.

## Explore

### Phase Entrance Criteria:
- [x] Development plan created and goal defined

### Tasks
- [x] Review test files to understand current testing approach
- [x] Document technical considerations for rendering different dice types
- [x] Decide on rendering approach for non-cubic dice
- [x] Decide on UI/UX for dice type selection
- [x] Research common dice types in tabletop gaming

### Completed
- [x] Created development plan file
- [x] Reviewed type definitions in `types/index.ts` - Found that Dice type has hardcoded `type: 'd6'`
- [x] Reviewed dice utilities in `utils/dice.ts` - Found `rollD6()` and related functions only support d6
- [x] Reviewed SingleDice.vue component - Uses 6-faced 3D cube with CSS transforms and dots layout
- [x] Reviewed DiceManagementPanel.vue - UI for adding/removing dice with color selection
- [x] Reviewed dice store - Handles dice state management, rolling logic
- [x] Reviewed `dice.spec.ts` - Comprehensive unit tests using Vitest for dice utilities

## Plan

### Phase Entrance Criteria:
- [x] All dice types and their properties are understood
- [x] 3D rendering approach for each dice type is evaluated
- [x] UI/UX decisions for dice type selection are made
- [x] Technical challenges and solutions are documented

### Tasks
- [x] Design type system changes for supporting multiple dice types
- [x] Plan component architecture for dice type variants
- [x] Design utility functions for rolling different dice types
- [x] Plan UI changes for dice type dropdown selector
- [x] Document testing strategy for new dice types
- [x] Create implementation order and dependencies

### Completed
- [x] Comprehensive implementation strategy documented
- [x] Component architecture designed with isolated dice type components
- [x] Type system updates planned
- [x] Backward compatibility strategy defined
- [x] Testing strategy documented
- [x] Edge cases and considerations identified

### Implementation Strategy

#### 1. Type System Updates
**File: `packages/dice-app/src/types/index.ts`**
- Change `Dice.type` from literal `'d6'` to union type: `'d4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'`
- Create type alias: `export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'`
- Add dice type metadata:
  ```typescript
  export const DICE_TYPE_INFO: Record<DiceType, { sides: number, label: string }> = {
    'd4': { sides: 4, label: 'D4' },
    'd6': { sides: 6, label: 'D6' },
    'd8': { sides: 8, label: 'D8' },
    'd10': { sides: 10, label: 'D10' },
    'd12': { sides: 12, label: 'D12' },
    'd20': { sides: 20, label: 'D20' },
  }
  ```

#### 2. Utility Functions Updates
**File: `packages/dice-app/src/utils/dice.ts`**
- Create generic `rollDice(sides: number): number` function
- Keep `rollD6()` for backward compatibility, make it call `rollDice(6)`
- Add individual roll functions: `rollD4()`, `rollD8()`, `rollD10()`, `rollD12()`, `rollD20()`
- Update `createDice()` to accept `type: DiceType` parameter (default 'd6')
- Update `rollDice(dice: Dice)` to use the dice's type for rolling

#### 3. Component Architecture
**New component structure:**
```
components/
  dice/
    SingleDiceD4.vue   (new)
    SingleDiceD6.vue   (rename from SingleDice.vue)
    SingleDiceD8.vue   (new)
    SingleDiceD10.vue  (new)
    SingleDiceD12.vue  (new)
    SingleDiceD20.vue  (new)
    DiceRenderer.vue   (new - wrapper component that selects the right dice component)
```

**DiceRenderer.vue**: Smart component that:
- Receives a `Dice` prop
- Uses dynamic component to render the correct dice type: `<component :is="diceComponent" :dice="dice" />`
- Maps dice type to component: `d4 -> SingleDiceD4`, `d6 -> SingleDiceD6`, etc.

#### 4. Individual Dice Components
Each `SingleDice[Type].vue` component will:
- Accept same props as current `SingleDice.vue`: `dice: Dice`
- Emit same events: `click`
- Implement 3D rendering (starting simple, can fall back to 2D if needed)
- Handle rolling animations
- Show parking area labels

**Implementation Priority:**
1. **SingleDiceD6.vue**: Rename existing component, ensure it works with new type system
2. **SingleDiceD4.vue**: 4 triangular faces (simplest new shape)
3. **SingleDiceD8.vue**: 8 triangular faces (moderate complexity)
4. **SingleDiceD10.vue**: 10 kite-shaped faces (challenging)
5. **SingleDiceD12.vue**: 12 pentagonal faces (complex)
6. **SingleDiceD20.vue**: 20 triangular faces (most complex)

For complex shapes (d10, d12, d20), we may implement 2D fallback with:
- Colored shape (circle/polygon)
- Large number in center
- Rolling animation (rotation/scale effects)

#### 5. UI Updates for Dice Type Selection
**File: `packages/dice-app/src/components/panels/DiceManagementPanel.vue`**
- Add dropdown/select for dice type next to color picker
- Default selection: 'd6'
- Update `handleAddDice()` to pass selected dice type
- Show dice type in the dice grid display (e.g., "D8 - Red")

**File: `packages/dice-app/src/components/base/BaseSelect.vue`** (new)
- Create reusable select component matching app's design
- Props: `modelValue`, `options`, `label`
- Emit: `update:modelValue`

#### 6. Store Updates
**File: `packages/dice-app/src/stores/dice.ts`**
- Update `addDice()` to accept `type: DiceType` parameter (default 'd6')
- Pass type to `createDice(color, type)`
- No other changes needed (type system handles the rest)

#### 7. Update DiceScene.vue
**File: `packages/dice-app/src/components/DiceScene.vue`**
- Replace `<SingleDice>` with `<DiceRenderer>`
- Import DiceRenderer instead of SingleDice

#### 8. Testing Strategy
**New test files:**
- `utils/dice.spec.ts`: Add tests for all roll functions (rollD4, rollD8, etc.)
- Test that each roll function returns correct range
- Test createDice with different types
- Test rollDice respects dice type

**Component tests (optional, for later):**
- Test DiceRenderer selects correct component
- Test each SingleDice component renders correctly

#### 9. Edge Cases & Considerations
- **Persistence**: Existing saved games with d6 dice should load correctly
- **History**: Roll history entries need to support mixed dice types
- **Migration**: Existing localStorage data has `type: 'd6'` - this will work with new union type
- **Validation**: Ensure dice type is validated when loading from storage
- **D10 numbering**: Decide on 0-9 vs 1-10 (recommend 1-10 for consistency)

#### 10. Backward Compatibility
- Existing d6 dice in localStorage will continue to work
- Existing tests will pass after refactoring
- No breaking changes to public API

## Code

### Phase Entrance Criteria:
- [ ] Implementation plan is complete and approved
- [ ] All design decisions are documented
- [ ] Dependencies and integration points are clear

### Tasks

#### Phase 1: Core Type System & Utilities
- [x] Update type definitions in `types/index.ts`
- [x] Update utility functions in `utils/dice.ts`
- [x] Add/update tests in `utils/dice.spec.ts`
- [x] Verify all existing tests still pass

#### Phase 2: Component Refactoring
- [x] Create `components/dice/` directory
- [x] Rename `SingleDice.vue` to `SingleDiceD6.vue` and move to `dice/` folder
- [x] Create `DiceRenderer.vue` wrapper component
- [x] Update `DiceScene.vue` to use `DiceRenderer`
- [x] Test that d6 dice still work correctly

#### Phase 3: UI for Dice Type Selection
- [x] Create `BaseSelect.vue` component
- [x] Update `DiceManagementPanel.vue` to add dice type dropdown
- [x] Update store `addDice()` to accept type parameter
- [x] Test adding dice of type d6 through UI

#### Phase 4: Implement New Dice Types (Iterative)
**Start with simplest, add one at a time:**
- [x] Implement `SingleDiceD4.vue` (4 faces)
- [x] Test d4 dice creation and rolling
- [x] Implement `SingleDiceD8.vue` (8 faces)
- [x] Test d8 dice creation and rolling
- [x] Implement `SingleDiceD10.vue` (10 faces, circular 2D)
- [x] Test d10 dice creation and rolling
- [x] Implement `SingleDiceD12.vue` (12 faces, circular 2D)
- [x] Test d12 dice creation and rolling
- [x] Implement `SingleDiceD20.vue` (20 faces, circular 2D)
- [x] Test d20 dice creation and rolling

#### Phase 5: Integration & Polish
- [x] Test all dice types together in the scene
- [x] Test parking/unparking with mixed dice types
- [x] Test history with mixed dice types
- [x] Test save/load with mixed dice types
- [x] Verify responsive design works for all dice types
- [x] Manual testing on different screen sizes
- [x] Run linter and fix all issues
- [x] Run typecheck and fix all issues
- [x] Verify all tests pass (57/57 passing)
- [x] Final production build succeeds

#### Phase 6: Enhanced 2D Visuals (COMPLETE)
**Improved visual quality with beautiful 2D designs:**
- [x] Implement beautiful 2D D20 with hexagon shape
- [x] Implement beautiful 2D D12 with octagon shape
- [x] Implement beautiful 2D D10 with elongated octagon
- [x] Implement beautiful 2D D8 with diamond shape
- [x] Implement beautiful 2D D4 with triangle shape
- [x] Keep existing D6 cube 3D implementation
- [x] Add wheel animation (cycling random numbers before landing on result)
- [x] Add dice type labels to 2D dice
- [x] Implement high contrast for numbers (black on light, white on dark)
- [x] Implement high contrast for D6 dots
- [x] Create compact inline layout (colors, select, button)
- [x] Style select with 3-char width (D4, D6, etc.)
- [x] Test all implementations

### Completed
- [x] All phases 1-6 complete
- [x] All 6 dice types implemented with distinctive shapes
- [x] Beautiful 2D presentation with wheel animations
- [x] High contrast text and dots
- [x] Compact, beautiful UI layout
- [x] 57/57 tests passing
- [x] Production build successful

## Commit

### Phase Entrance Criteria:
- [ ] All code is implemented and working
- [ ] Tests are passing
- [ ] No debug code or TODOs remain

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Key Decisions

**UI/UX Decisions:**
- ✅ Dice type selector: Dropdown next to color picker
- ✅ Default dice type: d6
- ✅ Supported dice types: d4, d6, d8, d10, d12, d20 (standard polyhedral set)

**Architecture Decisions:**
- ✅ Create separate component for each dice type (SingleDice[Type].vue)
- ✅ Attempt 3D CSS rendering for each dice type (matching current d6 approach)
- ✅ Design allows fallback to 2D if 3D becomes too complex for certain shapes
- ✅ Keep blast radius small with isolated components

**Key Architecture Findings:**
- The app currently only supports d6 dice (6-sided)
- Dice type is hardcoded as `type: 'd6'` in the Dice interface
- SingleDice.vue uses CSS 3D transforms to create a physical 6-faced cube
- Each face is positioned using rotateX/rotateY with dots arranged in grid patterns
- Roll results determine which face is shown via CSS classes (show-1 through show-6)

**Technical Considerations:**
- d4 (tetrahedron): 4 triangular faces - 3D CSS feasible with 4 faces
- d6 (cube): 6 square faces - ✅ already implemented
- d8 (octahedron): 8 triangular faces - 3D CSS feasible but complex
- d10 (pentagonal trapezohedron): 10 kite-shaped faces - 3D CSS challenging
- d12 (dodecahedron): 12 pentagonal faces - 3D CSS very complex
- d20 (icosahedron): 20 triangular faces - 3D CSS extremely complex

**Dice Type Information:**
- **d4**: Pyramid/tetrahedron, 4 sides
- **d6**: Cube, 6 sides (current implementation)
- **d8**: Octahedron (two pyramids base-to-base), 8 sides
- **d10**: Pentagonal trapezohedron, 10 sides (numbered 0-9 or 1-10)
- **d12**: Dodecahedron, 12 pentagonal faces
- **d20**: Icosahedron, 20 triangular faces (most popular for D&D)

## Notes
- Current codebase is well-structured with clear separation of concerns
- Type system is comprehensive and uses TypeScript effectively
- Store pattern with Pinia for state management
- Component design follows Vue 3 Composition API
- Testing uses Vitest with good coverage of utility functions

**3D Rendering Approach Strategy:**
We'll try 3D CSS for each dice type, starting with simpler shapes:
1. **Phase 1**: d4 (4 faces, simpler) and d8 (8 faces, moderate)
2. **Phase 2**: d10 (10 faces, challenging geometry)
3. **Phase 3**: d12 and d20 (very complex, may need 2D fallback)

This iterative approach lets us learn what works and pivot if needed.

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
