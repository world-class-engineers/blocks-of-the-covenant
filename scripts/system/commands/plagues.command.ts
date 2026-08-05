import { inject } from '../add-on.container';
import type { CustomCommandResult, System } from '@minecraft/server';
import { SYSTEM_TOKEN } from '../../shared/global-tokens';
import { PlaguesModal } from '../../ui/plagues.modal';
import {
  addOnCommand,
  CommandHandler,
  commandPermissionLevels,
  commandScopes,
  customCommandStatuses,
} from '../add-on-command';

export class PlaguesCommandHandler implements CommandHandler {
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly plaguesModal = inject(PlaguesModal);

  handleCommand(): CustomCommandResult {
    this.system.run(() => {
      this.plaguesModal.show();
    });

    return { status: customCommandStatuses.Success };
  }
}

export const plaguesCommand = addOnCommand({
  name: 'plagues',
  description: 'opens the Plagues of Egypt (prophets only)',
  permissionLevel: commandPermissionLevels.GameDirectors,
  scope: commandScopes.Prophet,
  handlerClass: PlaguesCommandHandler,
});
