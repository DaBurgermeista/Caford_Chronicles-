import { player } from './player.js';
import { items } from './items.js';

export function getEquippedWeapon() {
  const slotVal = player.equipment["main-hand"];
  if (!slotVal) return null;
  return typeof slotVal === 'string' ? items[slotVal] : slotVal;
}
