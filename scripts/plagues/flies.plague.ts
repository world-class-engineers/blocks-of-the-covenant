import { BasePlague } from './base-plague';

export class FliesPlague extends BasePlague {
  readonly key = 'flies';
  readonly displayName = 'Flies';
  readonly reference = 'Exodus 8:20-32';
  readonly story = [
    `God sent swarms of flies buzzing into every Egyptian home.`,
    `But in Goshen, where the Hebrew people lived, there were no flies at all.`,
    `Pharaoh said the people could go worship God, but only nearby.`,
    `Moses prayed, and the flies left, not even one stayed behind.`,
    `But Pharaoh hardened his heart once more and would not let the people go.`,
  ];
}
