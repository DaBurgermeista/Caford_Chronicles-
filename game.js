import { player, applyItemEffects, removeItemEffects } from './player.js';
console.log("Loaded player:", player);
import { locations } from './location.js';
console.log("Loaded locations:", locations);
import { items } from './items.js';
console.log("Loaded items:", items);
import { useItem } from './itemUtils.js';
import { getEquippedWeapon } from './equipment.js';
import { enemies } from './enemy.js';
console.log("Loaded enemies:", enemies);
import { talkToNpc, closeNpcModal } from './npc.js';
import { npcs } from './npcs.js';
import { openShop, closeShop } from './shops.js';
import { getAllEntries, unlockJournalEntry, getUnlockedEntries } from './journal.js';

let activeJournalCategory = 'all';
let currentEnemy = null; // Initialize current enemy

function saveGame() {
  try {
    localStorage.setItem('saveGame', JSON.stringify(player));
    log('Game saved.', { type: 'info' });
  } catch (e) {
    alert('Failed to save game.');
  }
}

function loadSavedGame() {
  const data = localStorage.getItem('saveGame');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      Object.assign(player, parsed);
    } catch (e) {
      console.error('Failed to load save', e);
    }
  }
}

window.closeNpcModal = closeNpcModal;
window.talkToNpc = talkToNpc;

// functionality
let isDragging = false; // Track if an item is being dragged
let lastFocusedElement = null;

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.classList.remove('hidden');
  modal.focus();
}

function closeModal(modal) {
  modal.classList.add('hidden');
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function showPrologue() {
  const modal = document.getElementById('prologue-modal');
  const btn = document.getElementById('prologue-close');
  if (!modal || !btn) return;
  btn.addEventListener('click', () => closeModal(modal), { once: true });
  openModal(modal);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const isLoad = params.get('load') === '1';
  if (isLoad) {
    loadSavedGame();
  }

  setupSidebar();
  setupStatsModal();
  renderHud();
  renderLocation();
  renderDestinationSidebar();
  renderInventory();

  if (!isLoad) {
    showPrologue();
  }

  // Grab saved options in localstorage
  const savedScale = localStorage.getItem('uiScale') || '1';
  applyUIScale(savedScale);

  // Setup listeners for combat actions
  const combatActions = document.querySelector('.combat-actions');
  combatActions.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action) {
      playerAction(action);
    }

  });

  makeDraggable(document.getElementById('combat-wrapper'));
  makeDraggable(document.getElementById('player-stats-wrapper'));
  makeDraggable(document.getElementById('npc-modal'));
  makeDraggable(document.getElementById('stats-modal'));
  makeDraggable(document.getElementById('inventory-modal'), '.drag-handle');
  makeDraggable(document.getElementById('shop-modal'), '.drag-handle');

  document.querySelectorAll(".journal-tab").forEach(button => {
    button.addEventListener("click", () => {
      activeJournalCategory = button.dataset.category;

      // Clear current active state
      document.querySelectorAll(".journal-tab").forEach(btn =>
        btn.classList.remove("active")
      );

      // Set new active
      button.classList.add("active");

      renderJournal();
    });
  });

  document.getElementById('options-modal').addEventListener('click', (e) => {
    if (e.target.id === 'options-modal') {
      closeModal(e.currentTarget);
    }
  });

});


function setupSidebar() {
  const sidebar = document.querySelector('.sidebar-wrapper');
  const sidebarR = document.querySelector('.sidebar-right');
  const tab = document.querySelector('.sidebar-tab');

  if (!sidebar || !tab) return;

  const menuDefinitions = [
    { label: "Stats", handler: openStats },
    { label: "Inventory", handler: openInventory },
    { label: "Quests", handler: openQuests },
    { label: "Save Game", handler: saveGame },
    { label: "Settings", handler: openSettings },
    { label: "Journal", handler: openJournal },
  ];

  const sidebarList = document.querySelector(".sidebar ul");
  sidebarList.innerHTML = "";

  menuDefinitions.forEach(({ label, handler }) => {
    const li = document.createElement("li");
    li.textContent = label;
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.addEventListener("click", handler);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
    sidebarList.appendChild(li);
  });

  // Toggle button
  tab.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebarR.classList.toggle('hidden');
    tab.textContent = sidebar.classList.contains('hidden') ? 'TAB' : 'CLOSE';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      sidebar.classList.toggle('hidden');
      sidebarR.classList.toggle('hidden');
      tab.textContent = sidebar.classList.contains('hidden') ? 'TAB' : 'CLOSE';
    }
  });

  // Close button on journal modal
  document.getElementById("close-journal").addEventListener("click", closeJournal);
}


function openStats() {
  const modal = document.getElementById("stats-modal");
  openModal(modal);
}

function closeStats() {
  closeModal(document.getElementById("stats-modal"));
}

function openInventory() {
  openModal(document.getElementById("inventory-modal"));
}

function closeInventory() {
  closeModal(document.getElementById("inventory-modal"));
}

function openQuests() {
  log("Quests system coming soon!");
}

function openSettings() {
  openModal(document.getElementById('options-modal'));
}

