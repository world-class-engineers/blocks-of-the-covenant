import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseMiracle } from './base-miracle';
import { interval } from 'rxjs';
import { BlockPermutation, BlockVolume, Vector3 } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

// How often prophet positions are sampled while the miracle is active.
const POLLING_INTERVAL_MS = 200;

// Horizontal radius of the dry-ground cylinder cleared around the prophet.
const CYLINDER_RADIUS = 25;

// Miracle that simulates the parting of the Red Sea for players tagged as prophets.
// It repeatedly clears water blocks inside a cylinder centered on the prophet and
// restores water to blocks that were previously displaced but are no longer within
// the current cylinder.
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

  // Tracks water block locations that were turned into air by the miracle.
  displacedWater = new Map<string, Vector3>();
  // Tracks barrier blocks placed along the boundary of displaced air.
  boundaryBarriers = new Set<string>();

  private locationKey(location: Vector3): string {
    return `${location.x},${location.y},${location.z}`;
  }

  private parseLocationKey(key: string): Vector3 {
    const [x, y, z] = key.split(',').map(Number);
    return { x, y, z };
  }

  private isWithinCylinder(
    location: Vector3,
    center: Vector3,
    radius: number,
  ): boolean {
    return (
      Vector3Utils.distance(location, {
        x: center.x,
        y: location.y,
        z: center.z,
      }) <= radius
    );
  }

  private isCylinderBoundary(
    location: Vector3,
    center: Vector3,
    radius: number,
  ): boolean {
    return [
      { x: location.x + 1, y: location.y, z: location.z },
      { x: location.x - 1, y: location.y, z: location.z },
      { x: location.x, y: location.y, z: location.z + 1 },
      { x: location.x, y: location.y, z: location.z - 1 },
    ].some((neighbor) => !this.isWithinCylinder(neighbor, center, radius));
  }

  get overworld() {
    return this.world.getDimension('overworld');
  }

  constructor() {
    super();

    this.performed$
      .pipe(
        // Find all prophet players when the miracle is performed.
        map(() => this.world.getPlayers({ tags: ['prophet'] })[0]),
        // For each prophet, start a polling stream that captures their position.
        switchMap((prophet) =>
          interval(POLLING_INTERVAL_MS).pipe(
            map(() => ({
              prophet: prophet.name,
              position: prophet.location,
              viewDirection: prophet.getViewDirection(),
            })),
            // Skip samples where the prophet hasn't moved, so the cylinder is only
            // recomputed when they change location.
            distinctUntilChanged((previous, current) => {
              const a = previous.position;
              const b = current.position;
              return a.x === b.x && a.y === b.y && a.z === b.z;
            }),
          ),
        ),
        // Convert the prophet's position into a cylinder of dry ground.
        map((data) => {
          const BEDROCK_Y = -64;
          const SKY_LIMIT_Y = 320;

          // Cylinder centered on the prophet's position, with its floor on bedrock
          // and its ceiling at the build height limit.
          const center = {
            x: Math.floor(data.position.x),
            y: 0,
            z: Math.floor(data.position.z),
          };

          // Bounding box enclosing the cylinder so candidate blocks can be queried.
          const boundingBox = new BlockVolume(
            {
              x: center.x - CYLINDER_RADIUS,
              y: BEDROCK_Y,
              z: center.z - CYLINDER_RADIUS,
            },
            {
              x: center.x + CYLINDER_RADIUS,
              y: SKY_LIMIT_Y,
              z: center.z + CYLINDER_RADIUS,
            },
          );

          return { center, boundingBox };
        }),
        // Query water and air blocks inside the cylinder's bounding box.
        map(({ center, boundingBox }) => ({
          center,
          locations: this.overworld.getBlocks(boundingBox, {
            includeTypes: ['minecraft:water', 'minecraft:air'],
          }),
        })),
        tap(({ center, locations }) => {
          const displacedWater = this.displacedWater;
          const boundaryBarriers = this.boundaryBarriers;

          // Restore any displaced water blocks that are no longer inside the current cylinder.
          for (const [key, location] of displacedWater.entries()) {
            if (!this.isWithinCylinder(location, center, CYLINDER_RADIUS)) {
              this.overworld.setBlockType(location, 'minecraft:water');
              displacedWater.delete(key);
              boundaryBarriers.delete(key);
            }
          }

          // Clear water inside the current cylinder and remember its locations.
          for (const location of locations.getBlockLocationIterator()) {
            if (!this.isWithinCylinder(location, center, CYLINDER_RADIUS)) {
              continue;
            }

            const block = this.overworld.getBlock(location);
            if (
              !block ||
              (block.type.id !== 'minecraft:water' && !block.isWaterlogged)
            ) {
              continue;
            }

            const key = this.locationKey(location);
            this.overworld.setBlockType(location, 'minecraft:air');
            displacedWater.set(key, location);
          }

          const currentBoundaryKeys = new Set<string>();

          for (const [key, location] of displacedWater.entries()) {
            if (this.isCylinderBoundary(location, center, CYLINDER_RADIUS)) {
              currentBoundaryKeys.add(key);
              if (!boundaryBarriers.has(key)) {
                this.overworld.setBlockType(location, 'minecraft:barrier');
                boundaryBarriers.add(key);
              }
            }
          }

          for (const key of [...boundaryBarriers]) {
            if (!currentBoundaryKeys.has(key)) {
              const location = this.parseLocationKey(key);
              if (displacedWater.has(key)) {
                this.overworld.setBlockType(location, 'minecraft:air');
              }
              boundaryBarriers.delete(key);
            }
          }
        }),
      )
      .subscribe();
  }
}
