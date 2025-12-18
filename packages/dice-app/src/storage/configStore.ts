import type { GameConfiguration, IConfigStore } from '@/types';

const STORAGE_PREFIX = 'config_';
const CONFIG_INDEX_KEY = 'config_index';

export class LocalStorageConfigStore implements IConfigStore {
  async save(config: GameConfiguration): Promise<void> {
    const key = `${STORAGE_PREFIX}${config.id}`;
    localStorage.setItem(key, JSON.stringify(config));

    // Update index
    const index = this.getIndex();
    if (!index.includes(config.id)) {
      index.push(config.id);
      localStorage.setItem(CONFIG_INDEX_KEY, JSON.stringify(index));
    }
  }

  async load(id: string): Promise<GameConfiguration> {
    const key = `${STORAGE_PREFIX}${id}`;
    const data = localStorage.getItem(key);

    if (!data) {
      throw new Error(`Configuration "${id}" not found`);
    }

    return JSON.parse(data) as GameConfiguration;
  }

  async list(): Promise<GameConfiguration[]> {
    const index = this.getIndex();
    const configs: GameConfiguration[] = [];

    for (const id of index) {
      try {
        const config = await this.load(id);
        configs.push(config);
      } catch {
        // Skip invalid configs
      }
    }

    return configs.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async delete(id: string): Promise<void> {
    const key = `${STORAGE_PREFIX}${id}`;
    localStorage.removeItem(key);

    // Update index
    const index = this.getIndex();
    const newIndex = index.filter((configId) => configId !== id);
    localStorage.setItem(CONFIG_INDEX_KEY, JSON.stringify(newIndex));
  }

  async exists(id: string): Promise<boolean> {
    const key = `${STORAGE_PREFIX}${id}`;
    return localStorage.getItem(key) !== null;
  }

  private getIndex(): string[] {
    const data = localStorage.getItem(CONFIG_INDEX_KEY);
    return data ? (JSON.parse(data) as string[]) : [];
  }
}
