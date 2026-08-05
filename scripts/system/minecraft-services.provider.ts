import {
  system,
  world,
  BiomeTypes,
  ItemStack,
  ItemTypes,
  EffectTypes,
  EnchantmentTypes,
  DimensionTypes,
  EntityTypes,
  BlockTypes,
  ItemComponentTypes,
  ItemEnchantableComponent,
  EntityComponentTypes,
  EquipmentSlot,
  EntityDamageCause,
} from '@minecraft/server';
import {
  ActionFormData,
  ModalFormData,
  CustomForm,
  ObservableBoolean,
  ObservableNumber,
  ObservableString,
  MessageFormData,
} from '@minecraft/server-ui';
import {
  BIOME_TYPES_TOKEN,
  BLOCK_TYPES_TOKEN,
  CREATE_ACTION_FORM_TOKEN,
  CREATE_MESSAGE_FORM_TOKEN,
  CREATE_MODAL_FORM_TOKEN,
  DIMENSION_TYPES_TOKEN,
  EFFECT_TYPES_TOKEN,
  ENCHANTMENT_TYPES_TOKEN,
  ENTITY_COMPONENT_TYPES_TOKEN,
  ENTITY_DAMAGE_CAUSE_TOKEN,
  ENTITY_TYPES_TOKEN,
  EQUIPMENT_SLOT_TOKEN,
  ITEM_COMPONENT_TYPES_TOKEN,
  ITEM_ENCHANTABLE_COMPONENT_TOKEN,
  ITEM_STACK_TOKEN,
  ITEM_TYPES_TOKEN,
  SYSTEM_TOKEN,
  WORLD_TOKEN,
} from '../shared/global-tokens';
import { DDUI_TOKEN } from '../ui/ui.tokens';
import { DependencyContainer } from 'tsyringe';

/**
 * wires up the Minecraft services into the dependency injection container
 * so that they can be injected into classes that need them. Since the @minecraft/server*
 * packages have no concrete implementation (only types) at build and unit test-time, we need
 * to be able to provide a fake implementation during build/test, and the real
 * implementation at runtime. Putting all that behind a DI container creates a clean
 * separation of concerns and allows for easier testing and mocking.
 * When running in-game, the import from @minecraft/server* will provide the real implementation,
 * so this function will wire up the real implementation into the DI container.
 * @param container
 */
export function provideMinecraftServices(container: DependencyContainer) {
  container.registerInstance(SYSTEM_TOKEN, system);
  container.registerInstance(WORLD_TOKEN, world);

  container.registerInstance(DDUI_TOKEN, {
    CustomForm,
    ObservableBoolean,
    ObservableNumber,
    ObservableString,
  });
  container.registerInstance(
    CREATE_MODAL_FORM_TOKEN,
    () => new ModalFormData(),
  );
  container.registerInstance(
    CREATE_MESSAGE_FORM_TOKEN,
    () => new MessageFormData(),
  );
  container.registerInstance(
    CREATE_ACTION_FORM_TOKEN,
    () => new ActionFormData(),
  );
  container.registerInstance(BIOME_TYPES_TOKEN, BiomeTypes);
  container.registerInstance(ITEM_TYPES_TOKEN, ItemTypes);
  container.registerInstance(EFFECT_TYPES_TOKEN, EffectTypes);
  container.registerInstance(ENCHANTMENT_TYPES_TOKEN, EnchantmentTypes);
  container.registerInstance(DIMENSION_TYPES_TOKEN, DimensionTypes);
  container.registerInstance(ENTITY_TYPES_TOKEN, EntityTypes);
  container.registerInstance(BLOCK_TYPES_TOKEN, BlockTypes);
  container.registerInstance(ITEM_COMPONENT_TYPES_TOKEN, ItemComponentTypes);
  container.registerInstance(
    ENTITY_COMPONENT_TYPES_TOKEN,
    EntityComponentTypes,
  );
  container.registerInstance(EQUIPMENT_SLOT_TOKEN, EquipmentSlot);
  container.registerInstance(
    ITEM_ENCHANTABLE_COMPONENT_TOKEN,
    ItemEnchantableComponent,
  );
  container.registerInstance(ITEM_STACK_TOKEN, ItemStack);
  container.registerInstance(ENTITY_DAMAGE_CAUSE_TOKEN, EntityDamageCause);
}