function closeSettings() {
  closeModal(document.getElementById('options-modal'));
}


function renderDestinationSidebar() {
  const current = locations[player.location];
  const list = document.getElementById('destination-list');
  list.innerHTML = ''; // Clear previous

  current.connections.forEach(dest => {
    const li = document.createElement('li');
    li.textContent = dest;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.addEventListener('click', () => {
      if (player.inCombat) return;
      player.location = dest;
      renderLocation();
      renderDestinationSidebar();  // refresh right sidebar
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
    list.appendChild(li);
  });
}


function setupStatsModal() {
  const statsBtn = document.querySelector('.sidebar li:nth-child(1)'); // or use text match
  const modal = document.getElementById('stats-modal');
  const closeBtn = document.getElementById('close-stats');

  statsBtn.addEventListener('click', () => {
    renderStatsToModal();
    openStats();
  });

  closeBtn.addEventListener('click', closeStats);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeStats();
  });
}

export function renderStatsToModal() {
  // Core Attributes
  document.getElementById('modal-str').textContent = player.coreStats.strength;
  document.getElementById('modal-dex').textContent = player.coreStats.dexterity;
  document.getElementById('modal-con').textContent =
    player.coreStats.constitution;
  document.getElementById('modal-int').textContent =
    player.coreStats.intelligence;
  document.getElementById('modal-wis').textContent = player.coreStats.wisdom;
  document.getElementById('modal-cha').textContent = player.coreStats.charisma;

  // Derived Stats
  document.getElementById('modal-hp').textContent = player.derivedStats.hp;
  document.getElementById('modal-maxhp').textContent =
    player.derivedStats.maxHp;
  document.getElementById('modal-mp').textContent = player.derivedStats.mp;
  document.getElementById('modal-maxmp').textContent =
    player.derivedStats.maxMp;
  document.getElementById('modal-armor').textContent =
    player.derivedStats.armor;
  document.getElementById(
    'modal-crit'
  ).textContent = `${player.derivedStats.critChance}%`;
  document.getElementById('modal-level').textContent = player.level;
  document.getElementById('modal-xp').textContent = player.xp;
  document.getElementById('modal-xp-next').textContent =
    player.xpToNext;
  document.getElementById('modal-gold').textContent = player.gold;
  document.getElementById('modal-weight').textContent = player.progression.encumbrance.weight;
  document.getElementById('modal-max-weight').textContent =
    player.progression.encumbrance.maxWeight;
}

export function renderHud() {
  document.getElementById('hud-hp').textContent = player.derivedStats.hp;
  document.getElementById('hud-maxhp').textContent = player.derivedStats.maxHp;
  document.getElementById('hud-mp').textContent = player.derivedStats.mp;
  document.getElementById('hud-maxmp').textContent = player.derivedStats.maxMp;
  document.getElementById('hud-gold').textContent = player.gold;
}

function updateStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderLocation() {
  const locationData = locations[player.location];
  console.log("Current location:", player.location);
  console.log("All locations:", Object.keys(locations));
  unlockJournalEntry(locationData.id)

  const npcList = locationData.npcs || [];
  const npcHTML = npcList.map(id => {
    const npc = npcs[id];
    if (!npc) {
      console.warn(`Missing NPC definition for ID: ${id}`);
      return '';
    }
    return `<span class="location-npc-item" onclick="talkToNpc('${id}')">${npc.name}</span>`;
  }).filter(Boolean).join(", ");

  renderNpcSidebar(locationData.npcs || []);

  document.body.className = ''; // Clear old theme
  if (locationData.theme === 'forest') {
    document.body.classList.add('forest-theme');
  } else if (locationData.theme === 'ruins') {
    document.body.classList.add('ruins-theme');
  } else if (locationData.theme === 'town') {
    document.body.classList.add('town-theme');
  }

  // HUD
  document.querySelector('.location').textContent = `📍 ${locationData.name}`;

  // Title & description
  document.getElementById('location-name').textContent = locationData.name;
  document.getElementById('location-description').textContent = locationData.description;

  // Image or ASCII art
  const img = document.getElementById('location-image');

  document.getElementById('action-log').innerHTML = ''; // Clear previous actions log
  if (!locationData.discovered){
    log(locationData.discoverText || `You arrive at ${locationData.name}.`);
    locationData.discovered = true; // Mark as discovered
  } else {
    log(locationData.revisitText || `You return to ${locationData.name}.`);
  }

  triggerEventsFor(locationData, 'onEnter'); // Trigger any events for this location

  // Loot
  const locationItemsEl = document.getElementById('location-items');
  locationItemsEl.innerHTML = '';
  locationData.loot.forEach(item => {
    if (!items[item.id]) return;
    const span = document.createElement('span');
    span.className = 'location-loot-item';
    span.dataset.itemid = item.id;
    span.textContent = `${items[item.id].name} (x${item.quantity})`;
    span.addEventListener('click', () => pickUpItem(item.id));
    locationItemsEl.appendChild(span);
  });

  // Destinations
  renderDestinationSidebar();
}



