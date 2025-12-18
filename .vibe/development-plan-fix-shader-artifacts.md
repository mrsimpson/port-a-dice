# Development Plan: port-a-dice (fix-shader-artifacts branch)

_Generated on 2025-12-18 by Vibe Feature MCP_
_Workflow: [bugfix](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/bugfix)_

## ✅ Status: COMPLETE

**Bug Fixed:** GPU rendering artifacts during dice rolling hover
**Commits:**

- 35391fe: fix: eliminate GPU rendering artifacts during dice rolling hover
- 27728ed: chore: remove debug console.log statements

**Date Completed:** 2025-12-18
**Branch:** fix-shader-artifacts

## Goal

Fix rendering artifacts that appear on screen when hovering over "Roll" and "Roll All" buttons. These artifacts only appear during dice rolling and on button hover, suggesting a GPU rendering/transform issue with 3D CSS transforms.

## Reproduce

### Tasks

- [x] Identified reproduction steps: Hover over "Roll" or "Roll All" buttons while dice are rolling
- [x] Confirmed artifacts only appear during rolling animation + hover state
- [x] Located components involved: DiceControls.vue and SingleDice.vue (3D transforms)
- [ ] Further investigation: Check if issue is related to `transform-style: preserve-3d` and hover transforms

### Completed

- [x] Created development plan file
- [x] Examined DiceControls.vue (button styling with hover transforms)
- [x] Examined SingleDice.vue (3D cube rendering with preserve-3d)
- [x] Confirmed artifacts vanish when screen captured - indicates GPU compositing layer issue, NOT paint issue

## Analyze

### Phase Entrance Criteria:

- [x] Bug is clearly reproducible and understood
- [x] Root cause hypothesis has been documented
- [x] Code paths involved have been examined
- [x] Design issues have been identified

### Tasks

- [x] Analyzed DiceControls.vue - found `transition: all 0.2s` on buttons (line 131)
- [x] Analyzed SingleDice.vue - found `transition: all 0.2s` on dice-wrapper (line 184)
- [x] Initial fix didn't work - artifacts still present
- [x] **NEW DISCOVERY**: CSS uses full 3D cube (perspective, transform-style: preserve-3d, translateZ, multiple faces)
- [x] This is excessive for a simple spinning animation and likely the root cause of GPU artifacts
- [x] **Solution**: Simplify to basic 2D CSS rotation for the spin effect

### Completed

- [x] Identified exact problematic CSS: `transition: all 0.2s;` in both components
- [x] Discovered CSS uses unnecessary 3D transforms (likely legacy from Three.js migration)
- [x] Root cause: Complex 3D CSS is creating GPU layer conflicts during rendering

## Fix

### Phase Entrance Criteria:

- [x] Root cause is fully understood
- [x] Fix approach is designed and documented
- [x] Potential side effects have been considered

### Tasks

- [x] Fixed DiceControls.vue: Changed `.btn` from `transition: all 0.2s` to `transition: background-color 0.2s`
- [x] Fixed DiceControls.vue: Changed `.color-btn` from `transition: all 0.2s` to specific transitions
- [x] **Improved fix**: Changed `.dice-wrapper` from `transition: all 0.2s` to `transition: none`
- [x] Added `will-change: transform` to `.dice-wrapper` for efficient GPU layering
- [x] Kept all 3D cube rendering (perspective, transform-style, translateZ, multiple faces)

### Completed

- [x] Eliminated GPU layer conflicts by:
  1. Removing broad `transition: all` on parent elements
  2. Using specific transitions only on child `.dice` element (which does the 3D animation)
  3. Parent hover transforms now apply instantly without transition conflicts
  4. Added GPU hint with `will-change: transform`

## Verify

### Phase Entrance Criteria:

- [x] Bug fix has been implemented
- [x] Code builds successfully
- [x] Multi-face 3D cube effect is preserved

### Tasks

- [x] Verified Vite build succeeds
- [x] CSS is syntactically valid
- [x] All 3D rendering preserved (perspective, transform-style: preserve-3d, translateZ, show-N classes)
- [x] Transitions optimized to prevent GPU layer conflicts
- [x] **USER TEST**: Artifacts confirmed gone - hover effects work without glitches

### Completed

- [x] Build verification passed
- [x] All changes applied correctly
- [x] 3D cube effect preserved with multi-face rendering
- [x] User verified fix works - artifacts are gone
- [x] Git commit: 35391fe "fix: eliminate GPU rendering artifacts during dice rolling hover"

## Finalize

### Phase Entrance Criteria:

- [x] Bug fix is verified and tested
- [x] All code is committed
- [x] No debug artifacts remain

### Tasks

- [x] **Step 1: Code Cleanup**
  - [x] Removed all console.log debug statements from SingleDice.vue
  - [x] Removed all console.log debug statements from DiceScene.vue
  - [x] No TODO/FIXME comments found
  - [x] No experimental or commented-out code found
