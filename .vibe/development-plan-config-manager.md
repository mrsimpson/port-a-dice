# Development Plan: port-a-dice (config-manager branch)

_Generated on 2025-12-18 by Vibe Feature MCP_
_Workflow: [epcc](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/epcc)_

## Goal

Enhance configuration storage to include parking areas/places, making it a complete "game configuration" rather than just "dice configuration". Users should be able to save and load their entire game setup including custom parking areas.

## Explore (Enhancement Round 2)

### Tasks

- [x] Review current DiceConfiguration implementation
- [x] Understand parking areas structure and persistence
- [x] Verify parking areas already saved in configurations
- [x] Identify needed updates for naming/messaging

### Completed

- [x] Confirmed parking areas (areas field) already included in DiceConfiguration
- [x] Verified areas already captured during save operation
- [x] Identified UI/naming updates needed
- [x] Plan refinement for complete game configuration concept

## Plan (Enhancement Round 2)

### Phase Entrance Criteria

- [x] Current configuration implementation reviewed
- [x] Parking areas storage verified (already included)
- [x] Naming/messaging needs identified
- [x] Scope of changes understood (minimal - mostly naming)

### Enhancement Scope

The parking areas are **already being saved** in the current implementation! The `DiceConfiguration` already has an `areas: ParkingArea[]` field that captures parking areas when saving.

**Changes needed**:

1. **Rename conceptually**: Change terminology from "dice configuration" to "game configuration"
   - Type name: Keep `DiceConfiguration` (internal) but rename in UI messaging
   - Store name: Can stay `configManager` (internal naming)
   - UI labels: Update to reflect "game configuration" concept
2. **UI/UX Updates**:
   - Update modal title to reflect game configuration
   - Update labels: "Save Game Configuration" instead of "Save Configuration"
   - Update descriptions to emphasize that parking areas are included
   - Update load descriptions to show both dice and areas being restored

3. **Documentation**:
   - Update type documentation comments
   - Update component descriptions
   - Clarify that game configuration includes both dice and areas

### Implementation Tasks

- [ ] Rename `DiceConfiguration` type to `GameConfiguration`
- [ ] Update all references in configManager store
- [ ] Update storage layer references
- [ ] Update DiceConfigModal UI labels and messaging
- [ ] Update form placeholders and descriptions
- [ ] Test save/load functionality
- [ ] Verify no debug output remains

### Completed

_None yet_

### Implementation Strategy

#### Architecture Design (Sync-Ready)

The configuration storage system will be built with a layered architecture to support future cloud synchronization:

1. **Storage Layer Interface** (abstraction for different backends)
   - `IConfigStore` interface defining load/save operations
   - `LocalStorageConfigStore` implementation for browser storage
   - Future: `CloudConfigStore` implementation for cloud sync

2. **Manager Layer** (business logic)
   - `ConfigManager` store handling CRUD operations
   - Independent from storage implementation
   - Handles configuration naming and versioning

3. **Type System**
   - `DiceConfiguration` - represents a saved configuration
   - `ConfigMetadata` - save name, timestamp, version
   - Full dice and area state captured

#### Data Model

```typescript
interface DiceConfiguration {
  id: string; // Unique identifier
  name: string; // User-friendly name
  description?: string; // Optional description
  dice: Dice[]; // Current dice state
  areas: ParkingArea[]; // Current parking areas state
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  syncStatus?: 'local' | 'synced' | 'pending'; // For future sync
}

interface IConfigStore {
  save(config: DiceConfiguration): Promise<void>;
  load(id: string): Promise<DiceConfiguration>;
  list(): Promise<DiceConfiguration[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
```

#### UI Integration Points

1. **DiceConfigModal.vue** (enhanced existing component)
   - Add "Save Configuration" tab
   - Add "Load Configuration" tab with list
   - Add "Delete Configuration" option
   - Move "Reset" button here (renamed to "Delete Current Configuration")
   - Restore complete state (dice + parking areas)

2. **DiceControls.vue**
   - Remove existing reset button (moved to DiceConfigModal)
   - Keep other controls unchanged

3. **Removed from FloatingActions.vue**
   - No new buttons needed - all in modal

#### Implementation Tasks (Code Phase)

1. **Type Definitions**
   - [ ] Add `DiceConfiguration` interface
   - [ ] Add `IConfigStore` interface
   - [ ] Update index.ts with new types

2. **Storage Layer**
   - [ ] Create `storage/configStore.ts` with `IConfigStore` interface
   - [ ] Implement `LocalStorageConfigStore` class
   - [ ] Add storage key management

3. **Manager Store**
   - [ ] Create `stores/configManager.ts` (Pinia store)
   - [ ] Implement save action
   - [ ] Implement load action
   - [ ] Implement list action
   - [ ] Implement delete action

