import { inject } from '../add-on.container';
import type { CustomCommandResult, System } from '@minecraft/server';
import { SYSTEM_TOKEN } from '../../shared/global-tokens';
import { MenuModal } from '../../ui/menu.modal';
import {
  addOnCommand,
  CommandHandler,
  customCommandStatuses,
} from '../add-on-command';

export class MenuCommandHandler implements CommandHandler {
  private readonly system = inject(SYSTEM_TOKEN);
  private readonly menuModal = inject(MenuModal);

  handleCommand(): CustomCommandResult {
    this.system.run(() => {
      this.menuModal.show();
    });

    return { status: customCommandStatuses.Success };
  }
}

export const menuCommand = addOnCommand({
  name: 'menu',
  description: 'opens the Blocks of the Covenant menu',
  handlerClass: MenuCommandHandler,
});