function logToConsole(text) {
  const output = document.getElementById('console-output');
  output.textContent += `\n> ${text}`;
  output.scrollTop = output.scrollHeight;
}

function executeCommand(command) {
  const [cmd, ...args] = command.trim().split(' ');
  const val = parseInt(args[0], 10);

  switch (cmd.toLowerCase()) {
    case 'sethp':
      if (!isNaN(val)) {
        player.derivedStats.hp = val;
        logToConsole(`HP set to ${val}`);
        renderStatsToModal();
        renderHud();
      }
      break;
    case 'addxp':
      if (!isNaN(val)) {
        player.xp += val;
        logToConsole(`Added ${val} XP`);
        renderStatsToModal();
        renderHud();
      }
      break;
    case 'gold':
      if (!isNaN(val)) {
        player.gold += val;
        logToConsole(`Gold increased by ${val}`);
        renderStatsToModal();
        renderHud();
      }
      break;
    case 'help':
      logToConsole(
        `Available commands: sethp [num], addxp [num], gold [num], travel [loc]`
      );
      break;
    case 'travel':
      const dest = args.join(' ');
      const available = locations[player.location].connections;
      if (available.includes(dest)) {
        player.location = dest;
        logToConsole(`Traveled to ${dest}`);
        renderLocation();
      } else {
        logToConsole(`You can't go to "${dest}" from here.`);
      }
      break;
    default:
      logToConsole(`Unknown command: ${cmd}`);
  }
}

document.querySelectorAll('.equipped-gear li').forEach(slotEl => {
  const slotType = slotEl.textContent.split(':')[0].toLowerCase(); // e.g., "main-hand"

  slotEl.dataset.slot = slotType;

  slotEl.addEventListener("dragover", (e) => {
    e.preventDefault(); // required to allow drop
    slotEl.classList.add("dragover");
  });

  slotEl.addEventListener("dragleave", () => {
    slotEl.classList.remove("dragover");
  });

  slotEl.addEventListener("drop", (e) => {
    e.preventDefault();
    slotEl.classList.remove("dragover");

    const itemId = e.dataTransfer.getData("text/plain");
    const item = items[itemId]; // look up full item data
    if (item && item.slot === slotType) {
      equipItemToSlot(itemId, slotType);
    }
  });
});

// Allow unequipping by dropping onto the inventory list
const inventoryListEl = document.getElementById('inventory-list');
inventoryListEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  inventoryListEl.classList.add('dragover');
});
inventoryListEl.addEventListener('dragleave', () => {
  inventoryListEl.classList.remove('dragover');
});
inventoryListEl.addEventListener('drop', (e) => {
  e.preventDefault();
  inventoryListEl.classList.remove('dragover');

  const fromSlot = e.dataTransfer.getData('slot');
  const itemId = e.dataTransfer.getData('text/plain');
  if (fromSlot && itemId) {
    handleItemAction('unequip', itemId);
  }
});

function equipItemToSlot(itemId, slotType) {
  const itemData = items[itemId];
  if (!itemData || itemData.slot !== slotType) return;

  handleItemAction('equip', itemId);
}


export function renderInventory() {
  const list = document.getElementById('inventory-list');
  list.innerHTML = '';
  console.log("Rendering inventory", player.inventory);

  player.inventory.forEach(entry => {
    const item = items[entry.id];
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.dataset.itemId = entry.id; // Store item ID for drag-and-drop
    li.textContent = `${item.icon || ''} ${item.name} × ${entry.quantity}`;
    // Drag behavior
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.id);
      e.currentTarget.classList.add("dragging");
      isDragging = true;
    });

    li.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("dragging");
      isDragging = false;
    });
    list.appendChild(li);

    // Context menu on click
    li.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log(`Clicked on item: ${entry.id}`);
      if (!isDragging){
        openContextMenu(entry.id, e.clientX, e.clientY);
      }
    });

    // Tooltip events
    li.addEventListener("mouseenter", (e) => {
      showTooltip(entry.id, e.clientX, e.clientY); // ✅ fixed here
    });
    li.addEventListener("mouseleave", hideTooltip);
    li.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("tooltip");
      tooltip.style.top = `${e.clientY + 10}px`;
      tooltip.style.left = `${e.clientX + 10}px`;
    });
  });
}


let contextMenuJustOpened = false;

function openContextMenu(itemId, x, y, equipped = false) {
  console.log(`Opening context menu for ${itemId} at (${x}, ${y})`);
  const menu = document.getElementById('context-menu');
  const item = items[itemId];
  menu.innerHTML = '';

  // Determine available actions
  const actions = [];

  if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
    if (equipped){
      actions.push('Unequip');
    } else {
      actions.push('Equip');
    }
  }

  if (item.type === 'consumable') {
    actions.push('Use');
  }

  actions.push('Drop');

  // Add actions to menu
  actions.forEach(action => {
    const li = document.createElement('li');
    li.textContent = action;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.addEventListener('click', () => {
      handleItemAction(action.toLowerCase(), itemId);
      closeContextMenu();
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
    menu.appendChild(li);
  });

  // Position and show
  const modal = document.querySelector('.modal-content');
  const rect = modal.getBoundingClientRect();
  menu.style.top = `${y - rect.top}px`;
  menu.style.left = `${x - rect.left}px`;
  menu.classList.remove('hidden');
  contextMenuJustOpened = true;
  setTimeout(() => {
    contextMenuJustOpened = false;
  }, 350); // Increased delay to 350ms
  console.log(menu, menu.innerHTML); // <-- Add this
}

function closeContextMenu() {
  document.getElementById('context-menu').classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if (contextMenuJustOpened) return;
  const menu = document.getElementById('context-menu');
  // Only close if click is outside the menu itself
  if (!menu.contains(e.target)) {
    closeContextMenu();
  }
});

