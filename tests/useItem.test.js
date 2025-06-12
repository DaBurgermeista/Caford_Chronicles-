import assert from 'node:assert';
import { test } from 'node:test';
import { player } from '../player.js';
import { useItem } from '../itemUtils.js';

// Stub UI functions for tests
global.renderHud = () => {};
global.renderInventory = () => {};
global.log = () => {};

test('using healing potion restores hp and reduces quantity', () => {
  const entry = player.inventory.find(i => i.id === 'healing_potion');
  const originalQty = entry ? entry.quantity : 0;
  const originalHp = player.derivedStats.hp;
  // Lower HP to test healing
  player.derivedStats.hp = Math.max(0, originalHp - 10);

  useItem('healing_potion');

  const expectedHp = Math.min(originalHp - 10 + 20, player.derivedStats.maxHp);
  assert.strictEqual(player.derivedStats.hp, expectedHp);
  const newEntry = player.inventory.find(i => i.id === 'healing_potion');
  const newQty = newEntry ? newEntry.quantity : 0;
  assert.strictEqual(newQty, originalQty - 1);

  // cleanup
  if (newEntry) {
    newEntry.quantity += 1;
  } else {
    player.inventory.push({ id: 'healing_potion', quantity: 1 });
  }
  player.derivedStats.hp = originalHp;
});
