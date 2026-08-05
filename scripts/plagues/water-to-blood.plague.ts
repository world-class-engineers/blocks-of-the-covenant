import { interval, map, switchMap, takeUntil, tap } from 'rxjs';
import { BasePlague } from './base-plague';

const POLLING_INTERVAL_MS = 1000;

export class WaterToBloodPlague extends BasePlague {
  readonly key = 'water-to-blood';
  readonly displayName = 'Water to Blood';
  readonly reference = 'Exodus 7:14-24';
  readonly story = [
    `Pharaoh was stubborn and wouldn't let the Hebrew people go.`,
    `God told Moses and Aaron to ask him again and show him God's power.`,
    `They touched the Nile River with the staff and turned the water into blood.`,
    `The fish died, the river smelled awful, and the Egyptians had to dig for clean water.`,
    `But Pharaoh's magicians copied the miracle, so Pharaoh ignored it and refused to free God's people.`,
  ];

  constructor() {
    super();

    this.activated$
      .pipe(
        switchMap(() =>
          interval(POLLING_INTERVAL_MS).pipe(
            takeUntil(this.deactivated$),
            map(() => this.world.getAllPlayers()),
            // TODO:
            // map players to the volume surrounding them
            // check for water blocks in that volume
            // and replace them with blood blocks
            tap((players) =>
              console.log(players.map((p) => p.name).join(', ')),
            ),
          ),
        ),
      )
      .subscribe();

    this.deactivated$
      .pipe
      // map event to all blood blocks in the world
      // replace them with water blocks
      ()
      .subscribe();
  }
}
