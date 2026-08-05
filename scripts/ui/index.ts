import { DependencyContainer, Lifecycle } from 'tsyringe';
import { MenuModal } from './menu.modal';
import { PlaguesModal } from './plagues.modal';
import { MiraclesModal } from './miracles.modal';

export function registerUi(container: DependencyContainer) {
  container.register(MenuModal, MenuModal, {
    lifecycle: Lifecycle.ContainerScoped,
  });
  container.register(PlaguesModal, PlaguesModal, {
    lifecycle: Lifecycle.ContainerScoped,
  });
  container.register(MiraclesModal, MiraclesModal, {
    lifecycle: Lifecycle.ContainerScoped,
  });
}
