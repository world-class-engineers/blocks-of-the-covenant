import { inject } from '../system/add-on.container';
import type { Player } from '@minecraft/server';
import { PLAYER_TOKEN } from '../shared/global-tokens';
import { MiracleManager } from '../miracles/miracle-manager';
import { DDUI, DDUI_TOKEN } from './ui.tokens';

export class MiraclesModal {
  private readonly player = inject(PLAYER_TOKEN);
  private readonly ddui = inject(DDUI_TOKEN);
  private readonly miracleManager = inject(MiracleManager);

  async show(): Promise<void> {
    const { CustomForm } = this.ddui;

    let form = new CustomForm(this.player, 'Miracles of the Covenant');

    for (const miracle of this.miracleManager.all()) {
      form = form.button(miracle.displayName, () => {
        this.miracleManager.perform(miracle.key);
        form.close();
      });
    }

    form = form.closeButton();

    await form.show();
  }
}
