import { BasePlague } from './base-plague';

export class LocustsPlague extends BasePlague {
  readonly key = 'locusts';
  readonly displayName = 'Locusts';
  readonly reference = 'Exodus 10:1-20';
  readonly story = [
    `Pharaoh refused again, so an east wind brought locusts into the land.`,
    `They covered the ground and ate every plant that the hail had left behind.`,
    `Pharaoh begged forgiveness and asked Moses to pray that the locusts would leave.`,
    `A strong west wind swept them away into the Red Sea.`,
    `But once they were gone, Pharaoh's heart grew hard again and he would not let the people go.`,
  ];
}
