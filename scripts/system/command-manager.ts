import type { DependencyContainer } from 'tsyringe';
import {
  container,
  runInInjectionContext,
  inject,
  injectAll,
} from './add-on.container';
import {
  ADD_ON_COMMANDS_TOKEN,
  AddOnCommand,
  CommandHandler,
  commandPermissionLevels,
  commandScopeFor,
  commandScopes,
  customCommandStatuses,
} from './add-on-command';
import type {
  CustomCommandOrigin,
  CustomCommandResult,
  Entity,
  Player,
  StartupEvent,
  System,
} from '@minecraft/server';
import { SYSTEM_TOKEN } from '../shared/global-tokens';
import { Disposable } from '../shared/disposable';
import { PlayerManager } from './player-manager';
import { Logger } from '../shared/logging/logger';

export function isPlayer(entity?: Entity): entity is Player {
  return (
    !!entity && 'commandPermissionLevel' in entity && 'inputInfo' in entity
  );
}

export class CommandManager implements Disposable {
  private readonly logger = inject(Logger);
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly playerManager = inject(PlayerManager);
  private readonly commands = injectAll(ADD_ON_COMMANDS_TOKEN);

  onStartUp(event: StartupEvent) {
    this.logger.log('registering commands...', JSON.stringify(this.commands));
    for (let command of this.commands) {
      this.logger.log(`registering command ${command.name}...`);
      event.customCommandRegistry.registerCommand(command, (origin, ...args) =>
        this.onCommand(origin, command, args),
      );
    }
    this.logger.log('all commands registered');
  }

  onCommand(
    origin: CustomCommandOrigin,
    command: AddOnCommand<CommandHandler>,
    args: any[],
  ): CustomCommandResult {
    const scope = commandScopeFor(command);
    const source = origin.sourceEntity;

    let resolvedScope = 'global';
    let scopedContainer: DependencyContainer = container;

    if (scope === commandScopes.Admin || scope === commandScopes.Prophet) {
      const minimum =
        scope === commandScopes.Admin
          ? commandPermissionLevels.Admin
          : commandPermissionLevels.GameDirectors;
      const role =
        scope === commandScopes.Admin ? 'God' : 'a prophet of the covenant';
      if (!isPlayer(source) || source.commandPermissionLevel < minimum) {
        return {
          message: `only ${role} may execute command ${command.name}.`,
          status: customCommandStatuses.Failure,
        };
      }
    }

    if (
      isPlayer(source) &&
      (scope === commandScopes.Player || scope === commandScopes.Prophet)
    ) {
      const playerContainer = this.playerManager.getPlayerContainer(
        source.name,
      );
      if (!playerContainer) {
        return {
          message: `attempted to execute command ${command.name} in player-scope '${source.name}', but no such player is registered.`,
          status: customCommandStatuses.Failure,
        };
      }
      resolvedScope = source.name;
      scopedContainer = playerContainer;
    }

    try {
      const handler = runInInjectionContext(scopedContainer, () =>
        scopedContainer.resolve(command.handlerClass as any),
      ) as CommandHandler;
      return handler.handleCommand(origin, args);
    } catch (err) {
      return {
        message: `Error while executing command ${command.name} in scope '${resolvedScope}': ${err} ${(err as Error).stack}`,
        status: customCommandStatuses.Failure,
      };
    }
  }

  dispose(): void {
    this.system.beforeEvents.startup.unsubscribe(this.onStartUp);
  }
}