4. **UI Components**
   - [ ] Enhance `DiceConfigModal.vue` with configuration tabs
   - [ ] Add save tab with name input and save button
   - [ ] Add load tab with configuration list and load buttons
   - [ ] Add delete configuration option in load tab
   - [ ] Add "Delete Current Configuration" button (moved from reset)

5. **Refactoring**
   - [ ] Remove reset button from `DiceControls.vue`
   - [ ] Update reset/delete functionality to use configManager

6. **Testing & Validation**
   - [ ] Verify save/load functionality
   - [ ] Test with multiple configurations
   - [ ] Verify localStorage structure
   - [ ] Test delete current configuration
   - [ ] Verify dice and areas both restored

### Tasks

- [x] Architecture design for sync-ready implementation
- [x] Data model defined with future sync support
- [x] Storage layer abstraction planned
- [x] Implementation tasks breakdown completed
- [x] UI integration strategy refined (all in DiceConfigModal)

### Completed

- [x] Detailed implementation strategy documented
- [x] Architecture prepared for future cloud synchronization
- [x] Type definitions and interfaces designed
- [x] Component structure planned
- [x] Reset button relocation planned

## Code

### Phase Entrance Criteria

- [x] Implementation plan is complete and documented
- [x] Architecture for sync-readiness is defined
- [x] Type definitions for configurations are planned
- [x] Storage interface design is approved

### Tasks

- [x] Add `DiceConfiguration` and `IConfigStore` interfaces to types/index.ts
- [x] Create `storage/configStore.ts` with interface and LocalStorage implementation
- [x] Create `stores/configManager.ts` (Pinia store) with CRUD operations
- [x] Enhanced `components/DiceConfigModal.vue` with configuration tabs (Dice, Save, Load)
- [x] Removed reset button from `DiceControls.vue`
- [x] Test build successful
- [x] Removed all console debug output from code

### Completed

- [x] Type definitions added with DiceConfiguration and IConfigStore interfaces
- [x] Storage layer created with LocalStorageConfigStore implementing IConfigStore
- [x] Config manager store created with full CRUD operations (save, load, list, delete)
- [x] DiceConfigModal enhanced with 3 tabs:
  - Dice tab: Color picker, add/remove dice, delete current configuration
  - Save tab: Save form with name and description
  - Load tab: List saved configurations with load/delete actions
- [x] Reset button moved from DiceControls to DiceConfigModal as "Delete Current Configuration"
- [x] DiceControls refactored - removed reset button and associated styles
- [x] All debug console.log statements removed from dice.ts and DiceControls.vue
- [x] Build verification passed - production build works without errors
- [x] Bundle size optimized by removing debug statements

## Commit

### Phase Entrance Criteria

- [x] All planned tasks completed
- [x] Code tested and working
- [x] No console debug output remaining
- [x] Documentation is accurate

### Tasks

- [x] Code Cleanup: Verified no debug console.log statements in modified files
- [x] Code Cleanup: No TODO/FIXME comments found
- [x] Code Cleanup: No commented-out code blocks
- [x] Build Verification: Vite build succeeds
- [x] Test Verification: All 34 existing tests pass
- [x] Git Commit: Feature committed with descriptive message
- [x] Final Validation: Code is production-ready

### Completed

- [x] All development artifacts cleaned up
- [x] Production build tested and verified
- [x] All existing tests pass (no regressions)
- [x] Feature branch committed with full feature implementation
- [x] Ready for merge/deployment

### Git Commit Information

**Commit Hash**: 571f22a
**Branch**: config-manager
**Message**: feat: implement dice configuration storage with save/load/delete

**Changes**:

- 8 files changed
- 1035 insertions
- 148 deletions

**Files Created**:

- `.vibe/development-plan-config-manager.md`
- `packages/dice-app/src/storage/configStore.ts`
- `packages/dice-app/src/stores/configManager.ts`

**Files Modified**:

- `packages/dice-app/src/types/index.ts`
- `packages/dice-app/src/components/DiceConfigModal.vue`
- `packages/dice-app/src/components/DiceControls.vue`
- `packages/dice-app/src/stores/dice.ts`

## Key Decisions

1. **Abstracted Storage Layer**: Implemented `IConfigStore` interface to decouple business logic from storage implementation, enabling future cloud sync without major refactoring

2. **Full State Capture**: Storing complete dice and areas state so users can restore entire session configuration with one action

3. **Metadata Tracking**: Including timestamps and sync status fields to prepare for future cloud synchronization

4. **Local Storage Only (Phase 1)**: Current implementation uses browser localStorage only via `LocalStorageConfigStore`, with interface ready for cloud backend integration

5. **Configuration Naming**: User-friendly names for configurations instead of UUIDs for better UX