- [x] **Step 2: Documentation Review**
  - [x] Updated development plan with complete root cause analysis
  - [x] Documented all CSS changes made
  - [x] Documented technical details of GPU layer fix
  - [x] No design.md to update (using plan file for documentation)
- [x] **Step 3: Final Validation**
  - [x] Build succeeds without errors
  - [x] Vite build passes
  - [x] No syntax errors in CSS or JavaScript
  - [x] User confirmed fix works - artifacts are gone

### Completed

- [x] Commit 35391fe: GPU rendering artifacts fix
- [x] Commit 27728ed: Debug cleanup
- [x] All verification complete - ready for production

## Key Decisions

1. **Root Cause**: GPU compositing layer conflicts caused by competing transitions
   - `.dice-wrapper { transition: all 0.2s; }` + `:hover { transform: scale(1.05); }` created smooth hover animation
   - While simultaneously `.dice { transition: transform 1s ease-out; }` was animating 3D rotations
   - Browser compositor got conflicting layer update instructions → transient rendering artifact

2. **Fix Strategy**: Separate hover effects from 3D animation layers
   - **DiceControls** buttons: Use specific transitions (`background-color` only)
   - **SingleDice parent** (`.dice-wrapper`): Remove transition (`transition: none`) so hover transforms apply instantly
   - **SingleDice child** (`.dice`): Keep `transition: transform 1s ease-out` for the 3D spin animation
   - Add `will-change: transform` to hint browser for efficient GPU management
3. **Why This Works**:
   - Parent hover transform now applies instantly without attempting smooth transition
   - Child 3D animation has its own dedicated transform transition
   - No competing layer update instructions to GPU compositor
   - Eliminates the "vanishing artifact" by preventing compositor from mismanaging layers

4. **Preserve 3D Effect**:
   - Kept all multi-face cube rendering (perspective, transform-style: preserve-3d, translateZ)
   - Kept show-N classes with full 3D rotations for final dice face display
   - Only removed problematic transition timing that caused GPU conflicts

## Summary of Changes

### File: packages/dice-app/src/components/DiceControls.vue

**Change 1**: `.btn` class (line 134)

```css
transition: background-color 0.2s; /* Only animate background, not all properties */
```

**Change 2**: `.color-btn` class (lines 101-104)

```css
transition:
  transform 0.2s,
  box-shadow 0.2s,
  border-color 0.2s; /* Specific properties */
```

### File: packages/dice-app/src/components/SingleDice.vue

**Change 1**: `.dice-wrapper` class (line 184 + added line)

```css
transition: none; /* Remove broad transition */
will-change: transform; /* GPU hint for efficient layering */
```

## Technical Details

**The GPU Artifact Mechanism:**

1. User hovers button → mouse event triggers `:hover` pseudo-class
2. `.dice-wrapper { transition: all 0.2s; }` queues smooth background + transform animation
3. Simultaneously, `.dice.is-rolling { transition: transform 1s ease-out; }` is actively animating
4. GPU compositor receives layer update requests from two competing transform animations
5. Brief moment of layer stacking/ordering confusion → visual glitch appears in composite layer only
6. Glitch vanishes on screenshot/capture because capture forces GPU/CPU synchronization

**Why Specific Transitions Fix It:**

- Only necessary properties transition smoothly
- Parent (`.dice-wrapper`) hover transform now happens **instantly** (no transition)
- Child (`.dice`) 3D animation happens on its own schedule (1s duration)
- No competing instructions for the GPU compositor
- Clear, non-conflicting GPU layer management

## Notes

### Initial Investigation Results:

- **DiceControls.vue**:
  - Line 131: `.btn { transition: all 0.2s; }` ← PROBLEMATIC
  - Buttons don't actually animate any properties except `background-color` and `transform`
- **SingleDice.vue**:
  - Line 184: `.dice-wrapper { transition: all 0.2s; }` ← PROBLEMATIC
  - Line 206: `.dice-wrapper:hover { transform: scale(1.05); }`
  - Line 226: `.dice { transform-style: preserve-3d; }`
  - Line 231: `.dice.is-rolling { transition: transform 1s ease-out; }`

### GPU Layer Issue - ROOT CAUSE:

The combination of:

1. `.btn { transition: all 0.2s; }` - Creates transition for ALL properties
2. `.dice-wrapper { transition: all 0.2s; }` - Creates transition for ALL properties
3. When button is hovered → background changes → triggers `transition: all`
4. Simultaneously, dice are animating with `preserve-3d` and `transform: rotateX/Y/Z`
5. The browser's GPU compositor tries to manage multiple competing transition contexts
6. This causes a **layer stacking/compositing glitch** that vanishes when captured (GPU/CPU sync)

### Solution:

Replace `transition: all` with **specific property transitions**:

- Buttons: only animate `background` (not used for other properties)
- Dice wrapper: only animate `transform`
- This prevents GPU layer conflicts during 3D animations

---

_This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on._
