import type { Dice, DiceColor } from '@/types';

export function rollD6(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 6) + 1;
}

export function createDice(color: DiceColor, areaId: string | null = null): Dice {
  return {
    id: crypto.randomUUID(),
    type: 'd6',
    color,
    value: rollD6(),
    areaId,
  };
}

export function rollDice(dice: Dice): Dice {
  return {
    ...dice,
    value: rollD6(),
  };
}

export function assignDiceToArea(dice: Dice, areaId: string | null): Dice {
  return {
    ...dice,
    areaId,
  };
}

export function generateDiceId(): string {
  return crypto.randomUUID();
}

export function isDiceInArea(dice: Dice, areaId: string): boolean {
  return dice.areaId === areaId;
}

export function getDiceByArea(dice: Dice[], areaId: string): Dice[] {
  return dice.filter((d) => isDiceInArea(d, areaId));
}

export function getUnassignedDice(dice: Dice[]): Dice[] {
  return dice.filter((d) => d.areaId === null);
}
