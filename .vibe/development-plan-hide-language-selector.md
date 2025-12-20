# Development Plan: port-a-dice (hide-language-selector branch)

*Generated on 2025-12-20 by Vibe Feature MCP*
*Workflow: [bugfix](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/bugfix)*

## Goal
Fix the language selector visibility logic. The component should be hidden when the language is auto-detected from the browser, but it's currently always visible.

## Reproduce
### Tasks
- [x] Examined commit 25d6299 which introduced automatic language detection
- [x] Analyzed LanguageSwitcher.vue component and i18n/index.ts
- [x] Identified the bug: Logic is inverted - checking if language is "auto" shows hidden, but isBrowserLanguageDetected returns true when browser language IS detected

### Completed
- [x] Created development plan file
- [x] Reproduced the issue in code analysis
- [x] Root cause identified: The condition `v-if="!isBrowserLanguageAuto"` means the language switcher is hidden when auto-detection occurs, but the variable name and logic are confusing

### Root Cause Found
The issue is a **timing/reactivity problem**, not a logic problem:

1. Component initializes with `isBrowserLanguageAuto = ref(false)`
2. Template condition `v-if="!isBrowserLanguageAuto"` → initially `true` → selector VISIBLE
3. `onMounted` hook runs and updates `isBrowserLanguageAuto`
4. But by then, the selector is already rendered

The core issue: **The reactive state is set in `onMounted`, but the template needs to know the value BEFORE rendering**.

Solution: Use a `computed` property instead of `ref` with `onMounted`. A computed property will:
- Evaluate reactively before rendering
- Always reflect the current state
- No timing/hydration issues
- Properly integrate with Vue's reactivity system

## Analyze
### Tasks
- [x] Identified that `isBrowserLanguageAuto` is a `ref` initialized to `false`
- [x] Found that the value is only updated in `onMounted` hook
- [x] Realized the timing issue: template evaluates `v-if="!false"` before `onMounted` runs
- [x] Confirmed the fix: convert to `computed` property instead of `ref` + `onMounted`

### Completed
- [x] Root cause identified: Timing/reactivity issue with `ref` + `onMounted`
- [x] Determined that `computed` property is the correct solution

## Fix
### Tasks
- [x] Replaced `ref(false)` with `computed(() => isBrowserLanguageDetected())`
- [x] Removed `onMounted` hook that was setting the ref value
- [x] Updated imports to use `computed` instead of `ref` and `onMounted`

### Completed
- [x] Implementation complete - changed LanguageSwitcher.vue to use computed property
- [x] Tests pass (npm test)
- [x] Build succeeds (npm run build)

### Changes Made
**File: packages/dice-app/src/components/LanguageSwitcher.vue**
- Changed: `const isBrowserLanguageAuto = ref(false);` + `onMounted` hook
- To: `const isBrowserLanguageAuto = computed(() => isBrowserLanguageDetected());`
- This ensures the visibility state is reactive and evaluated before rendering, not after mount

## Verify
### Tasks
- [x] Run npm test - all tests pass
- [x] Run npm run build - build successful with no errors
- [x] Verified component still properly hides selector when browser language is detected
- [x] Verified selector shows when user has a saved language preference

### Completed
- [x] Tests passed
- [x] Build successful
- [x] No regressions detected
- [x] Fix verified to work correctly

## Finalize
### Tasks
- [x] Code cleanup: Verified no debug output or console statements
- [x] Reviewed TODO/FIXME comments: None found in modified files
- [x] Removed debugging code blocks: None present
- [x] Updated Key Decisions documentation
- [x] Added Notes section with rationale
- [x] Final test run: All tests pass
- [x] Final build run: Build successful

### Completed
- [x] Code quality review complete - clean minimal changes
- [x] Documentation updated in plan file
- [x] All validation checks passed
- [x] Ready for production

### Code Cleanup Summary
✓ No temporary debug output found
✓ No console.log or debugging statements
✓ No TODO/FIXME comments in changes
✓ No experimental or test code
✓ Clean, focused implementation

## Key Decisions
- **Use `computed` over `ref` + `onMounted`**: A computed property reactively evaluates before rendering, eliminating timing issues that occurred when using `ref` with `onMounted` hook
- **No changes to i18n logic**: The `isBrowserLanguageDetected()` function in i18n/index.ts is working correctly, only the component's use of it needed fixing

## Notes
- The original issue was a **reactivity/timing problem**, not a logic error
- When using `ref` + `onMounted`, the component would render with the initial `false` value, showing the selector before the hook ran
- The `computed` property pattern ensures the template always has access to the current state reactively
- This is a common Vue 3 pattern for derived state that depends on reactive data

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
