# Development Plan: port-a-dice (enhance-load-save branch)

*Generated on 2025-12-20 by Vibe Feature MCP*
*Workflow: [bugfix](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/bugfix)*

## Goal
Improve the load and save of game configurations by:
1. Fixing the save button that doesn't become active
2. Consolidating save and load functionality into a single "Load/Save Configs" tab

## Reproduce
### Tasks
- [x] Identified the issue: `saveName` is a separate ref in ConfigDrawer.vue, but SaveGamePanel.vue has its own `saveName` ref
- [x] Save button condition checks `saveName` in ConfigDrawer which is never updated
- [x] SaveGamePanel properly manages its own form state, but it's not synced with the footer button

### Completed
- [x] Created development plan file
- [x] Investigated code structure and identified root cause
- [x] Analyzed component hierarchy and state management

## Analyze
### Tasks
- [x] Deep dive into state management flow in ConfigDrawer and SaveGamePanel
- [x] Confirmed root cause: Two separate `saveName` refs with no synchronization
- [x] Identified button condition dependency on wrong ref
- [x] Analyzed component structure for merge opportunity

### Completed
- [x] Identified state management issue
- [x] Located all relevant code sections
- [x] Understood data flow from SaveGamePanel to button

## Analysis Details

### Root Cause Analysis
1. **State Synchronization Bug**
   - ConfigDrawer.vue line 141: `const saveName = ref<string>('');` - initialized but never updated
   - SaveGamePanel.vue line 53: `const saveName = ref<string>('');` - properly bound with v-model
   - Button condition (ConfigDrawer line 90): `:disabled="!saveName.trim() || dice.length === 0"`
   - **Issue**: Button checks ConfigDrawer's saveName (always empty) instead of SaveGamePanel's

2. **Why it happens**:
   - Parent component doesn't listen to child component input changes
   - No watchers or computed properties syncing child state to parent
   - savePanel ref exists but isn't used for state inspection

3. **Solution Approach**:
   - Create a computed getter that reads from SaveGamePanel component ref
   - OR use v-model/two-way binding from parent
   - ALSO: Merge Save/Load tabs into single tab with sub-navigation or sections

### Fix Strategy
**Option 1: Use Template Ref (Simpler, Recommended)**
- Access savePanel ref to read saveName directly in computed property
- Maintains current component structure with minimal refactoring

**Option 2: Expose State Through Getter** 
- Modify SaveGamePanel to expose saveName as getter
- Use in parent computed property

**Tab Consolidation**
- Create new ConfigsPanelManager component OR
- Modify ConfigDrawer to show both save and load in single tab
- Add sub-navigation (Send/Receive tabs within Configs tab)

## Fix
### Tasks
- [x] Fix save button state synchronization
  - Created computed property `saveGamePanelName` that reads from SaveGamePanel's exposed ref
  - Updated button disabled state to use `saveGamePanelName` instead of unused local ref
- [x] Consolidate Save and Load into single tab
  - Replaced separate "Save" and "Load" tabs with single "Configs" tab
  - Simplified layout: Show both Load and Save sections together vertically
  - Removed hierarchical sub-tab navigation for cleaner UI
  - Added visual section titles and divider for clarity
- [x] Add i18n translations
  - Added "configs" label to both en.json and de.json

### Implementation Details
**Button State Fix:**
- Created computed property accessing savePanel ref's exposed saveName
- Button condition now checks `saveGamePanelName` value
- Ensures button becomes active when user types a name

**Tab Consolidation (Simplified):**
- Configs tab shows Load section on top, Save section below
- Visual divider separates the two sections
- Section titles (using "load" and "save" translations) identify each section
- No nested navigation - both panels visible at once (user scrolls to access)
- Simpler CSS with container and section styles

### Completed
- [x] Implemented fix for save button state synchronization
- [x] Consolidated save/load functionality into single tab (no hierarchical tabs)
- [x] TypeScript compilation verified (vue-tsc --noEmit passed)
- [x] Git commit successful (6a9543a)

## Verify
### Test Results
✅ **All Tests Passed**
- TypeScript compilation: PASSED (vue-tsc --noEmit)
- Vitest unit tests: 48 passed (3 test files)
  - src/utils/areas.spec.ts: 16 tests ✓
  - src/utils/dice.spec.ts: 18 tests ✓
  - src/stores/__tests__/restore.spec.ts: 14 tests ✓
- No regressions detected
- Git linting: PASSED (prettier, eslint, oxlint)

