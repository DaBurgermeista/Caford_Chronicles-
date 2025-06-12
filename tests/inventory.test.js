import assert from 'node:assert';
import { test } from 'node:test';
import { player } from '../player.js';
import { addItem, removeItem } from '../items.js';

// items.js expects a global `player` object
global.player = player;

test('addItem increases quantity of healing potion', () => {
  const item = player.inventory.find(i => i.id === 'healing_potion');
  const original = item ? item.quantity : 0;
  addItem('healing_potion', 1);
  const updated = player.inventory.find(i => i.id === 'healing_potion');
  assert.strictEqual(updated.quantity, original + 1);
  removeItem('healing_potion', 1);
});
