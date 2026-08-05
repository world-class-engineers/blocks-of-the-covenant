import { BasePlague } from './base-plague';

export class HailPlague extends BasePlague {
  readonly key = 'hail';
  readonly displayName = 'Hail';
  readonly reference = 'Exodus 9:13-35';
  readonly story = [
    `Moses stretched out his hand, and hail mixed with fire rained from the sky.`,
    `It smashed the crops and trees and struck anyone or anything left out in the fields.`,
    `Pharaoh admitted he had sinned and begged Moses to stop the terrible hail.`,
    `Moses prayed, and the hail stopped, but Pharaoh sinned again and would not free the people.`,
  ];
}
