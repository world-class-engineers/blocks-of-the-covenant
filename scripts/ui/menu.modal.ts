import { inject } from '../system/add-on.container';
import type { Player } from '@minecraft/server';
import {
  CREATE_MODAL_FORM_TOKEN,
  CreateModalFormFn,
  PLAYER_TOKEN,
} from '../shared/global-tokens';
import { Logger } from '../shared/logging/logger';

export class MenuModal {
  private readonly player = inject(PLAYER_TOKEN);
  private readonly createModalForm = inject(CREATE_MODAL_FORM_TOKEN);
  private readonly logger = inject(Logger);

  async show(): Promise<void> {
    const form = this.createModalForm()
      .title('Blocks of the Covenant')
      .header('Covenant Menu')
      .label('Configure the add-on options below.')
      .toggle('Example toggle', { defaultValue: false })
      .slider('Example slider', 0, 10, { defaultValue: 5 })
      .textField('Example text field', 'type here...', { defaultValue: '' })
      .submitButton('Done');

    try {
      const response = await form.show(this.player);
      if (response.canceled) return;
      this.logger.debug(
        'menu form submitted',
        JSON.stringify(response.formValues),
      );
    } catch (e) {
      this.logger.debug(e);
    }
  }
}
