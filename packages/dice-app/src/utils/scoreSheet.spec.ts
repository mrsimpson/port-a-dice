import { describe, it, expect } from 'vitest';
import {
  createScoreSheetCell,
  createScoreSheet,
  updateCellValue,
  toggleCellLock,
  clearSheet,
  getCellAt,
  calculateTotalScore,
} from './scoreSheet';

describe('scoreSheet utils', () => {
  describe('createScoreSheetCell', () => {
    it('creates a cell with correct row and col', () => {
      const cell = createScoreSheetCell(0, 0);
      expect(cell.row).toBe(0);
      expect(cell.col).toBe(0);
      expect(cell.value).toBeNull();
      expect(cell.locked).toBe(false);
      expect(cell.id).toBeDefined();
    });
  });

  describe('createScoreSheet', () => {
    it('creates a sheet with default 3x6 grid', () => {
      const sheet = createScoreSheet();
      expect(sheet.rows).toBe(3);
      expect(sheet.cols).toBe(6);
      expect(sheet.cells).toHaveLength(18);
    });

    it('creates a sheet with custom dimensions', () => {
      const sheet = createScoreSheet('Custom', 2, 4);
      expect(sheet.name).toBe('Custom');
      expect(sheet.rows).toBe(2);
      expect(sheet.cols).toBe(4);
      expect(sheet.cells).toHaveLength(8);
    });

    it('creates cells with correct row and col positions', () => {
      const sheet = createScoreSheet('Test', 2, 2);
      const cells = sheet.cells;

      expect(cells[0]).toMatchObject({ row: 0, col: 0 });
      expect(cells[1]).toMatchObject({ row: 0, col: 1 });
      expect(cells[2]).toMatchObject({ row: 1, col: 0 });
      expect(cells[3]).toMatchObject({ row: 1, col: 1 });
    });
  });

  describe('updateCellValue', () => {
    it('updates a cell value', () => {
      const sheet = createScoreSheet();
      const cellId = sheet.cells[0].id;

      const updated = updateCellValue(sheet, cellId, 42);

      expect(updated.cells[0].value).toBe(42);
      expect(sheet.cells[0].value).toBeNull(); // Original unchanged
    });

    it('can set cell value to null', () => {
      const sheet = createScoreSheet();
      const cellId = sheet.cells[0].id;
      let updated = updateCellValue(sheet, cellId, 42);
      updated = updateCellValue(updated, cellId, null);

      expect(updated.cells[0].value).toBeNull();
    });
  });

  describe('toggleCellLock', () => {
    it('toggles cell lock state', () => {
      const sheet = createScoreSheet();
      const cellId = sheet.cells[0].id;

      const locked = toggleCellLock(sheet, cellId);
      expect(locked.cells[0].locked).toBe(true);

      const unlocked = toggleCellLock(locked, cellId);
      expect(unlocked.cells[0].locked).toBe(false);
    });
  });

  describe('clearSheet', () => {
    it('clears all cell values and locks', () => {
      const sheet = createScoreSheet();
      let updated = updateCellValue(sheet, sheet.cells[0].id, 42);
      updated = toggleCellLock(updated, sheet.cells[0].id);

      const cleared = clearSheet(updated);

      expect(cleared.cells[0].value).toBeNull();
      expect(cleared.cells[0].locked).toBe(false);
    });
  });

  describe('getCellAt', () => {
    it('finds cell by row and col', () => {
      const sheet = createScoreSheet('Test', 2, 2);
      const cell = getCellAt(sheet, 1, 0);

      expect(cell?.row).toBe(1);
      expect(cell?.col).toBe(0);
    });

    it('returns undefined for invalid position', () => {
      const sheet = createScoreSheet();
      const cell = getCellAt(sheet, 10, 10);

      expect(cell).toBeUndefined();
    });
  });

  describe('calculateTotalScore', () => {
    it('returns sum of all cell values', () => {
      const sheet = createScoreSheet();
      let updated = updateCellValue(sheet, sheet.cells[0].id, 10);
      updated = updateCellValue(updated, sheet.cells[1].id, 20);
      updated = updateCellValue(updated, sheet.cells[2].id, 30);

      expect(calculateTotalScore(updated)).toBe(60);
    });

    it('treats null values as 0', () => {
      const sheet = createScoreSheet();
      let updated = updateCellValue(sheet, sheet.cells[0].id, 10);
      updated = updateCellValue(updated, sheet.cells[1].id, 20);

      expect(calculateTotalScore(updated)).toBe(30);
    });
  });
});
