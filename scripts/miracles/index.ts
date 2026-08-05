import { DependencyContainer, Lifecycle } from 'tsyringe';
import { MIRACLES_TOKEN } from './miracle';
import { MiracleManager } from './miracle-manager';
import { StaffIntoSnakeMiracle } from './staff-into-snake.miracle';
import { PartingOfTheRedSeaMiracle } from './parting-of-the-red-sea.miracle';
import { MannaMiracle } from './manna.miracle';
import { WaterFromTheRockMiracle } from './water-from-the-rock.miracle';

export function registerMiracles(container: DependencyContainer) {
  container.register(
    MIRACLES_TOKEN,
    { useClass: StaffIntoSnakeMiracle },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    MIRACLES_TOKEN,
    { useClass: PartingOfTheRedSeaMiracle },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    MIRACLES_TOKEN,
    { useClass: MannaMiracle },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  container.register(
    MIRACLES_TOKEN,
    { useClass: WaterFromTheRockMiracle },
    { lifecycle: Lifecycle.ContainerScoped },
  );

  container.register(MiracleManager, MiracleManager, {
    lifecycle: Lifecycle.ContainerScoped,
  });
}
