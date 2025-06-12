export const shops = {
  general_goods: {
    id: 'general_goods',
    name: 'General Goods',
    buyMultiplier: 1.0,
    sellMultiplier: 0.5,
    inventory: [
      { id: 'healing_potion', price: 8 },
      { id: 'mana_draught', price: 10 },
      { id: 'silver_leaf', price: 5 }
    ]
  },
  blacksmith: {
    id: 'blacksmith',
    name: 'Blacksmith',
    buyMultiplier: 1.0,
    sellMultiplier: 0.5,
    inventory: [
      { id: 'iron_sword', price: 12 },
      { id: 'leather_armor', price: 18 },
      { id: 'iron_helm', price: 10 }
    ]
  }
};

import { player } from './player.js';
import { items, addItem, removeItem } from './items.js';

let currentShop = null;

export function openShop(shopId) {
  currentShop = shops[shopId];
  if (!currentShop) return;
  const modal = document.getElementById('shop-modal');
  document.getElementById('shop-name').textContent = currentShop.name;
  renderShop();
  modal.classList.remove('hidden');
}

export function closeShop() {
  document.getElementById('shop-modal').classList.add('hidden');
  currentShop = null;
}

function buyItem(itemId, price) {
  if (player.gold < price) {
    alert('Not enough gold!');
    return;
  }
  player.gold -= price;
  addItem(itemId, 1);
  if (typeof globalThis.renderHud === 'function') globalThis.renderHud();
  if (typeof globalThis.renderInventory === 'function') globalThis.renderInventory();
  renderShop();
}

function sellItem(itemId, price) {
  const entry = player.inventory.find(i => i.id === itemId);
  if (!entry) return;
  removeItem(itemId, 1);
  player.gold += price;
  if (typeof globalThis.renderHud === 'function') globalThis.renderHud();
  if (typeof globalThis.renderInventory === 'function') globalThis.renderInventory();
  renderShop();
}

function renderShop() {
  if (!currentShop) return;
  const list = document.getElementById('shop-items');
  list.innerHTML = '';
  currentShop.inventory.forEach(({ id, price }) => {
    const item = items[id];
    if (!item) return;
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${price}g`;
    const btn = document.createElement('button');
    btn.textContent = 'Buy';
    btn.addEventListener('click', () => buyItem(id, price));
    li.appendChild(btn);
    list.appendChild(li);
  });

  const sellList = document.getElementById('sell-items');
  sellList.innerHTML = '';
  player.inventory.forEach(entry => {
    const item = items[entry.id];
    if (!item) return;
    const price = Math.floor(item.value * (currentShop.sellMultiplier || 0.5));
    const li = document.createElement('li');
    li.textContent = `${item.name} x${entry.quantity} - ${price}g`;
    const btn = document.createElement('button');
    btn.textContent = 'Sell';
    btn.addEventListener('click', () => sellItem(entry.id, price));
    li.appendChild(btn);
    sellList.appendChild(li);
  });
}

export { buyItem, sellItem, renderShop };
