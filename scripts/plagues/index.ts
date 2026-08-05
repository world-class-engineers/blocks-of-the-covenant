import { DependencyContainer, Lifecycle } from 'tsyringe';
import { PLAGUES_TOKEN } from './plague';
import { WaterToBloodPlague } from './water-to-blood.plague';
import { FrogsPlague } from './frogs.plague';
import { GnatsPlague } from './gnats.plague';
import { FliesPlague } from './flies.plague';
import { LivestockPestilencePlague } from './livestock-illness.plague';
import { BoilsPlague } from './boils.plague';
import { HailPlague } from './hail.plague';
import { LocustsPlague } from './locusts.plague';
import { DarknessPlague } from './darkness.plague';
import { DeathOfTheFirstbornPlague } from './death-of-the-firstborn.plague';
import { PlagueManager } from './plague-manager';

export function registerPlagues(container: DependencyContainer) {
  container.register(
    PLAGUES_TOKEN,
    { useClass: WaterToBloodPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: FrogsPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: GnatsPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: FliesPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: LivestockPestilencePlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: BoilsPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: HailPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: LocustsPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: DarknessPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    PLAGUES_TOKEN,
    { useClass: DeathOfTheFirstbornPlague },
    { lifecycle: Lifecycle.ContainerScoped },
  );

  container.register(PlagueManager, PlagueManager, {
    lifecycle: Lifecycle.ContainerScoped,
  });
}
