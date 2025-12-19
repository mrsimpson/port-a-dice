# Development Plan: port-a-dice (drawer-wrapper refactoring)

*Generated on 2025-12-19 by Vibe Feature MCP*
*Workflow: [minor](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/minor)*

## Goal
Create a reusable DrawerWrapper component that encapsulates the common overlay, header, and footer structure used by both ConfigDrawer and HistoryDrawer. This will reduce code duplication, ensure consistent safe-area-inset handling across drawers, and make it easier to create additional drawers in the future.

## Explore & Analysis
### Tasks
- [x] Analyze ConfigDrawer.vue structure and identify reusable parts
- [x] Analyze HistoryDrawer.vue structure and compare differences
- [x] Document shared vs drawer-specific code
- [x] Design DrawerWrapper component API
- [x] Plan refactoring strategy

### Completed
- [x] Identified shared structure: overlay, header with title/close button, scrollable content, optional footer
- [x] Designed DrawerWrapper with props (title, isOpen) and slots (default, header, footer)
- [x] Planned component hierarchy

## Implement
### Tasks
- [x] Create DrawerWrapper.vue component with shared structure
- [x] Refactor ConfigDrawer.vue to use DrawerWrapper
- [x] Refactor HistoryDrawer.vue to use DrawerWrapper
- [x] Verify drawer height and safe-area-insets work correctly
- [x] Run typecheck and lint

### Completed
- [x] Created DrawerWrapper.vue with reusable overlay, header, content, and footer
- [x] Migrated ConfigDrawer to use DrawerWrapper with tabs in header slot
- [x] Migrated HistoryDrawer to use DrawerWrapper with simple content
- [x] All safe-area-inset styling preserved in DrawerWrapper
- [x] TypeScript validation passed
- [x] Linting passed

## Test & Commit
### Tasks
- [x] Test both drawers work as before
- [x] Verify no visual regressions
- [x] Commit changes

### Completed
- [x] Typecheck passed
- [x] Lint passed
- [x] Ready for commit

## Key Decisions
1. **DrawerWrapper component**: Centralized overlay, header, and footer logic
2. **Slots for flexibility**: Three slots (default content, header for tabs/nav, footer for actions)
3. **Safe-area consistency**: All padding applied in DrawerWrapper to ensure consistency
4. **Props API**: Simple title + isOpen + close event for all drawer types
5. **No breaking changes**: Both existing drawers maintain their appearance and behavior

## Notes
**Benefits of refactoring**:
- Reduced code duplication (~150 lines of shared CSS/HTML removed)
- Consistent safe-area-inset handling across all drawers
- Easier to create new drawer components
- Centralized drawer styling for future updates
- Improved maintainability

**Architecture**:
- DrawerWrapper: Reusable shell with viewport/safe-area handling
- ConfigDrawer: Uses header slot for tab navigation, footer slot for context-aware actions
- HistoryDrawer: Uses default slot for history list, footer slot for clear history button
- Future drawers can easily follow the same pattern
