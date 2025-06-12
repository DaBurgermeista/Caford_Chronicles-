import assert from 'node:assert';
import { test } from 'node:test';
import { player } from '../player.js';
import { items } from '../items.js';
import { getEquippedWeapon } from '../equipment.js';

// Ensure inventory and equipment resetting
const original = player.equipment["main-hand"];

test('returns item object when equipment slot stores id string', () => {
  player.equipment["main-hand"] = 'iron_sword';
  const weapon = getEquippedWeapon();
  assert.strictEqual(weapon, items['iron_sword']);
});

test('returns item object when equipment slot stores object', () => {
  player.equipment["main-hand"] = items['iron_sword'];
  const weapon = getEquippedWeapon();
  assert.strictEqual(weapon, items['iron_sword']);
});

// restore original value
player.equipment["main-hand"] = original;
