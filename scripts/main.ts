import './polyfills';
import { container } from './system/add-on.container';
import { system, world } from '@minecraft/server';
import { BlocksOfTheCovenantAddOn } from './system/blocks-of-the-covenant-add-on';
import {
  getLogSettings,
  LOG_SETTINGS_TOKEN,
} from './shared/logging/log-settings';
import { Logger } from './shared/logging/logger';
import { AQUA } from './shared/format-codes';
import { provideMinecraftServices } from './system/minecraft-services.provider';
import { provideAddOnServices } from './system/add-on.providers';

provideMinecraftServices(container);
provideAddOnServices(container);

container.registerInstance(LOG_SETTINGS_TOKEN, getLogSettings);
const logger = container.resolve(Logger);

logger.log(`${AQUA}Initializing Blocks of the Covenant Add-On...`);
const addOn = container.resolve(BlocksOfTheCovenantAddOn);
system.beforeEvents.startup.subscribe((event) => {
  addOn.startUp(event);
});
system.run(() => {
  try {
    addOn.run();
    logger.log('Blocks of the Covenant Add-On initialized successfully.');
  } catch (error) {
    logger.error('Error initializing Blocks of the Covenant Add-On:', error);
  }
});
