# Development Plan: port-a-dice (dice-configuration branch)

_Generated on 2025-12-18 by Vibe Feature MCP_
_Workflow: [minor](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/minor)_

## Goal

Improve dice configuration UI/UX by reducing space consumption and improving layout efficiency while simplifying the dice list display.

## Explore

### Tasks

- [x] Analyzed current ConfigDrawer component and identified space issues
- [x] Documented all 5 UI problems and root causes
- [x] Designed space-optimized solutions
- [ ] Add entrance criteria for next phases

### Completed

- [x] Created development plan file
- [x] Identified issues:
  1. **Colors consume too much space** - Grid layout with fixed size buttons wastes space
  2. **Custom color in second row** - Takes up separate line with label
  3. **Assignment not important** - Shows area info which clogs the dice list
  4. **Buttons shifting down** - Fixed height color section + varying list height
  5. **Dice list space-consuming** - Shows color indicator, name, value, and area info

## Implement

### Phase Entrance Criteria:

- [x] All UI issues identified and analyzed
- [x] Design solutions documented with clear visual descriptions
- [x] Implementation strategy defined in 4 phases
- [x] Root causes understood (grid layout, separate sections, unnecessary fields)

### Tasks

- [x] Phase 1: Redesign color picker (horizontal layout with inline custom color picker)
- [x] Phase 2: Simplify dice list (remove area info, convert to grid layout)
- [x] Phase 3: Fix layout shifting with proper flex constraints
- [ ] Phase 4: Test responsive behavior and polish
- [ ] Run tests to ensure no regressions

### Completed

- [x] Redesigned color picker: horizontal flex layout, 2rem × 2rem buttons, inline custom color picker
- [x] Replaced dice list row layout with grid: 3-4 columns on desktop, responsive
- [x] Removed area assignment display from config list (reduces clutter)
- [x] Added delete button with hover reveal on grid items
- [x] Updated styles for compact layout (reduced font sizes, padding)

## Finalize

### Tasks

- [ ] _To be added when this phase becomes active_

### Completed

_None yet_

## Key Decisions

1. **Color picker redesign**: Replace grid with horizontal row using smaller buttons (2rem instead of 3rem) to fit all colors + custom picker in one line
2. **Custom color integration**: Move custom color picker inline with preset colors using a compact picker button instead of a separate section
3. **Dice list minimization**: Remove area assignment display from list (not important for config) - show only: color indicator + name/value. Keep area assignment in gameplay, not config
4. **Layout stabilization**: Use flexbox with flex-basis to prevent button shifting when list height changes
5. **Compact dice list**: Use grid or horizontal layout to show more dice with less vertical space

## Implementation Strategy

- **Phase 1**: Redesign color picker (horizontal row with inline custom color picker)
- **Phase 2**: Simplify and grid-ify dice list (remove area info, use grid layout with 3-4 columns)
- **Phase 3**: Fix layout shifting with proper flex constraints
- **Phase 4**: Test responsive behavior and polish

## Design Details

### Color Picker Redesign

**Current (vertical, space-consuming)**:

- Grid layout with multiple rows
- Each color button: 3rem × 3rem
- Custom color in separate section below

**New (horizontal, compact)**:

- Single row with all colors + custom button
- Each color button: 2rem × 2rem (33% smaller)
- Custom color picker as inline button

### Dice List Redesign

**Current (per dice)**:

- Flex row layout showing: Color circle + Label (color name + value) + Area info + Delete button
- Height: ~48px per die, full width
- Takes up significant vertical space

**New (per die - Grid Layout)**:

- Grid layout (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- Shows: Color circle + Label (color name + value) only
- Remove: Area info (not needed for config)
- Delete button positioned on each grid item
- Much more compact: ~40px × 40px per die
- Can show 12+ dice in same space as 4-5 rows

## Notes

- ✅ Color picker redesigned: flex layout with 2rem × 2rem buttons, all colors fit on one row with custom color inline
- ✅ Dice list grid: `grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))` on desktop, 70px on mobile
- ✅ Delete buttons: positioned absolutely on grid items, hidden by default, reveal on hover with opacity transition
- ✅ Removed `dice-area` and `dice-unparked` info - simplifies config view (assignment not needed during setup)
- ✅ Fixed button shifting: removed fixed height on color section, dice count has consistent spacing
- ✅ Space savings: from ~48px per die in rows → ~40px × 40px grid items (40% area reduction)
- Type checking passed without errors
- Build has pre-existing PWA plugin issue (not related to our changes)

---

_This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on._
