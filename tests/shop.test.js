import assert from 'node:assert';
import { test } from 'node:test';
import { player } from '../player.js';
import { buyItem, sellItem } from '../shops.js';
import { items } from '../items.js';
import { addItem, removeItem } from '../items.js';

global.renderHud = () => {};
global.renderInventory = () => {};
global.player = player;

test('buying item decreases gold and adds item', () => {
  const cost = 8;
  const startGold = player.gold;
  const qty = player.inventory.find(i => i.id === 'healing_potion')?.quantity || 0;
  buyItem('healing_potion', cost);
  assert.strictEqual(player.gold, startGold - cost);
  const newQty = player.inventory.find(i => i.id === 'healing_potion').quantity;
  assert.strictEqual(newQty, qty + 1);
  // cleanup
  removeItem('healing_potion', 1);
  player.gold = startGold;
});

test('selling item increases gold and removes item', () => {
  addItem('healing_potion', 1);
  const price = Math.floor(items['healing_potion'].value * 0.5);
  const startGold = player.gold;
  const qty = player.inventory.find(i => i.id === 'healing_potion').quantity;
  sellItem('healing_potion', price);
  assert.strictEqual(player.gold, startGold + price);
  const after = player.inventory.find(i => i.id === 'healing_potion');
  const newQty = after ? after.quantity : 0;
  assert.strictEqual(newQty, qty - 1);
  // cleanup
  player.gold = startGold + price - price; // revert
});