### Code Quality Verification
- [x] TypeScript strict mode compilation passes
- [x] Vue template type checking passes
- [x] All existing unit tests pass (48 tests)
- [x] No breaking changes to component APIs
- [x] No console errors or warnings introduced
- [x] Code follows project conventions

### Completed
- [x] TypeScript compilation passed
- [x] All unit tests passed (48 tests)
- [x] Code review for regressions completed
- [x] No breaking changes detected
- [x] Linting all passed

## Finalize
### Code Cleanup
- [x] Reviewed for debug output - NONE FOUND (clean implementation)
- [x] Reviewed for TODO/FIXME comments - NONE ADDED (no technical debt introduced)
- [x] Reviewed for temporary/commented code - NONE FOUND (production-ready)
- [x] Fixed ESLint type errors - proper type annotations
- [x] Prettier formatting applied automatically by pre-commit hook
- [x] All linting checks passed

### Documentation Review
- [x] Plan file updated with implementation details
- [x] Code changes are well-documented in comments
- [x] Changes align with existing code patterns and conventions
- [x] i18n translations added properly

### Final Validation
- [x] Unit tests: 48/48 passed (3 test files)
- [x] TypeScript compilation: PASSED (vue-tsc --noEmit)
- [x] Linting: PASSED (prettier, eslint, oxlint)
- [x] Pre-commit hooks: PASSED
- [x] Git commits: SUCCESSFUL (280fd44, 6a9543a)

### Summary of Changes
**Files Modified:**
1. `packages/dice-app/src/components/ConfigDrawer.vue`
   - Fixed save button state synchronization with SaveGamePanel
   - Consolidated Save/Load into single Configs tab (simplified flat layout)
   - Removed hierarchical sub-tab navigation
   - Added visual section titles and divider
   - Simplified CSS: removed sub-tab styles, added container/section styles

2. `packages/dice-app/src/i18n/locales/en.json`
   - Added "configs" translation for main tab

3. `packages/dice-app/src/i18n/locales/de.json`
   - Added "Spiele" (Games) translation for configs tab

**Key Improvements:**
- ✅ Save button now becomes active when user types a name and has dice
- ✅ Save and Load functionality consolidated into single "Configs" tab
- ✅ Simplified UI with both sections visible together (no nested navigation)
- ✅ Clean, flat component structure with visual separation (divider)
- ✅ Maintained backward compatibility - no API changes
- ✅ All existing tests pass (48/48)
- ✅ Code passes all quality gates
- ✅ Ready for production

### Completed
- [x] Code cleanup verification
- [x] Documentation review
- [x] Final validation testing
- [x] Linting and formatting verification
- [x] Git commits completed
- [x] Production-ready status confirmed

## Final Status
### ✅ COMPLETED - Ready for Production

**Commits:**
- 280fd44: Initial implementation with hierarchical sub-tabs
- 6a9543a: Refactored to simplified flat layout (Load + Save on same page)

**Date:** 2025-12-20

### Deliverables
1. ✅ Save button now becomes active when user types a name AND has dice
2. ✅ Save and Load consolidated into single "Configs" tab
3. ✅ Simple flat layout with both sections visible (no hierarchical tabs)
4. ✅ Visual separation with section titles and divider
5. ✅ All 48 unit tests passing
6. ✅ TypeScript compilation successful
7. ✅ Code quality gates passed (ESLint, Prettier, oxlint)
8. ✅ i18n translations added (English and German)
9. ✅ No regressions detected
10. ✅ Production-ready code

## Key Decisions
- **Use Template Ref approach**: Access savePanel.value.saveName in computed property for button state
  - Pros: Minimal changes, no additional props/events needed
  - Cons: Tight coupling between parent and child
- **Simplify tab structure**: Show Save and Load sections together on same tab (no hierarchical sub-tabs)
  - Provides flat, clean UI with related functionality grouped
  - Visual divider and section titles for clarity
  - Users scroll within panel to access both sections

## Notes
**Architecture:**
- ConfigDrawer is the main container managing overall layout
- SaveGamePanel and LoadGamePanel are independent components
- State synchronization handled via template ref and computed property
- i18n translations for section labels

**Testing:**
- All existing 48 unit tests pass
- No breaking changes introduced
- TypeScript strict mode compliance maintained
- Code quality gates (ESLint, Prettier, oxlint) all passed

**Future Improvements:**
- Could add local storage caching for load list
- Could add search/filter for saved games
- Could add sorting options for saved games

---
*Development completed on 2025-12-20*
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
