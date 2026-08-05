import { concatMap, Subject, timer } from 'rxjs';
import { inject } from './add-on.container';
import { WORLD_TOKEN } from '../shared/global-tokens';
import { DARK_RED, GRAY } from '../shared/format-codes';

const SCREEN_GAP_MS = 1000;

interface StoryScreen {
  kind: 'title' | 'message';
  text: string;
  color?: string;
}

export function messageDurationMs(message: string): number {
  const length = message.length;
  return Math.min(Math.max(length * 50, 2000), 10000);
}

export class StoryService {
  private readonly world = inject(WORLD_TOKEN);
  private readonly screens$ = new Subject<StoryScreen>();

  constructor() {
    this.screens$
      .pipe(
        concatMap((screen) => {
          this.show(screen);
          return timer(messageDurationMs(screen.text) + SCREEN_GAP_MS);
        }),
      )
      .subscribe({
        error: (err) => console.error('story queue failed:', err),
      });
  }

  enqueueStory(title: string, story: string[], titleColor: string = DARK_RED) {
    this.screens$.next({ kind: 'title', text: title, color: titleColor });
    for (const part of story) {
      this.screens$.next({ kind: 'message', text: part });
    }
  }

  private show(screen: StoryScreen) {
    if (screen.kind === 'title') {
      this.showTitle(screen);
    } else {
      this.world.sendMessage(`${GRAY}> ${screen.text}`);
    }
  }

  private showTitle(screen: StoryScreen) {
    try {
      const rawtext = JSON.stringify({
        rawtext: [{ text: `${screen.color ?? DARK_RED}${screen.text}` }],
      });
      this.world
        .getDimension('overworld')
        .runCommand(`titleraw @a title ${rawtext}`);
    } catch (err) {
      console.error('failed to show plague story title:', err);
    }
  }
}
