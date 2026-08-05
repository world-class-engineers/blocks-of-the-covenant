import { BaseMiracle } from './base-miracle';

export class StaffIntoSnakeMiracle extends BaseMiracle {
  readonly key = 'staff-into-snake';
  readonly displayName = 'Staff into Snake';
  readonly reference = 'Exodus 4:2-4';
  readonly story = [
    `The LORD asked Moses, "What is that in your hand?" and Moses answered, "A staff."`,
    `The LORD told him to throw it on the ground, and it became a snake, and Moses ran away from it.`,
    `The LORD told him to reach out and take it by the tail, and it became a staff again in his hand.`,
  ];
}
