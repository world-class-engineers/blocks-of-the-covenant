import { Subject } from 'rxjs';
import { WORLD_TOKEN } from '../shared/global-tokens';
import { GOLD, RESET } from '../shared/format-codes';
import type { Miracle } from './miracle';
import { inject } from '../system/add-on.container';
import { StoryService } from '../system/story.service';

export abstract class BaseMiracle implements Miracle {
  private readonly storyService = inject(StoryService);
  protected readonly world = inject(WORLD_TOKEN);

  private readonly _performed$ = new Subject<Miracle>();
  readonly performed$ = this._performed$.asObservable();

  abstract readonly key: string;
  abstract readonly displayName: string;
  abstract readonly reference: string;
  abstract readonly story: string[];

  perform(): void {
    this._performed$.next(this);
    this.world.sendMessage(
      `${GOLD}The miracle of ${this.displayName}${GOLD} has been performed!${RESET}`,
    );
    this.storyService.enqueueStory(
      this.displayName,
      [...this.story, `see ${this.reference}`],
      GOLD,
    );
    this.onPerformed();
  }

  protected onPerformed(): void {}
}
