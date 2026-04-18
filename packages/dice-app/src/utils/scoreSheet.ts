import type { ScoreSheet, ScoreSheetCell } from '@/types';

/**
 * Create a new score sheet cell
 */
export function createScoreSheetCell(row: number, col: number): ScoreSheetCell {
  return {
    id: crypto.randomUUID(),
    row,
    col,
    value: null,
    locked: false,
  };
}

/**
 * Initialize a new score sheet with default 6x3 grid
 */
export function createScoreSheet(
  name: string = 'Score Sheet',
  rows: number = 3,
  cols: number = 6
): ScoreSheet {
  const cells: ScoreSheetCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push(createScoreSheetCell(row, col));
    }
  }

  return {
    id: crypto.randomUUID(),
    name,
    rows,
    cols,
    cells,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Update a cell's value in the sheet
 */
export function updateCellValue(
  sheet: ScoreSheet,
  cellId: string,
  value: number | null
): ScoreSheet {
  return {
    ...sheet,
    updatedAt: Date.now(),
    cells: sheet.cells.map((cell) => (cell.id === cellId ? { ...cell, value } : cell)),
  };
}

/**
 * Lock/unlock a cell in the sheet
 */
export function toggleCellLock(sheet: ScoreSheet, cellId: string): ScoreSheet {
  return {
    ...sheet,
    updatedAt: Date.now(),
    cells: sheet.cells.map((cell) =>
      cell.id === cellId ? { ...cell, locked: !cell.locked } : cell
    ),
  };
}

/**
 * Clear all cells in the sheet (reset values but keep structure)
 */
export function clearSheet(sheet: ScoreSheet): ScoreSheet {
  return {
    ...sheet,
    updatedAt: Date.now(),
    cells: sheet.cells.map((cell) => ({
      ...cell,
      value: null,
      locked: false,
    })),
  };
}

/**
 * Get cell by row and column
 */
export function getCellAt(sheet: ScoreSheet, row: number, col: number): ScoreSheetCell | undefined {
  return sheet.cells.find((cell) => cell.row === row && cell.col === col);
}

/**
 * Calculate total score (sum of all non-null values)
 */
export function calculateTotalScore(sheet: ScoreSheet): number {
  return sheet.cells.reduce((sum, cell) => sum + (cell.value ?? 0), 0);
}
