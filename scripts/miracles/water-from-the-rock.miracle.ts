import { BaseMiracle } from './base-miracle';

export class WaterFromTheRockMiracle extends BaseMiracle {
  readonly key = 'water-from-the-rock';
  readonly displayName = 'Water from the Rock';
  readonly reference = 'Exodus 17:1-7';
  readonly story = [
    `The people camped at Rephidim, where there was no water to drink, and they grumbled against Moses.`,
    `The LORD told Moses to take his staff and strike the rock at Horeb.`,
    `Moses struck the rock, and water came pouring out for the people and their livestock to drink.`,
    `Moses named that place Massah and Meribah, because the people tested the LORD there.`,
  ];
}
