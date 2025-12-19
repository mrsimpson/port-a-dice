import { describe, it, expect } from 'vitest';
import {
  rollDice,
  rollD4,
  rollD6,
  rollD8,
  rollD10,
  rollD12,
  rollD20,
  createDice,
  rollDiceByType,
  assignDiceToArea,
  isDiceInArea,
  getDiceByArea,
  getUnassignedDice,
} from './dice';

describe('dice utils', () => {
  describe('rollDice', () => {
    it('should return a number within the specified range', () => {
      for (let sides = 4; sides <= 20; sides += 2) {
        for (let i = 0; i < 50; i++) {
          const result = rollDice(sides);
          expect(result).toBeGreaterThanOrEqual(1);
          expect(result).toBeLessThanOrEqual(sides);
          expect(Number.isInteger(result)).toBe(true);
        }
      }
    });
  });

  describe('rollD4', () => {
    it('should return a number between 1 and 4', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD4();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(4);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should produce all values 1-4 over many rolls', () => {
      const results = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        results.add(rollD4());
      }
      expect(results.size).toBe(4);
      for (let i = 1; i <= 4; i++) {
        expect(results.has(i)).toBe(true);
      }
    });
  });

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

  describe('rollD8', () => {
    it('should return a number between 1 and 8', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD8();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(8);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('rollD10', () => {
    it('should return a number between 1 and 10', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD10();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('rollD12', () => {
    it('should return a number between 1 and 12', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD12();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(12);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('rollD20', () => {
    it('should return a number between 1 and 20', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollD20();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(20);
        expect(Number.isInteger(result)).toBe(true);
      }
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

    it('should create dice with specified type', () => {
      const dice = createDice('red', null, 'd20');
      expect(dice.type).toBe('d20');
      expect(dice.value).toBeGreaterThanOrEqual(1);
      expect(dice.value).toBeLessThanOrEqual(20);
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

  describe('rollDiceByType', () => {
    it('should keep the same dice properties except value', () => {
      const originalDice = createDice('green', 'area-1', 'd8');
      const rolledDice = rollDiceByType(originalDice);

      expect(rolledDice.id).toBe(originalDice.id);
      expect(rolledDice.type).toBe(originalDice.type);
      expect(rolledDice.color).toBe(originalDice.color);
      expect(rolledDice.areaId).toBe(originalDice.areaId);
    });

    it('should change the dice value', () => {
      const dice = createDice('yellow');
      let valueChanged = false;

      for (let i = 0; i < 50; i++) {
        const rolled = rollDiceByType(dice);
        if (rolled.value !== dice.value) {
          valueChanged = true;
          break;
        }
      }

      expect(valueChanged).toBe(true);
    });

    it('should respect dice type when rolling', () => {
      const d4 = createDice('red', null, 'd4');
      const d20 = createDice('blue', null, 'd20');

      for (let i = 0; i < 50; i++) {
        const rolled4 = rollDiceByType(d4);
        const rolled20 = rollDiceByType(d20);

        expect(rolled4.value).toBeGreaterThanOrEqual(1);
        expect(rolled4.value).toBeLessThanOrEqual(4);
        expect(rolled20.value).toBeGreaterThanOrEqual(1);
        expect(rolled20.value).toBeLessThanOrEqual(20);
      }
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
