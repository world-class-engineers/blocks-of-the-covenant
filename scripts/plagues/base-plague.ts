import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { WORLD_TOKEN } from '../shared/global-tokens';
import { DARK_RED, GREEN, RESET } from '../shared/format-codes';
import type { Plague } from './plague';
import { inject } from '../system/add-on.container';
import { StoryService } from '../system/story.service';

export abstract class BasePlague implements Plague {
  private readonly storyService = inject(StoryService);
  protected readonly world = inject(WORLD_TOKEN);

  private readonly _isActive$ = new BehaviorSubject<boolean>(false);
  readonly isActive$ = this._isActive$.pipe(distinctUntilChanged());
  readonly activated$ = this.isActive$.pipe(
    distinctUntilChanged(),
    filter((isActive) => isActive),
  );
  readonly deactivated$ = this.isActive$.pipe(
    distinctUntilChanged(),
    filter((isActive) => !isActive),
  );

  abstract readonly key: string;
  abstract readonly displayName: string;
  abstract readonly reference: string;
  abstract readonly story: string[];
  protected onActivated(): void {}
  protected onDeactivated(): void {}

  isActive(): boolean {
    return this._isActive$.getValue();
  }

  setActive(active: boolean): void {
    if (this._isActive$.getValue() === active) return;
    this._isActive$.next(active);
    if (active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  private activate() {
    this.world.sendMessage(
      `${DARK_RED}The plague of ${this.displayName}${DARK_RED} has been unleashed!${RESET}`,
    );
    this.storyService.enqueueStory(this.displayName, [
      ...this.story,
      `see ${this.reference}`,
    ]);
    this.onActivated();
  }

  private deactivate() {
    this.world.sendMessage(
      `${GREEN}The plague of ${this.displayName}${GREEN} has been lifted.${RESET}`,
    );
    this.onDeactivated();
  }
}
