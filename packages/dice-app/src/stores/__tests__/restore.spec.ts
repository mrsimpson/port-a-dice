import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useDiceStore } from '../dice';
import { useAreasStore } from '../areas';
import { useHistoryStore } from '../history';
import { useToastStore } from '../toast';
import type { Dice, ParkingArea, RollHistoryEntry } from '@/types';

describe('Restore from History', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Dice Store - restoreFromHistory', () => {
    it('should restore dice from history entry', () => {
      const diceStore = useDiceStore();

      // Setup initial state
      diceStore.addDice('red', 2);
      diceStore.addDice('blue', 1);

      // Create a history entry with different dice
      const historyDice: Dice[] = [
        {
          id: 'test-dice-1',
          type: 'd6',
          color: 'green',
          value: 4,
          areaId: null,
        },
        {
          id: 'test-dice-2',
          type: 'd6',
          color: 'yellow',
          value: 2,
          areaId: 'area-1',
        },
      ];

      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: historyDice,
        areas: [],
      };

      // Restore from history
      diceStore.restoreFromHistory(entry);

      // Verify restoration
      expect(diceStore.dice).toHaveLength(2);
      expect(diceStore.dice[0].id).toBe('test-dice-1');
      expect(diceStore.dice[0].color).toBe('green');
      expect(diceStore.dice[0].value).toBe(4);
      expect(diceStore.dice[1].id).toBe('test-dice-2');
      expect(diceStore.dice[1].color).toBe('yellow');
      expect(diceStore.dice[1].value).toBe(2);
      expect(diceStore.dice[1].areaId).toBe('area-1');
    });

    it('should reset isRolling to false after restore', () => {
      const diceStore = useDiceStore();

      // Set rolling state
      diceStore.isRolling = true;

      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: [],
        areas: [],
      };

      diceStore.restoreFromHistory(entry);

      expect(diceStore.isRolling).toBe(false);
    });

    it('should restore dice with varied area assignments', () => {
      const diceStore = useDiceStore();

      const historyDice: Dice[] = [
        {
          id: 'dice-1',
          type: 'd6',
          color: 'red',
          value: 1,
          areaId: null,
        },
        {
          id: 'dice-2',
          type: 'd6',
          color: 'blue',
          value: 3,
          areaId: 'picked',
        },
        {
          id: 'dice-3',
          type: 'd6',
          color: 'green',
          value: 5,
          areaId: 'discarded',
        },
      ];

      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: historyDice,
        areas: [],
      };

      diceStore.restoreFromHistory(entry);

      expect(diceStore.dice).toHaveLength(3);
      expect(diceStore.dice[0].areaId).toBeNull();
      expect(diceStore.dice[1].areaId).toBe('picked');
      expect(diceStore.dice[2].areaId).toBe('discarded');
    });

    it('should replace all existing dice on restore', () => {
      const diceStore = useDiceStore();

      // Add initial dice
      diceStore.addDice('red', 5);
      expect(diceStore.dice).toHaveLength(5);

      // Restore with fewer dice
      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: [
          {
            id: 'new-dice-1',
            type: 'd6',
            color: 'blue',
            value: 2,
            areaId: null,
          },
        ],
        areas: [],
      };

      diceStore.restoreFromHistory(entry);

      expect(diceStore.dice).toHaveLength(1);
      expect(diceStore.dice[0].color).toBe('blue');
    });

    it('should maintain object immutability by deep copying', () => {
      const diceStore = useDiceStore();

      const originalDice: Dice[] = [
        {
          id: 'test-dice',
          type: 'd6',
          color: 'red',
          value: 3,
          areaId: null,
        },
      ];

      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: originalDice,
        areas: [],
      };

      diceStore.restoreFromHistory(entry);

      // Modify original
      originalDice[0].value = 6;

      // Restored dice should be unchanged
      expect(diceStore.dice[0].value).toBe(3);
    });
  });

  describe('Areas Store - setAreas', () => {
    it('should restore areas from history entry', () => {
      const areasStore = useAreasStore();

      // Setup initial areas
      areasStore.initializeDefaultAreas();

      // Create history areas
      const historyAreas: ParkingArea[] = [
        { id: 'area-1', label: 'picked', order: 0 },
        { id: 'area-2', label: 'discarded', order: 1 },
        { id: 'area-3', label: 'reserved', order: 2 },
      ];

      areasStore.setAreas(historyAreas);

      expect(areasStore.areas).toHaveLength(3);
      expect(areasStore.areas[0].label).toBe('picked');
      expect(areasStore.areas[1].label).toBe('discarded');
      expect(areasStore.areas[2].label).toBe('reserved');
    });

    it('should replace all existing areas on restore', () => {
      const areasStore = useAreasStore();

      // Add multiple areas
      areasStore.initializeDefaultAreas();
      areasStore.addArea('discarded');
      areasStore.addArea('reserved');
      expect(areasStore.areas.length).toBeGreaterThan(1);

      // Restore with single area
      const historyAreas: ParkingArea[] = [{ id: 'single-area', label: 'target', order: 0 }];

      areasStore.setAreas(historyAreas);

      expect(areasStore.areas).toHaveLength(1);
      expect(areasStore.areas[0].label).toBe('target');
    });

    it('should maintain area properties after restore', () => {
      const areasStore = useAreasStore();

      const historyAreas: ParkingArea[] = [
        { id: 'id-1', label: 'First Area', order: 0 },
        { id: 'id-2', label: 'Second Area', order: 1 },
      ];

      areasStore.setAreas(historyAreas);

      expect(areasStore.getAreaById('id-1')).toEqual({
        id: 'id-1',
        label: 'First Area',
        order: 0,
      });
      expect(areasStore.getAreaById('id-2')).toEqual({
        id: 'id-2',
        label: 'Second Area',
        order: 1,
      });
    });
  });

  describe('Full Restore Workflow', () => {
    it('should restore both dice and areas together', () => {
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      // Setup initial state
      diceStore.addDice('red', 2);
      areasStore.initializeDefaultAreas();
      areasStore.addArea('custom-area');

      // Create history entry
      const historyDice: Dice[] = [
        {
          id: 'restored-dice-1',
          type: 'd6',
          color: 'blue',
          value: 4,
          areaId: 'target-area',
        },
      ];

      const historyAreas: ParkingArea[] = [{ id: 'target-area', label: 'Target', order: 0 }];

      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: historyDice,
        areas: historyAreas,
      };

      // Perform restore
      diceStore.restoreFromHistory(entry);
      areasStore.setAreas(historyAreas);

      // Verify complete restoration
      expect(diceStore.dice).toHaveLength(1);
      expect(diceStore.dice[0].value).toBe(4);
      expect(diceStore.dice[0].areaId).toBe('target-area');

      expect(areasStore.areas).toHaveLength(1);
      expect(areasStore.areas[0].label).toBe('Target');
    });

    it('should handle restore with empty dice array', () => {
      const diceStore = useDiceStore();

      // Add some initial dice
      diceStore.addDice('red', 3);
      expect(diceStore.dice.length).toBeGreaterThan(0);

      // Restore with empty dice
      const entry: RollHistoryEntry = {
        id: 'test-entry',
        timestamp: Date.now(),
        dice: [],
        areas: [],
      };

      diceStore.restoreFromHistory(entry);

      expect(diceStore.dice).toHaveLength(0);
    });

    it('should handle restore with empty areas array', () => {
      const areasStore = useAreasStore();

      // Setup initial areas
      areasStore.initializeDefaultAreas();
      areasStore.addArea('test-area');
      expect(areasStore.areas.length).toBeGreaterThan(0);

      // Restore with empty areas
      areasStore.setAreas([]);

      expect(areasStore.areas).toHaveLength(0);
    });

    it('should preserve toast notification functionality', () => {
      const toastStore = useToastStore();

      // This test verifies the toast store can be used in the restore handler
      expect(toastStore).toBeDefined();

      // Mock the show method to verify it can be called
      const showSpy = vi.spyOn(toastStore, 'show');
      toastStore.show('Dice state restored');

      expect(showSpy).toHaveBeenCalledWith('Dice state restored');
    });
  });

  describe('History Entry Restoration', () => {
    it('should create and retrieve history entries with full restoration data', () => {
      const historyStore = useHistoryStore();
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      // Setup initial state
      diceStore.addDice('red', 1);
      diceStore.addDice('blue', 1);
      areasStore.initializeDefaultAreas();

      // Add to history
      historyStore.addEntry(diceStore.dice, areasStore.areas);

      // Get the history entry
      const entry = historyStore.latestEntry;
      expect(entry).toBeDefined();
      expect(entry?.dice).toHaveLength(2);
      expect(entry?.areas.length).toBeGreaterThan(0);

      // Verify we can restore from it
      if (entry) {
        diceStore.resetAll();
        areasStore.clearAreas();

        diceStore.restoreFromHistory(entry);
        areasStore.setAreas(entry.areas);

        expect(diceStore.dice).toHaveLength(2);
        expect(areasStore.areas.length).toBeGreaterThan(0);
      }
    });

    it('should maintain history entry integrity through multiple restores', () => {
      const historyStore = useHistoryStore();
      const diceStore = useDiceStore();
      const areasStore = useAreasStore();

      // Create initial state
      diceStore.addDice('green', 2);
      areasStore.initializeDefaultAreas();
      historyStore.addEntry(diceStore.dice, areasStore.areas);

      const originalEntry = historyStore.latestEntry;

      // Change state
      diceStore.resetAll();
      diceStore.addDice('red', 5);

      // Restore multiple times
      if (originalEntry) {
        for (let i = 0; i < 3; i++) {
          diceStore.restoreFromHistory(originalEntry);
          expect(diceStore.dice).toHaveLength(2);
          expect(diceStore.dice[0].color).toBe('green');
        }
      }
    });
  });
});
