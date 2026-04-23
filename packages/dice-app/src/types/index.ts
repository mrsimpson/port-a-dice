export type DiceColor = string;

export type PresetDiceColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'white'
  | 'black';

export interface Dice {
  id: string;
  type: 'd6';
  color: DiceColor;
  value: number;
  areaId: string | null;
}

export interface ParkingArea {
  id: string;
  label: string;
  order: number;
  color?: string;
}

export interface RollHistoryEntry {
  id: string;
  timestamp: number;
  dice: Dice[];
  areas: ParkingArea[];
}

export interface DiceState {
  dice: Dice[];
}

export interface AreasState {
  areas: ParkingArea[];
}

export interface HistoryState {
  entries: RollHistoryEntry[];
  maxEntries: number;
}

export interface UIState {
  isRolling: boolean;
  showHistory: boolean;
  showAreaEditor: boolean;
  showResetConfirm: boolean;
  currentEditingAreaId: string | null;
  showSheets: boolean;
}

export const DICE_COLORS: Record<PresetDiceColor, string> = {
  white: '#f3f4f6',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  black: '#1f2937',
};

export const DEFAULT_AREAS: Omit<ParkingArea, 'id'>[] = [
  { label: 'picked', order: 0, color: '#3b82f6' },
];

export interface GameConfiguration {
  id: string;
  name: string;
  description?: string;
  dice: Dice[];
  areas: ParkingArea[];
  createdAt: number;
  updatedAt: number;
  syncStatus?: 'local' | 'synced' | 'pending';
}

export interface IConfigStore {
  save(config: GameConfiguration): Promise<void>;
  load(id: string): Promise<GameConfiguration>;
  list(): Promise<GameConfiguration[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// ============================================
// Sheets types for multiplayer scribble sheets
// ============================================

export type DrawingTool = 'pen' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

/** Individual stroke path with points and styling */
export interface SheetPath {
  id: string;
  points: Point[];
  color: string;
  lineWidth: number;
  tool: DrawingTool;
}

/** Single player's drawing sheet */
export interface PlayerSheet {
  id: string;
  playerName: string;
  paths: SheetPath[];
  backgroundImage: string | null;
  createdAt: number;
  updatedAt: number;
  /** Undo stack for path history (last ~50 states) */
  undoStack: SheetPath[][];
  /** Redo stack for redo history */
  redoStack: SheetPath[][];
}

/** State for sheets store */
export interface SheetsState {
  sheets: PlayerSheet[];
  activeSheetId: string | null;
}
