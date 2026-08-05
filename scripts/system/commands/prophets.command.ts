import { inject } from '../add-on.container';
import type {
  CustomCommandOrigin,
  CustomCommandResult,
  Player,
  System,
  World,
} from '@minecraft/server';
import { SYSTEM_TOKEN, WORLD_TOKEN } from '../../shared/global-tokens';
import { GOLD, GRAY, ITALIC } from '../../shared/format-codes';
import {
  addOnCommand,
  CommandHandler,
  commandPermissionLevels,
  commandScopes,
  customCommandParamType,
  customCommandStatuses,
} from '../add-on-command';

const prophetActions = ['add', 'remove', 'clear', 'list'] as const;
type ProphetAction = (typeof prophetActions)[number];

function isProphet(player: Player): boolean {
  return (
    player.commandPermissionLevel >= commandPermissionLevels.GameDirectors &&
    player.commandPermissionLevel < commandPermissionLevels.Admin
  );
}

function isGod(player: Player): boolean {
  return player.commandPermissionLevel >= commandPermissionLevels.Admin;
}

export class ProphetsCommandHandler implements CommandHandler {
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly world = inject(WORLD_TOKEN);

  handleCommand(origin: CustomCommandOrigin, args: any[]): CustomCommandResult {
    const action = String(args[0] ?? '').toLowerCase() as ProphetAction;
    const targets = (args[1] as Player[] | undefined) ?? [];

    if (!prophetActions.includes(action)) {
      return {
        message: `unknown action '${args[0]}'. expected one of: ${prophetActions.join(', ')}`,
        status: customCommandStatuses.Failure,
      };
    }

    if ((action === 'add' || action === 'remove') && targets.length === 0) {
      return {
        message: `action '${action}' requires a target player.`,
        status: customCommandStatuses.Failure,
      };
    }

    let message: string;
    switch (action) {
      case 'add':
        message = this.addProphets(targets);
        break;
      case 'remove':
        message = this.removeProphets(targets);
        break;
      case 'clear':
        message = this.clearProphets();
        break;
      case 'list':
        message = this.listProphets();
        break;
    }

    return { message, status: customCommandStatuses.Success };
  }

  private addProphets(targets: Player[]): string {
    const results: string[] = [];
    for (const target of targets) {
      if (isGod(target)) {
        results.push(`${target.name} is God; cannot be made a prophet`);
        continue;
      }
      if (isProphet(target)) {
        results.push(`${target.name} is already a prophet`);
        continue;
      }
      this.system.run(() => {
        target.commandPermissionLevel = commandPermissionLevels.GameDirectors;
        target.sendMessage(
          `${GOLD}(Blocks of the Covenant) You have been anointed as a prophet!`,
        );
      });
      results.push(`${target.name} anointed as a prophet`);
    }
    return results.join('; ');
  }

  private removeProphets(targets: Player[]): string {
    const results: string[] = [];
    for (const target of targets) {
      if (isGod(target)) {
        results.push(`${target.name} is God; cannot be removed`);
        continue;
      }
      if (!isProphet(target)) {
        results.push(`${target.name} is not a prophet`);
        continue;
      }
      this.system.run(() => {
        target.commandPermissionLevel = commandPermissionLevels.Any;
        target.sendMessage(
          `${GRAY}${ITALIC}(Blocks of the Covenant) You are no longer a prophet.`,
        );
      });
      results.push(`${target.name} removed from the prophets`);
    }
    return results.join('; ');
  }

  private clearProphets(): string {
    const prophets = this.world.getAllPlayers().filter(isProphet);
    for (const prophet of prophets) {
      this.system.run(() => {
        prophet.commandPermissionLevel = commandPermissionLevels.Any;
        prophet.sendMessage(
          `${GRAY}${ITALIC}(Blocks of the Covenant) You are no longer a prophet.`,
        );
      });
    }
    return prophets.length
      ? `removed ${prophets.length} prophet(s): ${prophets.map((p) => p.name).join(', ')}`
      : 'there are no prophets to remove';
  }

  private listProphets(): string {
    const prophets = this.world.getAllPlayers().filter(isProphet);
    return prophets.length
      ? `prophets: ${prophets.map((p) => p.name).join(', ')}`
      : 'there are no prophets in the world';
  }
}

export const prophetsCommand = addOnCommand({
  name: 'prophets',
  description: 'manages the prophets of the covenant',
  permissionLevel: commandPermissionLevels.Admin,
  scope: commandScopes.Admin,
  mandatoryParameters: [
    {
      name: 'action',
      type: customCommandParamType.String,
    },
  ],
  optionalParameters: [
    {
      name: 'target',
      type: customCommandParamType.PlayerSelector,
    },
  ],
  handlerClass: ProphetsCommandHandler,
});
