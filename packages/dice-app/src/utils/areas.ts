import type { ParkingArea } from '@/types';

export function createArea(label: string, order: number, color?: string): ParkingArea {
  return {
    id: crypto.randomUUID(),
    label,
    order,
    color,
  };
}

export function updateAreaLabel(area: ParkingArea, label: string): ParkingArea {
  return {
    ...area,
    label,
  };
}

export function updateAreaColor(area: ParkingArea, color: string): ParkingArea {
  return {
    ...area,
    color,
  };
}

export function isAreaNameUnique(areas: ParkingArea[], name: string, excludeId?: string): boolean {
  return !areas.some((area) => area.id !== excludeId && area.label === name);
}

export function sortAreasByOrder(areas: ParkingArea[]): ParkingArea[] {
  return [...areas].sort((a, b) => a.order - b.order);
}

export function reorderAreas(
  areas: ParkingArea[],
  fromIndex: number,
  toIndex: number
): ParkingArea[] {
  const result = [...areas];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  return result.map((area, index) => ({
    ...area,
    order: index,
  }));
}

export function getNextAreaInCycle(
  currentAreaId: string | null,
  areas: ParkingArea[]
): string | null {
  if (areas.length === 0) {
    return null;
  }

  if (currentAreaId === null) {
    return areas[0].id;
  }

  const currentIndex = areas.findIndex((area) => area.id === currentAreaId);

  if (currentIndex === -1) {
    return null;
  }

  if (currentIndex === areas.length - 1) {
    return null;
  }

  return areas[currentIndex + 1].id;
}
