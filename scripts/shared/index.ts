import { DependencyContainer, Lifecycle } from 'tsyringe';
import { Logger } from './logging/logger';
import { PlayerStorage, WorldStorage } from './storage';

export function registerShared(container: DependencyContainer) {
  container.registerSingleton(WorldStorage);
  container.register(Logger, Logger, {
    lifecycle: Lifecycle.ContainerScoped,
  });
  container.register(PlayerStorage, PlayerStorage, {
    lifecycle: Lifecycle.ContainerScoped,
  });
}