// Prevent clicks inside the context menu from closing it
document.getElementById('context-menu').addEventListener('mousedown', (e) => {
  e.stopPropagation();
});

function handleItemAction(action, itemId) {
  if (action === 'equip') {
  const item = items[itemId]; // 🔁 Get full item object
  const invEntry = player.inventory.find(entry => entry.id === itemId);

  if (invEntry) {
    invEntry.quantity -= 1;
    if (invEntry.quantity <= 0) {
      player.inventory = player.inventory.filter(entry => entry.id !== itemId);
    }
  }

  const slot = item.slot;
  if (!slot) {
    console.warn(`Item ${item.name} has no equip slot defined.`);
    return;
  }

  // Drop currently equipped item back to inventory, if any
  const equippedId = player.equipment[slot];
  if (equippedId) {
    const existing = player.inventory.find(entry => entry.id === equippedId);
    if (existing) {
      existing.quantity += 1;
    } else {
      player.inventory.push({ id: equippedId, quantity: 1 });
    }
  }

  player.equipment[slot] = itemId;
  applyItemEffects(item); // Apply any effects from the item
  console.log(`Equipped ${item.name} in ${slot} slot`);
  renderStatsToModal();
  renderEquipped();
  renderInventory();

  } else if (action === 'unequip') {
  const item = items[itemId];
  const slot = item.slot;

  const equipped = player.equipment[slot];

  const equippedId = typeof equipped === 'string' ? equipped : equipped?.id;

  if (equippedId === itemId) {
    player.equipment[slot] = null;

    const existing = player.inventory.find(entry => entry.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      player.inventory.push({ id: itemId, quantity: 1 });
    }
    removeItemEffects(item); // Remove any effects from the item
    console.log(`Unequipped ${itemId} from ${slot}`);
    renderStatsToModal();
    renderInventory();
    renderEquipped();
  } else {
    console.warn(`Item ${itemId} not found equipped in ${slot}`);
  }
} else if (action === 'use') {
    console.log(`Using ${itemId}`);
    useItem(itemId);
  } else if (action === 'drop') {
    console.log(`Dropping ${itemId}`);
    // Remove from player inventory
    const invEntry = player.inventory.find(entry => entry.id === itemId);
    if (invEntry) {
      invEntry.quantity -= 1;
      if (invEntry.quantity <= 0) {
        player.inventory = player.inventory.filter(entry => entry.id !== itemId);
      }
    }
    // Add to current location's loot
    const loc = locations[player.location];
    if (loc) {
      // If item already in loot, increment quantity, else add new entry
      let lootEntry = loc.loot.find(entry => entry.id === itemId);
      if (lootEntry) {
        lootEntry.quantity = (lootEntry.quantity || 1) + 1;
      } else {
        loc.loot.push({ id: itemId, quantity: 1 });
      }
    }
    renderInventory();
    renderLocation();
  }
}

export function renderEquipped() {
  const slots = {
    "main-hand": player.equipment["main-hand"],
    "off-hand": player.equipment["off-hand"],
    "head": player.equipment["head"],
    "chest": player.equipment["chest"],
    "accessory": player.equipment["accessory"]
  };

  console.log("Rendering equipped items", slots);

  for (const [slot, rawItem] of Object.entries(slots)) {
    const oldSpan = document.getElementById(`slot-${slot}`);
    const newSpan = document.createElement('span');
    newSpan.id = `slot-${slot}`;

    const idStr = typeof rawItem === 'string' ? rawItem : rawItem?.id;
    const item = idStr ? items[idStr] : null;

    if (item) {
      newSpan.textContent = item.name;
      newSpan.classList.add('equipped-item');
      newSpan.setAttribute('draggable', 'true');
      newSpan.dataset.itemId = idStr;
      newSpan.dataset.slot = slot;

      newSpan.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', idStr);
        e.dataTransfer.setData('slot', slot);
        e.currentTarget.classList.add('dragging');
        isDragging = true;
      });

      newSpan.addEventListener('dragend', (e) => {
        e.currentTarget.classList.remove('dragging');
        isDragging = false;
      });

      newSpan.addEventListener('click', (e) => {
        openContextMenu(idStr, e.clientX, e.clientY, true);
      });

      newSpan.addEventListener('mouseenter', (e) => {
        showTooltip(idStr, e.clientX, e.clientY);
      });
      newSpan.addEventListener('mouseleave', hideTooltip);
      newSpan.addEventListener('mousemove', (e) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.left = `${e.clientX + 10}px`;
      });
    } else {
      newSpan.textContent = 'None';
    }

    oldSpan.replaceWith(newSpan);
  }
}

