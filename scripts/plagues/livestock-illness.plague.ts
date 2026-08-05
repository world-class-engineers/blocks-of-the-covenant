import { BasePlague } from './base-plague';

export class LivestockPestilencePlague extends BasePlague {
  readonly key = 'livestock-pestilence';
  readonly displayName = 'Livestock Pestilence';
  readonly reference = 'Exodus 9:1-7';
  readonly story = [
    `God sent a deadly sickness on the livestock of Egypt.`,
    `Horses, donkeys, camels, cattle, and sheep all began to die.`,
    `But not a single animal belonging to the Hebrew people died.`,
    `Pharaoh checked and saw it was true, yet he still refused to let God's people go.`,
  ];
}
