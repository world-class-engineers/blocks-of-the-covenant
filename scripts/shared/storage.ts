import type { Player, World } from '@minecraft/server';
import { inject, injectOptional } from '../system/add-on.container';
import { PLAYER_TOKEN, WORLD_TOKEN } from './global-tokens';
import { Logger } from './logging/logger';

export abstract class StorageBase {
  protected readonly logger = injectOptional(Logger);
  protected abstract readonly storageSource: World | Player;

  get<T>(key: string): T | undefined {
    const value = this.storageSource.getDynamicProperty(key);
    if (value !== undefined && typeof value === 'string') {
      return JSON.parse(value) as T;
    }
    return value as T | undefined;
  }
  set<T>(key: string, value: T | undefined): void {
    const text = JSON.stringify(value);
    this.storageSource.setDynamicProperty(key, text);
    this.logger?.debug(`saved ${key}: ${text.length} characters`);
  }
  keys(): string[] {
    return (this.storageSource as World).getDynamicPropertyIds();
  }
  deleteKey(key: string): void {
    this.storageSource.setDynamicProperty(key);
  }
}

export class WorldStorage extends StorageBase {
  protected readonly storageSource = inject(WORLD_TOKEN);
}

export class PlayerStorage extends StorageBase {
  protected readonly storageSource = inject(PLAYER_TOKEN);
}
