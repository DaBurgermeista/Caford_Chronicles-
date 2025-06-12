import { player } from './player.js';
import { items } from './items.js';

export function useItem(itemId) {
  const item = items[itemId];
  if (!item || item.type !== 'consumable') {
    console.warn(`Item ${itemId} cannot be used.`);
    return false;
  }

  const invEntry = player.inventory.find(entry => entry.id === itemId);
  if (!invEntry) {
    console.warn(`Item ${itemId} not found in inventory.`);
    return false;
  }

  invEntry.quantity -= 1;
  if (invEntry.quantity <= 0) {
    player.inventory = player.inventory.filter(entry => entry.id !== itemId);
  }

  if (item.effects) {
    item.effects.forEach(effect => {
      switch (effect.type) {
        case 'heal':
          player.derivedStats.hp = Math.min(
            player.derivedStats.hp + effect.amount,
            player.derivedStats.maxHp
          );
          break;
        case 'restore_mp':
          player.derivedStats.mp = Math.min(
            player.derivedStats.mp + effect.amount,
            player.derivedStats.maxMp
          );
          break;
      }
    });
  }

  if (typeof globalThis.renderHud === 'function') {
    globalThis.renderHud();
  }
  if (typeof globalThis.renderInventory === 'function') {
    globalThis.renderInventory();
  }
  if (typeof globalThis.log === 'function') {
    const name = item.name || itemId;
    globalThis.log(`Used ${name}.`);
  }

  return true;
}
