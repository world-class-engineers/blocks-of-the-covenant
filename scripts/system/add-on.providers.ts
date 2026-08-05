import { DependencyContainer } from 'tsyringe';
import { registerShared } from '../shared';
import { registerPlagues } from '../plagues';
import { registerMiracles } from '../miracles';
import { registerUi } from '../ui';
import { registerSystem } from './index';
import { registerCommands } from './commands';

export function provideAddOnServices(container: DependencyContainer) {
  registerShared(container);
  registerSystem(container);
  registerPlagues(container);
  registerMiracles(container);
  registerUi(container);
  registerCommands(container);
}