// ==== Vars for Dev Console ==== //
const consoleEl = document.getElementById('dev-console');
const consoleInput = document.getElementById('console-input');

// Toggle dev console with backtick (`) and delay focus
document.addEventListener('keydown', (e) => {
  if (e.key === '`') {
    e.preventDefault();
    const wasHidden = consoleEl.classList.contains('hidden');
    consoleEl.classList.toggle('hidden');

    if (wasHidden) {
      setTimeout(() => {
        consoleInput.value = '';
        consoleInput.focus();
      }, 50);
    }
  }
});

// Run command on Enter key
consoleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    executeCommand(consoleInput.value.trim());
    consoleInput.value = '';
  }
});

document.getElementById('open-inventory').addEventListener('click', () => {
  openInventory();
  renderInventory();
  renderEquipped();
  renderStatsToModal();
});

document.getElementById('close-shop').addEventListener('click', closeShop);

document.getElementById('close-inventory').addEventListener('click', closeInventory);

function pickUpItem(itemId) {
  const loc = locations[player.location];
  const lootEntry = loc.loot.find(entry => entry.id === itemId);
  if (!lootEntry) return;

  // Add to player inventory
  let invEntry = player.inventory.find(entry => entry.id === itemId);
  if (invEntry) {
    invEntry.quantity += 1;
  } else {
    player.inventory.push({ id: itemId, quantity: 1 });
  }

  // Remove from location loot
  lootEntry.quantity -= 1;
  if (lootEntry.quantity <= 0) {
    loc.loot = loc.loot.filter(entry => entry.id !== itemId);
  }

  renderInventory();
  renderLocation();
}

function showTooltip(itemId, x, y) {
  console.log(`Showing tooltip for: ${itemId}`);
  const tooltip = document.getElementById('tooltip');
  const item = items[itemId];
  document.getElementById('tooltip-damage').textContent = '';

  if (!item) return;

  document.getElementById('tooltip-name').innerHTML = `<span style="color:#fff1a8">${item.name}</span>`;

  if (item.type === 'weapon') {
    document.getElementById('tooltip-damage').textContent = `Damage: ${item.damage ? `${item.damage[0]} - ${item.damage[1]}` : ''}`;
  }
  document.getElementById('tooltip-description').textContent = item.description || 'No description.';
  document.getElementById('tooltip-type').textContent = `Type: ${item.type || 'Unknown'}`;
  document.getElementById('tooltip-value').textContent = `Value: ${item.value || 0} Gold`;

  let flavorP = tooltip.querySelector('#tooltip-flavor');

  if (flavorP) {
    flavorP.remove();
  }

  if (!flavorP && item.flavor) {
    flavorP = document.createElement("p");
    flavorP.id = "tooltip-flavor";
    flavorP.className = "tooltip-line";
    flavorP.innerHTML = `<em>"${item.flavor}"</em>`;
    tooltip.appendChild(flavorP);
  }

  tooltip.style.top = `${y + 10}px`;
  tooltip.style.left = `${x + 10}px`;
  tooltip.classList.remove('hidden');
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.classList.add('hidden');
}

document.getElementById('explore-button').addEventListener('click', () => {
  handleExplore();
})

function handleExplore() {
  if (player.inCombat){
    return;
  }

  const locationID = player.location;
  const current = locations[locationID];

  const eventTriggered = triggerEventsFor(current, 'onExplore');

  if (eventTriggered) return;

  // Exploration Flavor text
  const explorationFlavors = current.flavorTexts || [
    "You feel something watching you from the shadows.",
    "Cobwebs tangle the path ahead. You step carefully.",
    "You brush by some damp foilage, eyes alert for signs of life."
  ];
  log(explorationFlavors[Math.floor(Math.random() * explorationFlavors.length)]);

  // 15% chance to find a small item
  if (Math.random() < 0.15 && current.loot && current.loot.length > 0) {
    const lootID = current.loot[Math.floor(Math.random() * current.loot.length)];
    const lootItem = items[lootID];

    if (lootItem) {
      player.inventory.push({ id: lootID, quantity: 1 });
      log(`You find a ${lootItem.name}`);
      renderInventory();
      return;
    }
  }

  // 20% chance to trigger combat
  if (Math.random() < 0.2 && current.hostiles && current.hostiles.length > 0) {
    let eligibleEnemies = current.hostiles
      .map(id => enemies[id])
      .filter(enemy => enemy && (enemy.level <= player.level + 1));

    // Fallback if no eligible enemies found
    if (eligibleEnemies.length === 0) {
      eligibleEnemies = current.hostiles.map(id => enemies[id]);
    }

    const selectedEnemy = eligibleEnemies[Math.floor(Math.random() * eligibleEnemies.length)];

    if (selectedEnemy) {
      startCombat(selectedEnemy);
      return;
    }
  }

  // If no combat either
  log("🌿 You explore but you find nothing else of note this time.");
  
}

