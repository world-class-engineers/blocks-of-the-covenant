import { inject } from '../add-on.container';
import type { CustomCommandResult, System } from '@minecraft/server';
import { SYSTEM_TOKEN } from '../../shared/global-tokens';
import { MiraclesModal } from '../../ui/miracles.modal';
import {
  addOnCommand,
  CommandHandler,
  commandPermissionLevels,
  commandScopes,
  customCommandStatuses,
} from '../add-on-command';

export class MiraclesCommandHandler implements CommandHandler {
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly miraclesModal = inject(MiraclesModal);

  handleCommand(): CustomCommandResult {
    this.system.run(() => {
      this.miraclesModal.show();
    });

    return { status: customCommandStatuses.Success };
  }
}

export const miraclesCommand = addOnCommand({
  name: 'miracles',
  description: 'opens the Miracles of the Covenant (prophets only)',
  permissionLevel: commandPermissionLevels.GameDirectors,
  scope: commandScopes.Prophet,
  handlerClass: MiraclesCommandHandler,
});
