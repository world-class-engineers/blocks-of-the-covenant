import { BasePlague } from './base-plague';

export class GnatsPlague extends BasePlague {
  readonly key = 'gnats';
  readonly displayName = 'Gnats';
  readonly reference = 'Exodus 8:16-19';
  readonly story = [
    `Pharaoh refused again, so God sent gnats.`,
    `Aaron struck the dust, and the dust became tiny gnats that covered people and animals.`,
    `Even the magicians could not copy this plague, and they cried out, "This is the finger of God!"`,
    `But Pharaoh's heart was still hard, and he would not listen to Moses.`,
  ];
}
