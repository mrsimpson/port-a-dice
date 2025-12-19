import type { Dice, DiceColor, DiceType } from '@/types';
import { DICE_TYPE_INFO } from '@/types';

export function rollDice(sides: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % sides) + 1;
}

export function rollD4(): number {
  return rollDice(4);
}

export function rollD6(): number {
  return rollDice(6);
}

export function rollD8(): number {
  return rollDice(8);
}

export function rollD10(): number {
  return rollDice(10);
}

export function rollD12(): number {
  return rollDice(12);
}

export function rollD20(): number {
  return rollDice(20);
}

export function createDice(
  color: DiceColor,
  areaId: string | null = null,
  type: DiceType = 'd6'
): Dice {
  const sides = DICE_TYPE_INFO[type].sides;
  return {
    id: crypto.randomUUID(),
    type,
    color,
    value: rollDice(sides),
    areaId,
  };
}

export function rollDiceByType(dice: Dice): Dice {
  const sides = DICE_TYPE_INFO[dice.type].sides;
  return {
    ...dice,
    value: rollDice(sides),
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
