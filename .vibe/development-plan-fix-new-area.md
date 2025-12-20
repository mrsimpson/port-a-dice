# Development Plan: port-a-dice (fix-new-area branch)

*Generated on 2025-12-20 by Vibe Feature MCP*
*Workflow: [bugfix](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/bugfix)*

## Goal
Fix the "area name cannot be empty" issue preventing new areas from being created. The button is disabled when the input is empty, but users cannot create areas even with valid names.

## Reproduce
### Tasks
- [x] Reviewed commit ab6c307 that attempted to fix the focus method
- [x] Examined ConfigDrawer.vue and BaseInput.vue components
- [x] Verified issue in code - BaseInput missing v-model implementation

### Bug Reproduction Summary
**How to reproduce:**
1. Open the app's config drawer
2. Click on the "Areas" tab
3. Type a text in the "New Area Name" input field
4. The add button remains disabled even though text is entered

**Expected behavior:** Button should be enabled when text is entered

**Actual behavior:** Button remains disabled because `newAreaName` ref is never updated

**Root cause:** BaseInput.vue component doesn't implement proper v-model binding
- Missing `modelValue` prop definition
- Missing `update:modelValue` emit
- v-model binding in ConfigDrawer.vue line 71 is non-functional

### Completed
- [x] Created development plan file
- [x] Reviewed previous fix attempt (ab6c307)
- [x] Examined component code thoroughly
- [x] Confirmed v-model binding issue is the root cause

## Analyze

### Phase Entrance Criteria:
- [x] Bug has been successfully reproduced with clear steps
- [x] Root cause has been identified and understood
- [x] All related code has been examined and analyzed

### Tasks
- [x] Identified root cause: BaseInput missing v-model support

### Root Cause
The `BaseInput.vue` component does not properly implement v-model binding. In Vue 3, a component needs to:
1. Accept a `modelValue` prop
2. Emit `update:modelValue` event when the input changes

**Current implementation:**
- BaseInput uses `v-bind="$attrs"` to pass attributes to the input
- It does NOT have a `modelValue` prop
- It does NOT emit `update:modelValue` events

**Why this breaks area creation:**
- ConfigDrawer.vue uses `v-model="newAreaName"` on BaseInput
- The v-model cannot work because BaseInput doesn't emit updates
- `newAreaName` stays empty because input changes are never sent to the parent
- Button remains disabled because `!newAreaName.trim()` is always true

**Why ab6c307 didn't fix it:**
- It only added the `focus()` method exposure
- It didn't fix the underlying v-model binding issue
- The button disable validation is correct, but the input never updates the reactive variable

### Completed
- [x] Identified the v-model binding issue in BaseInput.vue
- [x] Confirmed missing modelValue prop and update:modelValue emit

## Fix

### Phase Entrance Criteria:
- [x] Root cause has been analyzed and documented
- [x] Solution approach has been determined
- [x] No blocking issues exist

### Tasks
- [x] Add `modelValue` prop to BaseInput.vue
- [x] Add `update:modelValue` emit to BaseInput.vue
- [x] Connect input event to emit updates
- [x] Test the fix manually

### Implementation Details
**Changes made to BaseInput.vue:**
1. Added `modelValue?: string` prop definition
2. Added `update:modelValue` emit definition
3. Bound input element's `:value` to `modelValue` prop
4. Connected input element's `@input` event to emit `update:modelValue`

**Why this fixes the issue:**
- Now when user types in the input, the event handler emits the updated value
- Parent component's `v-model` binding receives the update and updates `newAreaName` ref
- Button disable check `!newAreaName.trim()` now works correctly
- Users can create new areas again

### Completed
- [x] Added modelValue prop and update:modelValue emit to BaseInput
- [x] Fixed v-model binding implementation
- [x] Verified no TypeScript errors

## Verify

### Phase Entrance Criteria:
- [x] Fix has been implemented
- [x] Code changes are complete
- [x] No syntax errors or type issues exist

### Tasks
- [ ] Test area creation with the fixed input
- [ ] Verify button enables/disables correctly
- [ ] Run existing test suite
- [ ] Check for regressions in other components using BaseInput

### Completed
*None yet*

## Finalize

### Phase Entrance Criteria:
- [ ] All tests pass
- [ ] No regressions detected
- [ ] Fix is verified as working

### Tasks
- [ ] Remove any debug code or comments
- [ ] Review code quality
- [ ] Update documentation if needed
- [ ] Prepare for merge

### Completed
*None yet*

## Key Decisions
*Important decisions will be documented here as they are made*

## Notes
*Additional context and observations*

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
