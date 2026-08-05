import { BasePlague } from './base-plague';

export class FrogsPlague extends BasePlague {
  readonly key = 'frogs';
  readonly displayName = 'Frogs';
  readonly reference = 'Exodus 8:1-15';
  readonly story = [
    `Pharaoh still wouldn't let the Hebrew people go.`,
    `So Aaron stretched out his hand, and frogs came up out of the Nile.`,
    `They covered everything — the houses, the beds, the ovens, even the food bowls!`,
    `Pharaoh begged Moses to make the frogs go away, promising to free the people.`,
    `The frogs died and piled up all over the land, but Pharaoh broke his promise and refused again.`,
  ];
}
