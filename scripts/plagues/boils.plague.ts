import { BasePlague } from './base-plague';

export class BoilsPlague extends BasePlague {
  readonly key = 'boils';
  readonly displayName = 'Boils';
  readonly reference = 'Exodus 9:8-12';
  readonly story = [
    `Moses threw soot from a furnace into the air before Pharaoh.`,
    `It became painful boils and sores that broke out on people and animals.`,
    `The magicians were so covered in boils they couldn't even stand before Moses.`,
    `But the Lord hardened Pharaoh's heart, and he still would not let the people go.`,
  ];
}
