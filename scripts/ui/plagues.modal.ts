import { inject } from '../system/add-on.container';
import type { Player } from '@minecraft/server';
import { DataDrivenScreenClosedReason } from '@minecraft/server-ui';
import { PLAYER_TOKEN } from '../shared/global-tokens';
import { Logger } from '../shared/logging/logger';
import { DARK_RED, GOLD, RESET } from '../shared/format-codes';
import { PlagueManager } from '../plagues/plague-manager';
import { DDUI, DDUI_TOKEN } from './ui.tokens';

export class PlaguesModal {
  private readonly player = inject(PLAYER_TOKEN);
  private readonly ddui = inject(DDUI_TOKEN);
  private readonly plagueManager = inject(PlagueManager);
  private readonly logger = inject(Logger);

  async show(): Promise<void> {
    const { CustomForm, ObservableBoolean } = this.ddui;

    let form = new CustomForm(this.player, 'Plagues of Egypt');

    const toggles = this.plagueManager.all().map((plague) => {
      const toggle = {
        plague,
        state: new ObservableBoolean(plague.isActive(), {
          clientWritable: true,
        }),
      };
      toggle.state.subscribe((active) => {
        this.plagueManager.setActive(plague.key, active);
        form.close();
      });
      return toggle;
    });

    for (const toggle of toggles) {
      form = form.toggle(toggle.plague.displayName, toggle.state);
    }

    await form.show();
  }
}
