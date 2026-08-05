import type { System, World } from '@minecraft/server';
import type { DependencyContainer } from 'tsyringe';
import { container, inject } from './add-on.container';
import {
  PLAYER_SESSION_TOKEN,
  PLAYER_TOKEN,
  SYSTEM_TOKEN,
  WORLD_TOKEN,
} from '../shared/global-tokens';
import { Logger } from '../shared/logging/logger';
import { BLUE, BOLD, GRAY, GREEN, ITALIC, RED } from '../shared/format-codes';

const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21];
const FIBONACCI_SEED_TICKS = 10;
const FIBONACCI_BACKOFF = FIBONACCI_SEQUENCE.map(
  (i) => i * FIBONACCI_SEED_TICKS,
);

export class PlayerManager {
  private readonly players = new Map<string, DependencyContainer>();

  private readonly world = inject(WORLD_TOKEN);
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly logger = inject(Logger);

  run() {
    // Since this could be loaded at any time, not just world load, we need to
    // initialize any players that are already in the world
    this.world
      .getAllPlayers()
      .forEach((player) => this.initializePlayer(player.name));

    // Listen for new players joining the world
    this.world.afterEvents.playerJoin.subscribe((e) =>
      this.initializePlayer(e.playerName),
    );

    // Listen for players leaving the world so we can clean up their containers
    this.world.afterEvents.playerLeave.subscribe((e) =>
      this.removePlayer(e.playerName),
    );
  }

  async initializePlayer(playerName: string, attempt: number = 0) {
    this.logger.log(`Player joined: ${BOLD + BLUE + playerName}`);

    const player = this.world.getPlayers({ name: playerName })[0];
    if (player && attempt === 0) {
      player.sendMessage(
        `${GRAY}${ITALIC}(Blocks of the Covenant) Initializing...`,
      );
    }

    if (!player) {
      if (attempt >= FIBONACCI_BACKOFF.length) {
        this.logger.error(
          `Player ${playerName} not found in the world after ${attempt} attempts. Cannot initialize.`,
        );
        return;
      }

      this.logger.debug(
        `Player ${playerName} not found (attempt ${attempt + 1}/${FIBONACCI_BACKOFF.length}). Retrying in ${FIBONACCI_BACKOFF[attempt]} ticks...`,
      );
      this.system.runTimeout(
        () => this.initializePlayer(playerName, attempt + 1),
        FIBONACCI_BACKOFF[attempt],
      );
      return;
    }
    if (this.players.has(playerName)) {
      this.logger.warn(`Player ${playerName} is already initialized.`);
      return;
    }

    try {
      const playerContainer = container.createChildContainer();
      playerContainer.registerInstance(PLAYER_TOKEN, player);
      playerContainer.registerInstance(PLAYER_SESSION_TOKEN, {
        startTick: this.system.currentTick,
      });
      this.players.set(playerName, playerContainer);

      player.sendMessage(`${GREEN}(Blocks of the Covenant) Ready!`);
      this.logger.log(`Player ${playerName} initialized successfully.`);
    } catch (err) {
      player.sendMessage(
        `${RED}(Blocks of the Covenant) Initialization failed. Some features may not work.`,
      );
      this.logger.error(
        `Error initializing ${playerName}:`,
        err,
        (err as Error).stack,
      );
    }
  }

  removePlayer(playerName: string) {
    if (!this.players.has(playerName)) {
      this.logger.warn(`Player ${playerName} is not initialized.`);
      return;
    }
    const playerContainer = this.players.get(playerName)!;
    playerContainer.dispose();
    this.players.delete(playerName);
    this.logger.log(`Player ${playerName} removed successfully.`);
  }

  getPlayerContainer(playerName: string) {
    return this.players.get(playerName);
  }
}
