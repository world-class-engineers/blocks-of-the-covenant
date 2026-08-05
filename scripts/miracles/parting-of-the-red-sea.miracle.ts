import { map, switchMap, tap } from 'rxjs/operators';
import { BaseMiracle } from './base-miracle';
import { interval, merge } from 'rxjs';
import { BlockVolumeBase } from '@minecraft/server';

const POLLING_INTERVAL_MS = 1000;

export class PartingOfTheRedSeaMiracle extends BaseMiracle {
  readonly key = 'parting-of-the-red-sea';
  readonly displayName = 'Parting of the Red Sea';
  readonly reference = 'Exodus 14:21-22';
  readonly story = [
    `Moses stretched out his hand over the sea, and the LORD drove the sea back with a strong east wind all that night.`,
    `The waters were divided, and the people of Israel walked through the sea on dry ground.`,
    `The waters formed a wall to them on their right and on their left.`,
    `When the Egyptians chased after them, the waters returned and covered them, and not one of them survived.`,
  ];

  constructor() {
    super();

    this.performed$
      .pipe(
        map(() => this.world.getPlayers({ tags: ['prophet'] })),
        switchMap((prophets) =>
          merge(
            ...prophets.map((prophet) =>
              interval(POLLING_INTERVAL_MS).pipe(
                map(() => ({
                  prophet: prophet.name,
                  position: prophet.location,
                  viewDirection: prophet.getViewDirection(),
                })),
              ),
            ),
          ),
        ),
        // // calculate the volume from sky limit to bedrock in the direction the prophet is looking
        // map(data => ({}) as BlockVolumeBase),
        // // tap((data) => console.log(JSON.stringify(data))),
        // map((data) => this.world.getDimension('overworld').getBlocks()),
      )
      .subscribe();
  }
}
