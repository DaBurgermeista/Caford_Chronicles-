import assert from 'node:assert';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { player as basePlayer } from '../player.js';
import { items } from '../items.js';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadRenderEquipped(context) {
  const code = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../game.js'), 'utf8');
  const start = code.indexOf('export function renderEquipped');
  const open = code.indexOf('{', start);
  let count = 1;
  let i = open + 1;
  while (count > 0 && i < code.length) {
    if (code[i] === '{') count++;
    else if (code[i] === '}') count--;
    i++;
  }
  const snippet = code.slice(start, i);
  const funcCode = snippet.replace('export ', '');
  const script = new vm.Script(`${funcCode}; renderEquipped;`);
  return script.runInContext(vm.createContext(context));
}

test('clicking empty slot after unequipping does not trigger the context menu', () => {
  const dom = new JSDOM(`<span id="slot-main-hand">None</span>
    <span id="slot-off-hand">None</span>
    <span id="slot-head">None</span>
    <span id="slot-chest">None</span>
    <span id="slot-accessory">None</span>
    <div id="tooltip"></div>`);
  global.document = dom.window.document;
  global.window = dom.window;
  global.items = items;
  global.player = JSON.parse(JSON.stringify(basePlayer));
  global.isDragging = false;
  let opened = false;
  global.openContextMenu = () => { opened = true; };
  global.showTooltip = () => {};
  global.hideTooltip = () => {};

  const context = { player, items, document: dom.window.document, isDragging, openContextMenu, showTooltip, hideTooltip };
  const renderEquipped = loadRenderEquipped(context);

  // Equip an item first to attach handlers
  player.equipment["main-hand"] = "iron_sword";
  renderEquipped();

  // Unequip the item
  player.equipment["main-hand"] = null;
  renderEquipped();

  const span = document.getElementById('slot-main-hand');
  span.dispatchEvent(new dom.window.Event('click'));

  assert.strictEqual(opened, false);
});

test('slot span resets to "None" and has no lingering click handler', () => {
  const dom = new JSDOM(`<span id="slot-main-hand">None</span>
    <span id="slot-off-hand">None</span>
    <span id="slot-head">None</span>
    <span id="slot-chest">None</span>
    <span id="slot-accessory">None</span>
    <div id="tooltip"></div>`);
  global.document = dom.window.document;
  global.window = dom.window;
  global.items = items;
  global.player = JSON.parse(JSON.stringify(basePlayer));
  global.isDragging = false;
  let opened = false;
  global.openContextMenu = () => { opened = true; };
  global.showTooltip = () => {};
  global.hideTooltip = () => {};

  const context = { player, items, document: dom.window.document, isDragging, openContextMenu, showTooltip, hideTooltip };
  const renderEquipped = loadRenderEquipped(context);

  player.equipment["main-hand"] = "iron_sword";
  renderEquipped();

  player.equipment["main-hand"] = null;
  renderEquipped();

  const span = document.getElementById('slot-main-hand');
  assert.strictEqual(span.textContent, 'None');
  span.dispatchEvent(new dom.window.Event('click'));

  assert.strictEqual(opened, false);
});