6. **UI Consolidation**: All configuration management UI (save, load, delete, reset) integrated into `DiceConfigModal.vue` only - single, cohesive interface

7. **Reset Button Relocation**: Moved reset button from `DiceControls.vue` to `DiceConfigModal.vue` as "Delete Current Configuration" action

## Implementation Summary

### Files Created

- **`src/storage/configStore.ts`**: `LocalStorageConfigStore` implementing `IConfigStore` interface with localStorage persistence
- **`src/stores/configManager.ts`**: Pinia store managing configuration CRUD operations, independent from storage layer

### Files Modified

- **`src/types/index.ts`**: Added `DiceConfiguration` and `IConfigStore` interfaces
- **`src/components/DiceConfigModal.vue`**: Complete rewrite with tabbed interface (Dice, Save, Load tabs)
- **`src/components/DiceControls.vue`**: Removed reset button and associated handlers
- **`src/stores/dice.ts`**: Removed all debug console.log statements

### Architecture

The implementation follows a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  UI Layer: DiceConfigModal (Tabs: Dice, Save, Load)     │
└────────────────────┬────────────────────────────────────┘
                     │ (manages configurations)
┌────────────────────▼────────────────────────────────────┐
│  Manager Layer: ConfigManager Store (CRUD operations)   │
└────────────────────┬────────────────────────────────────┘
                     │ (abstracts storage)
┌────────────────────▼────────────────────────────────────┐
│  Storage Layer: IConfigStore Interface                  │
│  ├─ LocalStorageConfigStore (current)                   │
│  └─ CloudConfigStore (future)                           │
└─────────────────────────────────────────────────────────┘
```

### Features Implemented

1. **Save Configuration**
   - User enters name and optional description
   - Current dice and areas are captured
   - Stored with metadata (timestamps, syncStatus)
   - Displayed with toast notification

2. **Load Configuration**
   - Lists all saved configurations sorted by recency
   - Shows dice count, areas count, and timestamp
   - Click to load - restores entire state
   - Automatic UI transition to Dice tab

3. **Delete Configuration**
   - Delete saved configurations from list
   - Delete current configuration (replaces old reset button)
   - Confirmation dialog for delete operations

4. **Storage**
   - Uses localStorage with key format `config_<id>`
   - Maintains index of all configuration IDs
   - Handles missing/invalid configurations gracefully
   - Error reporting via store error state

## Notes

### Current State Analysis

- Project uses Pinia for state management with localStorage persistence
- Dice and areas stores already persist to localStorage
- Configuration storage integrates seamlessly with existing architecture
- No breaking changes to existing functionality

### Future Sync Considerations

When implementing cloud sync:

1. **Replace Storage Implementation**: Only `LocalStorageConfigStore` would need replacing
2. **Network Layer**: Add async API calls in config manager
3. **Conflict Resolution**: Handle concurrent edits with version management
4. **Offline Support**: Queue changes locally when network unavailable
5. **Auth Integration**: Add user/account association to configurations

### Testing Results

- ✅ All 34 existing unit tests pass
- ✅ Production build succeeds (Vite)
- ✅ No regressions detected
- ✅ Code quality maintained

---

## Enhancement: Game Configuration Renaming

### Code Phase (Round 2)

#### Implementation Summary

Renamed concept from "Dice Configuration" to "Game Configuration" to better reflect that both dice AND parking areas are saved and restored.

**Files Modified**:

- `packages/dice-app/src/types/index.ts`: Renamed `DiceConfiguration` → `GameConfiguration`
- `packages/dice-app/src/storage/configStore.ts`: Updated all type references
- `packages/dice-app/src/stores/configManager.ts`: Updated all type references and error messages
- `packages/dice-app/src/components/DiceConfigModal.vue`: Updated UI labels and descriptions

#### UI/UX Improvements

1. **Modal Title**: "Dice Configuration" → "Game Configuration"
2. **Save Tab**:
   - Label: "Configuration Name" → "Game Name"
   - Placeholder: "Enter configuration name" → "Enter game configuration name"
   - Added info box: "💾 Saves your current dice, parking areas, and all settings."
3. **Save Button**: "Save Configuration" → "Save Game"
4. **Load Tab**: Updated messaging to reflect "games" instead of "configurations"
5. **Reset Button**: "Delete Current Configuration" → "Reset Game"

#### Technical Changes

- All `DiceConfiguration` type references renamed to `GameConfiguration`
- Error messages updated: "configuration" → "game configuration"
- Store state type updated to use `GameConfiguration[]`
- Info box styling added for better visual hierarchy

#### Build Results

- ✅ Build succeeds (108.46 kB JS, 39.67 kB gzip)
- ✅ TypeScript compilation clean
- ✅ No breaking changes
- ✅ Backward compatible with existing saved configurations

---

_This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on._