player.inCombat = false;

function startCombat(enemy) {
  player.inCombat = true;
  currentEnemy = structuredClone(enemy); // Clone to avoid modifying original
  updateCombatUI(enemy);
  showCombatUI();
  log(`⚔️ A wild ${currentEnemy.name} appears!`);
  logCombat("You ready your weapon and prepare for battle!");
}

function playerAction(type) {
  switch (type) {
    case 'attack': {
      // logCombat(`🗡️ You attack the enemy!`);

      let weapon = getEquippedWeapon(); // always use this now
      let weaponDamage = 0;
      let rawDamage = 0;

      const isCrit = Math.random() < player.derivedStats.critChance / 100;
      const strMod = (player.coreStats.strength - 10) / 2;
      const dexMod = (player.coreStats.dexterity - 10) / 2;

      console.log(weapon);
      console.log(`Crit chance: ${player.derivedStats.critChance}%`);
      console.log(`strMod: ${strMod}`);

      if (weapon) {
        console.log(`Using weapon: ${weapon.name}`);
        const [min, max] = weapon.damage;
        weaponDamage = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`Weapon damage range: ${min} - ${max}`);
        console.log(`Calculated weapon damage: ${weaponDamage}`);
      } else {
        weaponDamage = Math.floor(Math.random() * 2) + 1;
        console.log("🛑 No weapon equipped, using base damage 1-2");
      }

      // Apply correct modifier
      if (weapon && weapon.tags && weapon.tags.includes("light")) {
        rawDamage = weaponDamage + dexMod;
        console.log(`Using dexterity mod for Light weapon: ${rawDamage}`);
      } else {
        rawDamage = weaponDamage + strMod;
        console.log(`Raw damage after weapon and strength mod: ${rawDamage}`);
      }

      // Crit bonus
      if (isCrit) {
        rawDamage += player.derivedStats.critDamage / 100 * rawDamage;
        logCombat(`Critical Hit! Damage: ${Math.floor(rawDamage)}`);
      }
      
      // Check to see if the enemy can evade
      const evadeChance = currentEnemy.stats.evasion || 0;
      if (Math.random() < evadeChance) {
        logCombat(`You miss the ${currentEnemy.name}`);
        return; // Exit if the attack was evaded
      }

      // Check if the enemy has armor
      const enemyArmor = currentEnemy.stats.armor || 0;
      if (enemyArmor > 0) {
        const effectiveDamage = Math.max(rawDamage - enemyArmor, 0); // Ensure damage doesn't go below 0
        if (effectiveDamage <= 0) {
          logCombat(`You hit the ${currentEnemy.name} but don't seem to do any damage!`);
          return; // Exit if no damage was dealt
        } else {
          // logCombat(`🛡️ ${currentEnemy.name} has armor! Effective damage: ${effectiveDamage}`);
          currentEnemy.stats.hp -= effectiveDamage;
          logCombat(`Hit: ${currentEnemy.name} takes ${effectiveDamage} damage!`);
        }
      } else {
        logCombat(`Hit: ${currentEnemy.name} takes ${rawDamage} damage!`);
        currentEnemy.stats.hp -= rawDamage
      }
      // Update combat UI and enemy HP bar
      updateCombatUI(currentEnemy);
      updateEnemyHPBar(currentEnemy);

      if (currentEnemy.stats.hp <= 0) {
        log(`You defeated ${currentEnemy.name}!`);
        // award XP
        player.xp += currentEnemy.xpReward || 0;
        log(`You gain ${currentEnemy.xpReward || 0} XP!`);
        // award gold
        const goldReward = currentEnemy.goldReward || [0, 0];
        const goldAmount = Math.floor(Math.random() * (goldReward[1] - goldReward[0] + 1)) + goldReward[0];
        player.gold += goldAmount;
        logCombat(`You find ${goldAmount} gold on the ${currentEnemy.name}.`);
        player.progression.kills += 1; // Increment kill count

        if (currentEnemy.loot && currentEnemy.loot.length > 0){
          const loc = locations[player.location];

          currentEnemy.loot.forEach(drop => {
            const chance = drop.chance || 0;
            if (Math.random() < chance) {
              const amount = drop.amount
                ? Array.isArray(drop.amount)
                  ? Math.floor(Math.random() * (drop.amount[1] - drop.amount[0] + 1)) + drop.amount[0]
                  : drop.amount
                : 1;
              
              // Add to locations loot
              const existing = loc.loot.find(entry => entry.id === drop.id);
              if (existing) {
                existing.quantity = (existing.quantity || 1) + amount;
              } else {
                loc.loot.push({ id: drop.id, quantity: amount});
              }

              log(`The ${currentEnemy} dropped ${amount} × ${drop.id.replace('_', ' ')}.`);
            }
          });
        }
        renderHud();
        renderStatsToModal();

        unlockJournalEntry(currentEnemy.id);
        // Remove enemy from combat
        currentEnemy = null;
        // Hide combat UI 
        endCombat();
      }

      break;
    }
    case 'skill':
      logCombat("🔥 You prepare a skill... (not implemented)");
      break;
    case 'item':
      logCombat("🧪 You reach for an item... (not implemented)");
      break;
    case 'flee':
      logCombat("🏃 You attempt to flee... (not implemented)");
      break;
    default:
      logCombat("🤔 Unknown action.");
  }

  // Next: enemyTurn() would go here
}

