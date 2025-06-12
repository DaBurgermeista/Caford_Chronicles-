import assert from 'node:assert';
import { test } from 'node:test';
import { player } from '../player.js';

// Stub functions that may be called by game logic
global.renderStatsToModal = () => {};
global.renderEquipped = () => {};
global.renderInventory = () => {};

// Helper functions to mimic equipping logic from game.js
function equip(itemId) {
  const invEntry = player.inventory.find(e => e.id === itemId);
  if (!invEntry) throw new Error('Item not in inventory');
  invEntry.quantity -= 1;
  if (invEntry.quantity <= 0) {
    player.inventory = player.inventory.filter(e => e.id !== itemId);
  }
  player.equipment['main-hand'] = itemId;
}

function unequip(itemId) {
  if (player.equipment['main-hand'] === itemId) {
    player.equipment['main-hand'] = null;
    const existing = player.inventory.find(e => e.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      player.inventory.push({ id: itemId, quantity: 1 });
    }
  }
}

test('equip and unequip item updates inventory and equipment', () => {
  const itemId = 'iron_sword';
  const entry = player.inventory.find(i => i.id === itemId);
  const originalQty = entry ? entry.quantity : 0;

  equip(itemId);
  const afterEquip = player.inventory.find(i => i.id === itemId);
  const equipQty = afterEquip ? afterEquip.quantity : 0;

  unequip(itemId);

  assert.strictEqual(player.equipment['main-hand'], null);
  const after = player.inventory.find(i => i.id === itemId);
  assert.strictEqual(after.quantity, equipQty + 1);
  assert.strictEqual(after.quantity, originalQty);
});
