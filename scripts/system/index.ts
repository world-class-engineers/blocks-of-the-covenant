import { DependencyContainer } from 'tsyringe';
import { BlocksOfTheCovenantAddOn } from './blocks-of-the-covenant-add-on';
import { CommandManager } from './command-manager';
import { PlayerManager } from './player-manager';
import { StoryService } from './story.service';

export function registerSystem(container: DependencyContainer) {
  container.registerSingleton(StoryService);
  container.registerSingleton(BlocksOfTheCovenantAddOn);
  container.registerSingleton(CommandManager);
  container.registerSingleton(PlayerManager);
}
