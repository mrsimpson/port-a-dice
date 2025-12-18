import { describe, it, expect } from 'vitest';
import {
  rollD6,
  createDice,
  rollDice,
  assignDiceToArea,
  isDiceInArea,
  getDiceByArea,
  getUnassignedDice,
} from './dice';

describe('dice utils', () => {
  describe('rollD6', () => {
    it('should return a number between 1 and 6', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD6();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should produce all values 1-6 over many rolls', () => {
      const results = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        results.add(rollD6());
      }
      expect(results.size).toBe(6);
      expect(results.has(1)).toBe(true);
      expect(results.has(2)).toBe(true);
      expect(results.has(3)).toBe(true);
      expect(results.has(4)).toBe(true);
      expect(results.has(5)).toBe(true);
      expect(results.has(6)).toBe(true);
    });
  });

  describe('createDice', () => {
    it('should create a dice with correct properties', () => {
      const dice = createDice('red');
      expect(dice.id).toBeDefined();
      expect(dice.type).toBe('d6');
      expect(dice.color).toBe('red');
      expect(dice.value).toBeGreaterThanOrEqual(1);
      expect(dice.value).toBeLessThanOrEqual(6);
      expect(dice.areaId).toBeNull();
    });

    it('should create dice with area assignment', () => {
      const dice = createDice('blue', 'area-1');
      expect(dice.areaId).toBe('area-1');
    });

    it('should create unique IDs for each dice', () => {
      const dice1 = createDice('red');
      const dice2 = createDice('red');
      expect(dice1.id).not.toBe(dice2.id);
    });

    it('should create dice with custom hex color', () => {
      const customColor = '#ff5733';
      const dice = createDice(customColor);
      expect(dice.color).toBe(customColor);
      expect(dice.id).toBeDefined();
      expect(dice.type).toBe('d6');
    });

    it('should create dice with any valid color string', () => {
      const colors = ['#abc123', '#FFFFFF', 'rgb(255, 0, 0)', 'hsl(120, 100%, 50%)'];
      colors.forEach((color) => {
        const dice = createDice(color);
        expect(dice.color).toBe(color);
      });
    });
  });

  describe('rollDice', () => {
    it('should keep the same dice properties except value', () => {
      const originalDice = createDice('green', 'area-1');
      const rolledDice = rollDice(originalDice);

      expect(rolledDice.id).toBe(originalDice.id);
      expect(rolledDice.type).toBe(originalDice.type);
      expect(rolledDice.color).toBe(originalDice.color);
      expect(rolledDice.areaId).toBe(originalDice.areaId);
    });

    it('should change the dice value', () => {
      const dice = createDice('yellow');
      let valueChanged = false;

      for (let i = 0; i < 50; i++) {
        const rolled = rollDice(dice);
        if (rolled.value !== dice.value) {
          valueChanged = true;
          break;
        }
      }

      expect(valueChanged).toBe(true);
    });
  });

  describe('assignDiceToArea', () => {
    it('should assign dice to an area', () => {
      const dice = createDice('red');
      const assigned = assignDiceToArea(dice, 'area-1');
      expect(assigned.areaId).toBe('area-1');
    });

    it('should unassign dice from area', () => {
      const dice = createDice('red', 'area-1');
      const unassigned = assignDiceToArea(dice, null);
      expect(unassigned.areaId).toBeNull();
    });
  });

  describe('isDiceInArea', () => {
    it('should return true if dice is in the area', () => {
      const dice = createDice('blue', 'area-1');
      expect(isDiceInArea(dice, 'area-1')).toBe(true);
    });

    it('should return false if dice is not in the area', () => {
      const dice = createDice('blue', 'area-1');
      expect(isDiceInArea(dice, 'area-2')).toBe(false);
    });

    it('should return false if dice has no area', () => {
      const dice = createDice('blue');
      expect(isDiceInArea(dice, 'area-1')).toBe(false);
    });
  });

  describe('getDiceByArea', () => {
    it('should return dice in the specified area', () => {
      const dice = [
        createDice('red', 'area-1'),
        createDice('blue', 'area-2'),
        createDice('green', 'area-1'),
        createDice('yellow'),
      ];

      const result = getDiceByArea(dice, 'area-1');
      expect(result).toHaveLength(2);
      expect(result[0].color).toBe('red');
      expect(result[1].color).toBe('green');
    });

    it('should return empty array if no dice in area', () => {
      const dice = [createDice('red', 'area-1')];
      const result = getDiceByArea(dice, 'area-2');
      expect(result).toHaveLength(0);
    });
  });

  describe('getUnassignedDice', () => {
    it('should return only dice without area assignment', () => {
      const dice = [
        createDice('red', 'area-1'),
        createDice('blue'),
        createDice('green'),
        createDice('yellow', 'area-2'),
      ];

      const result = getUnassignedDice(dice);
      expect(result).toHaveLength(2);
      expect(result[0].color).toBe('blue');
      expect(result[1].color).toBe('green');
    });

    it('should return empty array if all dice are assigned', () => {
      const dice = [createDice('red', 'area-1'), createDice('blue', 'area-2')];
      const result = getUnassignedDice(dice);
      expect(result).toHaveLength(0);
    });
  });
});
