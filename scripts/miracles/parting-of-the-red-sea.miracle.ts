import {
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { BaseMiracle } from './base-miracle';
import { interval, Subject } from 'rxjs';
import { BlockVolume, system, Vector3 } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

const POLLING_INTERVAL_MS = 500;
const HORIZONTAL_RADIUS = 25;

const WATER_BLOCK_TYPE = 'minecraft:water';
const AIR_BLOCK_TYPE = 'minecraft:air';
const BARRIER_BLOCK_TYPE = 'minecraft:barrier';

const DEAD_TO_ALIVE_CORAL: Record<string, string> = {
  'minecraft:dead_tube_coral': 'minecraft:tube_coral',
  'minecraft:dead_brain_coral': 'minecraft:brain_coral',
  'minecraft:dead_bubble_coral': 'minecraft:bubble_coral',
  'minecraft:dead_fire_coral': 'minecraft:fire_coral',
  'minecraft:dead_horn_coral': 'minecraft:horn_coral',
  'minecraft:dead_tube_coral_block': 'minecraft:tube_coral_block',
  'minecraft:dead_brain_coral_block': 'minecraft:brain_coral_block',
  'minecraft:dead_bubble_coral_block': 'minecraft:bubble_coral_block',
  'minecraft:dead_fire_coral_block': 'minecraft:fire_coral_block',
  'minecraft:dead_horn_coral_block': 'minecraft:horn_coral_block',
  'minecraft:dead_tube_coral_fan': 'minecraft:tube_coral_fan',
  'minecraft:dead_brain_coral_fan': 'minecraft:brain_coral_fan',
  'minecraft:dead_bubble_coral_fan': 'minecraft:bubble_coral_fan',
  'minecraft:dead_fire_coral_fan': 'minecraft:fire_coral_fan',
  'minecraft:dead_horn_coral_fan': 'minecraft:horn_coral_fan',
};

const WATERLOGGED_OCEAN_TYPES = [
  'minecraft:tube_coral',
  'minecraft:brain_coral',
  'minecraft:bubble_coral',
  'minecraft:fire_coral',
  'minecraft:horn_coral',
  'minecraft:tube_coral_fan',
  'minecraft:brain_coral_fan',
  'minecraft:bubble_coral_fan',
  'minecraft:fire_coral_fan',
  'minecraft:horn_coral_fan',
  'minecraft:sea_pickle',
];

interface PartingEvent {
  prophet: string;
  position: Vector3;
}

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

  private readonly displacedWater = new Map<string, Vector3>();
  private readonly boundaryBarriers = new Map<string, Vector3>();
  private readonly outOfWater$ = new Subject<void>();

  private locationKey(location: Vector3): string {
    return `${location.x},${location.y},${location.z}`;
  }

  private isWithinBox(loc: Vector3, cx: number, cz: number): boolean {
    return (
      Math.abs(loc.x - cx) <= HORIZONTAL_RADIUS &&
      Math.abs(loc.z - cz) <= HORIZONTAL_RADIUS
    );
  }

  private isBoxBoundary(loc: Vector3, cx: number, cz: number): boolean {
    return (
      Math.abs(loc.x - cx) === HORIZONTAL_RADIUS ||
      Math.abs(loc.z - cz) === HORIZONTAL_RADIUS
    );
  }

  private fillBlocksChunked(
    fx: number,
    fz: number,
    tx: number,
    tz: number,
    fy: number,
    ty: number,
    blockType: string,
    blockFilter?: { blockTypes?: string[]; includeTypes?: string[] },
  ) {
    const xzArea = (tx - fx + 1) * (tz - fz + 1);
    const maxY = Math.max(1, Math.floor(32768 / xzArea));
    for (let y = fy; y <= ty; y += maxY) {
      this.overworld.fillBlocks(
        new BlockVolume(
          { x: fx, y, z: fz },
          { x: tx, y: Math.min(y + maxY - 1, ty), z: tz },
        ),
        blockType,
        blockFilter ? { blockFilter } : undefined,
      );
    }
  }

  get overworld() {
    return this.world.getDimension('overworld');
  }

  constructor() {
    super();

    let i = 0;
    this.performed$
      .pipe(
        map(() => this.world.getPlayers({ tags: ['prophet'] })[0]),
        switchMap((prophet) =>
          interval(POLLING_INTERVAL_MS).pipe(
            takeUntil(this.outOfWater$),
            map(
              () =>
                ({
                  prophet: prophet.name,
                  position: prophet.location,
                }) as PartingEvent,
            ),
          ),
        ),
        distinctUntilChanged((previous, current) => {
          return Vector3Utils.equals(previous.position, current.position);
        }),
      )
      .subscribe((data) => system.run(() => this.onTick(data, i++)));
  }

  onTick(event: PartingEvent, i: number) {
    const displacedWater = this.displacedWater;
    const boundaryBarriers = this.boundaryBarriers;
    let affectedBlockCount = 0;

    const mosesY = Math.floor(event.position.y);
    const cx = Math.floor(event.position.x);
    const cz = Math.floor(event.position.z);

    const lowerY = mosesY - 10;
    const upperY = Math.max(mosesY + 25, 63);

    const from: Vector3 = {
      x: cx - HORIZONTAL_RADIUS,
      y: lowerY,
      z: cz - HORIZONTAL_RADIUS,
    };
    const to: Vector3 = {
      x: cx + HORIZONTAL_RADIUS,
      y: upperY,
      z: cz + HORIZONTAL_RADIUS,
    };
    const boundingBox = new BlockVolume(from, to);

    const waterFilter = {
      includeTypes: [WATER_BLOCK_TYPE, BARRIER_BLOCK_TYPE],
    };
    const barrierFillFilter = { includeTypes: [WATER_BLOCK_TYPE] };
    const interiorFillFilter = {
      includeTypes: [
        WATER_BLOCK_TYPE,
        BARRIER_BLOCK_TYPE,
        'minecraft:seagrass',
        'minecraft:tall_seagrass',
        'minecraft:kelp',
        'minecraft:sea_pickle',
        ...WATERLOGGED_OCEAN_TYPES,
      ],
    };

    // Phase 1 — track blocks and do bulk fills in one pass.
    // Counts only newly-displaced blocks (skip entries already tracked).
    let waterBlocksInBox = 0;
    for (const loc of this.overworld
      .getBlocks(boundingBox, waterFilter)
      .getBlockLocationIterator()) {
      waterBlocksInBox++;
      const key = this.locationKey(loc);
      if (this.isBoxBoundary(loc, cx, cz)) {
        if (!boundaryBarriers.has(key)) affectedBlockCount++;
        boundaryBarriers.set(key, loc);
        displacedWater.set(key, loc);
      } else {
        if (!displacedWater.has(key)) affectedBlockCount++;
        displacedWater.set(key, loc);
        boundaryBarriers.delete(key);
      }
    }

    // Phase 2 — bulk-fill interior water → air, chunked by Y to stay under
    // the 32K-block fill limit (interior is ~84K blocks).
    if (HORIZONTAL_RADIUS > 1) {
      this.fillBlocksChunked(
        cx - HORIZONTAL_RADIUS + 1,
        cz - HORIZONTAL_RADIUS + 1,
        cx + HORIZONTAL_RADIUS - 1,
        cz + HORIZONTAL_RADIUS - 1,
        lowerY,
        upperY,
        AIR_BLOCK_TYPE,
        interiorFillFilter,
      );
    }

    // Phase 3 — bulk-fill boundary walls: water → barrier (4 calls).
    const fillBarrier = (fx: number, fz: number, tx: number, tz: number) => {
      this.overworld.fillBlocks(
        new BlockVolume(
          { x: fx, y: lowerY, z: fz },
          { x: tx, y: upperY, z: tz },
        ),
        BARRIER_BLOCK_TYPE,
        { blockFilter: barrierFillFilter },
      );
    };

    fillBarrier(
      cx - HORIZONTAL_RADIUS,
      cz - HORIZONTAL_RADIUS,
      cx - HORIZONTAL_RADIUS,
      cz + HORIZONTAL_RADIUS,
    );
    fillBarrier(
      cx + HORIZONTAL_RADIUS,
      cz - HORIZONTAL_RADIUS,
      cx + HORIZONTAL_RADIUS,
      cz + HORIZONTAL_RADIUS,
    );
    fillBarrier(
      cx - HORIZONTAL_RADIUS + 1,
      cz - HORIZONTAL_RADIUS,
      cx + HORIZONTAL_RADIUS - 1,
      cz - HORIZONTAL_RADIUS,
    );
    fillBarrier(
      cx - HORIZONTAL_RADIUS + 1,
      cz + HORIZONTAL_RADIUS,
      cx + HORIZONTAL_RADIUS - 1,
      cz + HORIZONTAL_RADIUS,
    );

    // Phase 4 — un-waterlog coral blocks (few, individual calls ok).
    for (const loc of this.overworld
      .getBlocks(boundingBox, { includeTypes: WATERLOGGED_OCEAN_TYPES })
      .getBlockLocationIterator()) {
      if (this.isBoxBoundary(loc, cx, cz)) continue;

      const key = this.locationKey(loc);
      if (displacedWater.has(key)) continue;

      try {
        const block = this.overworld.getBlock(loc);
        if (block?.isWaterlogged) {
          block.setWaterlogged(false);
          displacedWater.set(key, loc);
          affectedBlockCount++;
        }
      } catch (_) {}
    }

    // Phase 5 — restore water & revive coral behind the prophet.
    const exterior: Vector3[] = [];
    for (const [key, loc] of displacedWater) {
      if (boundaryBarriers.has(key)) continue;
      if (!this.isWithinBox(loc, cx, cz)) {
        exterior.push(loc);
        this.overworld.setBlockType(loc, WATER_BLOCK_TYPE);
        displacedWater.delete(key);
        affectedBlockCount++;
      }
    }
    for (const [key, loc] of boundaryBarriers) {
      if (!this.isWithinBox(loc, cx, cz)) {
        exterior.push(loc);
        this.overworld.setBlockType(loc, WATER_BLOCK_TYPE);
        boundaryBarriers.delete(key);
        displacedWater.delete(key);
        affectedBlockCount++;
      }
    }
    if (exterior.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const loc of exterior) {
        if (loc.x < minX) minX = loc.x; if (loc.x > maxX) maxX = loc.x;
        if (loc.y < minY) minY = loc.y; if (loc.y > maxY) maxY = loc.y;
        if (loc.z < minZ) minZ = loc.z; if (loc.z > maxZ) maxZ = loc.z;
      }
      const vol = new BlockVolume(
        { x: minX, y: minY, z: minZ },
        { x: maxX, y: maxY, z: maxZ },
      );
      for (const loc of this.overworld
        .getBlocks(vol, { includeTypes: Object.keys(DEAD_TO_ALIVE_CORAL) })
        .getBlockLocationIterator()) {
        try {
          const block = this.overworld.getBlock(loc);
          const aliveType = DEAD_TO_ALIVE_CORAL[block?.typeId ?? ''];
          if (aliveType) this.overworld.setBlockType(loc, aliveType);
        } catch (_) {}
      }
    }

    if (affectedBlockCount === 0) {
      if (
        waterBlocksInBox === 0 &&
        (displacedWater.size > 0 || boundaryBarriers.size > 0)
      ) {
        // Prophet walked out of the ocean — restore remaining displaced blocks.
        // Bulk-fill interior blocks (all below sea level), then handle
        // boundary barriers individually to avoid spilling water above ground.
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        let hasInterior = false;
        for (const [key, loc] of displacedWater) {
          if (boundaryBarriers.has(key)) continue;
          hasInterior = true;
          if (loc.x < minX) minX = loc.x;
          if (loc.x > maxX) maxX = loc.x;
          if (loc.y < minY) minY = loc.y;
          if (loc.y > maxY) maxY = loc.y;
          if (loc.z < minZ) minZ = loc.z;
          if (loc.z > maxZ) maxZ = loc.z;
        }
        if (hasInterior) {
          this.fillBlocksChunked(
            minX, minZ, maxX, maxZ, minY, maxY,
            WATER_BLOCK_TYPE,
            { includeTypes: [AIR_BLOCK_TYPE, BARRIER_BLOCK_TYPE] },
          );
          const deadCoralVolume = new BlockVolume(
            { x: minX, y: minY, z: minZ },
            { x: maxX, y: maxY, z: maxZ },
          );
          for (const loc of this.overworld
            .getBlocks(deadCoralVolume, {
              includeTypes: Object.keys(DEAD_TO_ALIVE_CORAL),
            })
            .getBlockLocationIterator()) {
            try {
              const block = this.overworld.getBlock(loc);
              const aliveType = DEAD_TO_ALIVE_CORAL[block?.typeId ?? ''];
              if (aliveType) this.overworld.setBlockType(loc, aliveType);
            } catch (_) {}
          }
        }
        for (const [, loc] of boundaryBarriers) {
          this.overworld.setBlockType(loc, WATER_BLOCK_TYPE);
        }
        displacedWater.clear();
        boundaryBarriers.clear();
        this.outOfWater$.next();
      } else if (displacedWater.size === 0 && boundaryBarriers.size === 0) {
        this.outOfWater$.next();
      }
    }
  }
}
