import { describe, it, expect } from 'vitest';
import {
  createArea,
  updateAreaLabel,
  isAreaNameUnique,
  sortAreasByOrder,
  reorderAreas,
  getNextAreaInCycle,
} from './areas';

describe('areas utils', () => {
  describe('createArea', () => {
    it('should create an area with correct properties', () => {
      const area = createArea('Test Area', 0);
      expect(area.id).toBeDefined();
      expect(area.label).toBe('Test Area');
      expect(area.order).toBe(0);
    });

    it('should create unique IDs for each area', () => {
      const area1 = createArea('Area 1', 0);
      const area2 = createArea('Area 2', 1);
      expect(area1.id).not.toBe(area2.id);
    });
  });

  describe('updateAreaLabel', () => {
    it('should update the area label', () => {
      const area = createArea('Old Label', 0);
      const updated = updateAreaLabel(area, 'New Label');
      expect(updated.label).toBe('New Label');
      expect(updated.id).toBe(area.id);
      expect(updated.order).toBe(area.order);
    });
  });

  describe('isAreaNameUnique', () => {
    it('should return true for unique names', () => {
      const areas = [createArea('Area 1', 0), createArea('Area 2', 1)];
      expect(isAreaNameUnique(areas, 'Area 3')).toBe(true);
    });

    it('should return false for duplicate names', () => {
      const areas = [createArea('Area 1', 0), createArea('Area 2', 1)];
      expect(isAreaNameUnique(areas, 'Area 1')).toBe(false);
    });

    it('should allow same name when excluding the area being edited', () => {
      const areas = [createArea('Area 1', 0), createArea('Area 2', 1)];
      expect(isAreaNameUnique(areas, 'Area 1', areas[0].id)).toBe(true);
    });
  });

  describe('sortAreasByOrder', () => {
    it('should sort areas by order property', () => {
      const areas = [createArea('C', 2), createArea('A', 0), createArea('B', 1)];
      const sorted = sortAreasByOrder(areas);
      expect(sorted[0].label).toBe('A');
      expect(sorted[1].label).toBe('B');
      expect(sorted[2].label).toBe('C');
    });

    it('should not modify the original array', () => {
      const areas = [createArea('C', 2), createArea('A', 0)];
      const sorted = sortAreasByOrder(areas);
      expect(areas[0].label).toBe('C');
      expect(sorted[0].label).toBe('A');
    });
  });

  describe('reorderAreas', () => {
    it('should move area from one position to another', () => {
      const areas = [createArea('A', 0), createArea('B', 1), createArea('C', 2)];
      const reordered = reorderAreas(areas, 0, 2);

      expect(reordered[0].label).toBe('B');
      expect(reordered[1].label).toBe('C');
      expect(reordered[2].label).toBe('A');
    });

    it('should update order properties correctly', () => {
      const areas = [createArea('A', 0), createArea('B', 1), createArea('C', 2)];
      const reordered = reorderAreas(areas, 2, 0);

      expect(reordered[0].order).toBe(0);
      expect(reordered[1].order).toBe(1);
      expect(reordered[2].order).toBe(2);
    });

    it('should handle moving to same position', () => {
      const areas = [createArea('A', 0), createArea('B', 1)];
      const reordered = reorderAreas(areas, 0, 0);

      expect(reordered[0].label).toBe('A');
      expect(reordered[1].label).toBe('B');
    });
  });

  describe('getNextAreaInCycle', () => {
    it('should return first area when current is null', () => {
      const areas = [createArea('A', 0), createArea('B', 1), createArea('C', 2)];
      const sorted = sortAreasByOrder(areas);
      const next = getNextAreaInCycle(null, sorted);
      expect(next).toBe(sorted[0].id);
    });

    it('should return next area in sequence', () => {
      const areas = [createArea('A', 0), createArea('B', 1), createArea('C', 2)];
      const sorted = sortAreasByOrder(areas);
      const next = getNextAreaInCycle(sorted[0].id, sorted);
      expect(next).toBe(sorted[1].id);
    });

    it('should return null when at last area (cycle back)', () => {
      const areas = [createArea('A', 0), createArea('B', 1), createArea('C', 2)];
      const sorted = sortAreasByOrder(areas);
      const next = getNextAreaInCycle(sorted[2].id, sorted);
      expect(next).toBe(null);
    });

    it('should return null when there are no areas', () => {
      const next = getNextAreaInCycle(null, []);
      expect(next).toBe(null);
    });

    it('should return null when current area id is not found', () => {
      const areas = [createArea('A', 0), createArea('B', 1)];
      const sorted = sortAreasByOrder(areas);
      const next = getNextAreaInCycle('non-existent-id', sorted);
      expect(next).toBe(null);
    });
  });
});
