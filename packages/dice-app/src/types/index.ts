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
}

export const DICE_COLORS: Record<PresetDiceColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  white: '#f3f4f6',
  black: '#1f2937',
};

export const DEFAULT_AREAS: Omit<ParkingArea, 'id'>[] = [{ label: 'picked', order: 0 }];

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