function endCombat() {
  document.getElementById('combat-ui').classList.add('hidden');
  document.getElementById('combat-actions').classList.add('hidden');
  document.getElementById('combat-log').classList.add('hidden');
  document.getElementById('player-panel').classList.add('hidden');
  logCombat("🛑 Combat has ended.");
  player.inCombat = false;
}


function logCombat(message) {
  const logBox = document.getElementById('combat-log');
  const entry = document.createElement('p');
  entry.textContent = message;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight; // Auto-scroll
}

export function log(message, options = {}) {
  const logBox = document.getElementById('action-log');
  if (!logBox) {
    console.warn("logBox element not found.");
    return;
  }

  // Optional Timestamp
  const showTime = options.timestamp ?? false;
  const maxEntries = options.maxEntries ?? 100;

  const entry = document.createElement('p');
  entry.className = 'log-entry';

  // Build Message
  const time = new Date().toLocaleTimeString();
  entry.textContent = showTime ? `[${time}] ${message}` : message;

  // Optional color class
  if (options.type) {
    entry.classList.add(`log-${options.type}`);
  }

  logBox.appendChild(entry);

  // Remove old entries if needed
  while (logBox.children.length > maxEntries) {
    logBox.removeChild(logBox.firstChild);
  }

  logBox.scrollTop = logBox.scrollHeight; // Auto-scroll
}

function showCombatUI() {
  document.getElementById('combat-ui').classList.remove('hidden');
  document.getElementById('combat-actions').classList.remove('hidden');
  document.getElementById('combat-log').innerHTML = ''; // Clear previous log
  document.getElementById('combat-log').classList.remove('hidden');
  document.getElementById('player-panel').classList.remove('hidden');

}

function updateCombatUI(enemy) {
  // Set name and description
  document.getElementById('enemy-name').textContent = enemy.name;
  document.getElementById('enemy-description').textContent = enemy.description;

  // Set ASCII art
  const asciiElem = document.getElementById('enemy-ascii');
  if (asciiElem) {
    asciiElem.textContent = enemy.asciiArt ? enemy.asciiArt.join('\n') : '';
  }
  // Set enemy image
  const enemyImage = document.getElementById('enemy-image');
  if (enemy.image) {
    enemyImage.src = enemy.image;
    enemyImage.classList.remove('hidden');
  } else {
    enemyImage.classList.add('hidden');
  }

  // Update HP bar
  updateEnemyHPBar(enemy);

  // Show the combat UI
  document.getElementById('combat-ui').classList.remove('hidden');
}

function updateEnemyHPBar(enemy) {
  const hpFill = document.getElementById('enemy-hp-fill');
  const percent = (enemy.stats.hp / enemy.stats.maxHp) * 100;
  hpFill.style.width = `${percent}%`;

  const hpText = document.getElementById('enemy-hp-text');
  if (hpText) {
    hpText.textContent = `${enemy.stats.hp} / ${enemy.stats.maxHp}`;
  }
}

function enemyTurn() {
  console.log('Enemy takes its turn!');
  // Implement enemy logic here
  // For now, just log a message
}


export function showStoryEventDialog(title, description, choices) {
  const modal = document.getElementById("story-event-modal");
  const titleElem = document.getElementById("story-event-title");
  const textElem = document.getElementById("story-event-text");
  const choicesContainer = document.getElementById("story-event-choices");

  titleElem.textContent = title;
  textElem.innerHTML = description;
  choicesContainer.innerHTML = ""; // Clear previous

  let postActionText = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      const result = choice.action();
      if (typeof result === 'string') {
        postActionText = result;
      }

      choicesContainer.innerHTML = "";
      if (postActionText) {
        const resultP = document.createElement("p");
        resultP.innerHTML = postActionText;
        resultP.style.marginTop = "1rem";
        resultP.style.color = "#baff5b";
        choicesContainer.appendChild(resultP);
      }

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Close";
      closeBtn.onclick = () => closeModal(modal);
      choicesContainer.appendChild(closeBtn);

      // ✅ Rebind tooltips after dynamic result HTML is added
      bindTooltips(choicesContainer);
    };
    choicesContainer.appendChild(btn);
  });

  openModal(modal);

  // ✅ Initial bind for tooltip-items in description
  bindTooltips(modal);
}

// ✅ Helper function to rebind tooltip listeners
function bindTooltips(root) {
  root.querySelectorAll('.tooltip-item').forEach(el => {
    const itemId = el.dataset.itemid;

    el.addEventListener('mouseenter', (e) => {
      showTooltip(itemId, e.clientX, e.clientY);
    });

    el.addEventListener('mouseleave', hideTooltip);

    el.addEventListener('mousemove', (e) => {
      const tooltip = document.getElementById("tooltip");
      tooltip.style.top = `${e.clientY + 10}px`;
      tooltip.style.left = `${e.clientX + 10}px`;
    });
  });
}


