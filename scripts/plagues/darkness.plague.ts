import { BasePlague } from './base-plague';

export class DarknessPlague extends BasePlague {
  readonly key = 'darkness';
  readonly displayName = 'Darkness';
  readonly reference = 'Exodus 10:21-29';
  readonly story = [
    `Moses stretched out his hand, and thick darkness covered Egypt.`,
    `It was a darkness people could feel, and no one could see or move for three days.`,
    `But every Hebrew family had light in their homes.`,
    `Pharaoh told Moses to go, but to leave the flocks and herds behind.`,
    `Moses refused, and an angry Pharaoh said, "Never come to see my face again!"`,
  ];
}
