import { DependencyContainer, Lifecycle } from 'tsyringe';
import { ADD_ON_COMMANDS_TOKEN } from '../add-on-command';
import { MenuCommandHandler, menuCommand } from './menu.command';
import { PlaguesCommandHandler, plaguesCommand } from './plagues.command';
import { ProphetsCommandHandler, prophetsCommand } from './prophets.command';
import { MiraclesCommandHandler, miraclesCommand } from './miracles.command';

export function registerCommands(container: DependencyContainer) {
  container.registerSingleton(ProphetsCommandHandler);
  container.register(MenuCommandHandler, MenuCommandHandler, {
    lifecycle: Lifecycle.ContainerScoped,
  });
  container.register(PlaguesCommandHandler, PlaguesCommandHandler, {
    lifecycle: Lifecycle.ContainerScoped,
  });
  container.register(MiraclesCommandHandler, MiraclesCommandHandler, {
    lifecycle: Lifecycle.ContainerScoped,
  });

  container.register(ADD_ON_COMMANDS_TOKEN, { useValue: menuCommand });
  container.register(ADD_ON_COMMANDS_TOKEN, { useValue: prophetsCommand });
  container.register(ADD_ON_COMMANDS_TOKEN, { useValue: plaguesCommand });
  container.register(ADD_ON_COMMANDS_TOKEN, { useValue: miraclesCommand });
}