export function triggerEventsFor(location, triggerType) {
  if (!location.events) return false;

  for (const event of location.events) {
    console.log(`Event's here ${event.name}, Chance: ${event.chance}`)
    if (
      event.trigger === triggerType &&
      // !player.progression.completedEvents.includes(event.id) &&
      Math.random() < event.chance
    ) {
      event.effect(player, location);
      console.log(`Event: ${event.name} triggered.`);

      return true; // An event triggered
    }
  }

  return false; // No event triggered
}

function applyUIScale(scale) {
  const container = document.querySelector('.content-row');
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'top left';
  container.style.width = `${100 / scale}%`; // Prevent horizontal cutoff
}

// Hook into Settings option
document.querySelectorAll('.sidebar li').forEach(li => {
  if (li.textContent.trim() === 'Settings') {
    li.addEventListener('click', () => {
      document.getElementById('options-modal').classList.remove('hidden');
      const currentScale = localStorage.getItem('uiScale') || '1';
      document.getElementById('ui-scale').value = currentScale;
    });
  }
});


// Close button for Options Modal
document.getElementById('close-options').addEventListener('click', () => {
  closeSettings();
});

// On change
document.getElementById('ui-scale').addEventListener('change', (e) => {
  const scale = e.target.value;
  localStorage.setItem('uiScale', scale);
  applyUIScale(scale);
});

function renderNpcSidebar(npcList) {
  const npcUl = document.getElementById("npc-list");
  npcUl.innerHTML = ''; // Clear previous list

  npcList.forEach(id => {
    const npc = npcs[id];
    if (!npc) return;

    const li = document.createElement("li");
    li.textContent = npc.name;
    li.classList.add("sidebar-npc-entry");
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.onclick = () => talkToNpc(id);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click();
      }
    });
    npcUl.appendChild(li);
  });

  // Show toggle arrow correctly
  const toggle = document.getElementById("npc-toggle");
  toggle.onclick = () => {
    npcUl.classList.toggle("hidden");
    toggle.textContent = npcUl.classList.contains("hidden") ? "NPCs ▸" : "NPCs ▾";
  };
}

function makeDraggable(container, handleSelector = null) {
  const handle = handleSelector
    ? container.querySelector(handleSelector)
    : container;

  let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

  handle.style.cursor = 'move';
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    offsetX = startX - e.clientX;
    offsetY = startY - e.clientY;
    startX = e.clientX;
    startY = e.clientY;

    container.style.top = (container.offsetTop - offsetY) + "px";
    container.style.left = (container.offsetLeft - offsetX) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function renderJournal() {
  const list = document.getElementById("journal-list");
  const text = document.getElementById("journal-entry-text");
  const title = document.getElementById("journal-entry-title");
  const image = document.getElementById("journal-entry-image");

  title.textContent = "";
  text.textContent = "";
  image.classList.add("hidden");
  image.src = "";

  list.innerHTML = "";

  const categories = ['enemy', 'location', 'npc', 'legend'];
  const entries = getAllEntries();

  categories.forEach(cat => {
    const header = document.createElement("div");
    header.textContent = `▶ ${capitalize(cat)}s`;
    header.classList.add("journal-category-header");

    const container = document.createElement("div");
    container.classList.add("journal-entry-container", "hidden");

    entries
      .filter(e => e.category === cat)
      .forEach(entry => {
        const item = document.createElement("div");
        item.classList.add("journal-entry");
        item.textContent = entry.unlocked ? entry.title : "???";

        if (!entry.unlocked && entry.locationHint) {
          item.title = `Hint: Try exploring ${entry.locationHint}`;
        }

        item.onclick = () => {
          if (!entry.unlocked) return;

          title.textContent = entry.title;
          text.textContent = entry.text;

          if (entry.image) {
            image.src = entry.image;
            image.classList.remove("hidden");
          } else {
            image.classList.add("hidden");
          }

          document.querySelectorAll(".journal-entry").forEach(el =>
            el.classList.remove("selected")
          );
          item.classList.add("selected");
        };

        container.appendChild(item);
      });

    header.addEventListener("click", () => {
      container.classList.toggle("hidden");
      header.textContent = container.classList.contains("hidden")
        ? `▶ ${capitalize(cat)}s`
        : `▼ ${capitalize(cat)}s`;
    });

    list.appendChild(header);
    list.appendChild(container);
  });

  // % Progress
  const unlocked = getUnlockedEntries().length;
  const total = getAllEntries().length;
  document.getElementById("journal-progress").textContent = `${unlocked}/${total} unlocked`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openJournal() {
  renderJournal();

  // Set 'All' tab as active by default
  document.querySelectorAll(".journal-tab").forEach(btn =>
    btn.classList.remove("active")
  );
  document.querySelector('.journal-tab[data-category="all"]')?.classList.add("active");

  openModal(document.getElementById("journal-modal"));
}

function closeJournal() {
  closeModal(document.getElementById("journal-modal"));
}
