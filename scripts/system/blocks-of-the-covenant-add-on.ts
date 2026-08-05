import { inject } from './add-on.container';
import { PlayerManager } from './player-manager';
import { CommandManager } from './command-manager';
import type { StartupEvent } from '@minecraft/server';
import { WorldStorage } from '../shared/storage';
import {
  setLogSettings,
  LOG_SETTINGS_STORAGE_KEY,
} from '../shared/logging/log-settings';

export class BlocksOfTheCovenantAddOn {
  private readonly playerManager = inject(PlayerManager);
  private readonly commandManager = inject(CommandManager);
  private readonly worldStorage = inject(WorldStorage);

  startUp(event: StartupEvent) {
    this.commandManager.onStartUp(event);
  }

  run() {
    const stored = this.worldStorage.get<{
      levels: ('debug' | 'log' | 'warn' | 'error')[];
      logToConsole: boolean;
      logToChat: boolean;
    }>(LOG_SETTINGS_STORAGE_KEY);
    if (stored) {
      setLogSettings(stored);
    }
    this.playerManager.run();
  }
}
