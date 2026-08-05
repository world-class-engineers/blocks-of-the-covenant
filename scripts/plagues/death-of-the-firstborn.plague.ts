import { BasePlague } from './base-plague';

export class DeathOfTheFirstbornPlague extends BasePlague {
  readonly key = 'death-of-the-firstborn';
  readonly displayName = 'Death of the Firstborn';
  readonly reference = 'Exodus 11:1-10, 12:29-32';
  readonly story = [
    `This was the tenth and final plague, and it was the saddest of all.`,
    `God said that every firstborn child in Egypt would die.`,
    `The Hebrews marked their doorposts with lamb's blood so the angel would pass over their homes.`,
    `At midnight, every firstborn in Egypt died, even the son of Pharaoh himself.`,
    `At last Pharaoh let the people go, and the Hebrew people hurried out of Egypt.`,
  ];
}
