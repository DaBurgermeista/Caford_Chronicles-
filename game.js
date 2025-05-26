import { player, applyItemEffects, removeItemEffects } from './player.js';
console.log("Loaded player:", player);
import { locations } from './location.js';
console.log("Loaded locations:", locations);
import { items } from './items.js';
console.log("Loaded items:", items);
import { enemies } from './enemy.js';
console.log("Loaded enemies:", enemies);

let currentEnemy = null; // Initialize current enemy
let draggedItemID = null; // For drag-and-drop 
function getEquippedWeapon() {
  const id = player.equipment["main-hand"];
  return id ? items[id] : null;
}


// functionality
let isDragging = false; // Track if an item is being dragged

document.addEventListener('DOMContentLoaded', () => {
  setupSidebar();
  setupStatsModal();
  renderHud();
  renderLocation();
  renderDestinationSidebar();
  renderInventory();

  //startCombat(enemies.goblin_raider); // Start combat with a goblin raider for testing

  // Setup listeners for combat actions
  const combatActions = document.querySelector('.combat-actions');
  combatActions.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action) {
      playerAction(action);
    }
  });

});

function setupSidebar() {
  const sidebar = document.querySelector('.sidebar-wrapper');
  const tab = document.querySelector('.sidebar-tab');
  const menuItems = document.querySelectorAll('.sidebar li');

  if (!sidebar || !tab) return;

  tab.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    tab.textContent = sidebar.classList.contains('hidden') ? 'TAB' : 'CLOSE';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      sidebar.classList.toggle('hidden');
      tab.textContent = sidebar.classList.contains('hidden') ? 'TAB' : 'CLOSE';
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const text = item.textContent.trim();

      if (text === 'Save Game') {
        console.log('Saving game... returning to menu.');
        window.location.href = 'index.html';
      }

      // TODO: Add logic for stats, inventory, quests, settings
    });
  });
}

function renderDestinationSidebar() {
  const current = locations[player.location];
  const list = document.getElementById('destination-list');
  list.innerHTML = ''; // Clear previous

  current.connections.forEach(dest => {
    const li = document.createElement('li');
    li.textContent = dest;
    li.addEventListener('click', () => {
      player.location = dest;
      renderLocation();
      renderDestinationSidebar();  // refresh right sidebar
    });
    list.appendChild(li);
  });
}


function setupStatsModal() {
  const statsBtn = document.querySelector('.sidebar li:nth-child(1)'); // or use text match
  const modal = document.getElementById('stats-modal');
  const closeBtn = document.getElementById('close-stats');

  statsBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    renderStatsToModal();
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.add('hidden');
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

  document.body.className = ''; // Clear old theme
  if (locationData.theme === 'forest') {
    document.body.classList.add('forest-theme');
  } else if (locationData.theme === 'ruins') {
    document.body.classList.add('ruins-theme');
  }

  // HUD
  document.querySelector('.location').textContent = `📍 ${locationData.name}`;

  // Title & description
  document.getElementById('location-name').textContent = locationData.name;
  document.getElementById('location-description').textContent = locationData.description;

  // Image or ASCII art
  const img = document.getElementById('location-image');

  // if (locationData.image) {
  //   img.src = locationData.image;
  //   img.classList.remove('hidden');
  // } else {
  //   img.classList.add('hidden');
  // }

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
    const item = player.inventory.find(i => i.id === itemId);
    if (item && item.slot === slotType) {
      equipItemToSlot(itemId, slotType);
    }
  });
});

function equipItemToSlot(itemId, slotType) {
  const inventoryIndex = player.inventory.findIndex(i => i.id === itemId);
  if (inventoryIndex === -1) return;

  const itemData = items[itemId]; // grab full item details
  if (!itemData) {
    console.warn(`Cannot equip itemId "${itemId}" — item not found in items.js`);
    return;
  }

  // Remove 1 quantity
  const entry = player.inventory[inventoryIndex];
  if (entry.quantity > 1) {
    entry.quantity--;
  } else {
    player.inventory.splice(inventoryIndex, 1);
  }

  // Equip it
  player.equipment[slotType] = itemId; // store just the ID

  console.log(`Equipped ${itemId} to ${slotType}`);

  renderInventory();
  renderEquipped();
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
    });

    li.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("dragging");
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

    document.querySelectorAll('.equip-slot').forEach(slotEl => {
    const slotType = slotEl.dataset.slot;

    // Allow drop
    slotEl.addEventListener('dragover', (e) => {
      e.preventDefault(); // must be here to allow drop
      slotEl.classList.add('dragover');
    });

    // Remove visual cue
    slotEl.addEventListener('dragleave', () => {
      slotEl.classList.remove('dragover');
    });

    // Handle drop
    slotEl.addEventListener('drop', (e) => {
    e.preventDefault();
    slotEl.classList.remove('dragover');

    const itemId = e.dataTransfer.getData('text/plain');
    const inventoryEntry = player.inventory.find(i => i.id === itemId);
    const item = items[itemId]; // <== Get item definition from master list

    if (inventoryEntry && item && item.slot === slotType) {
      equipItemToSlot(itemId, slotType);
    } else {
      console.log("Can't equip item here.");
      console.log(`Item: ${item ? item.name : 'Unknown'} | Slot: ${slotType}`);
    }
  });
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
    li.addEventListener('click', () => {
      handleItemAction(action.toLowerCase(), itemId);
      closeContextMenu();
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
    // TODO: implement use logic
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

function renderEquipped() {
  const slots = {
    "main-hand": player.equipment["main-hand"],
    "off-hand": player.equipment["off-hand"],
    "head": player.equipment["head"],
    "chest": player.equipment["chest"],
    "accessory": player.equipment["accessory"]
  };

  console.log("Rendering equipped items", slots);

  for (const [slot, itemId] of Object.entries(slots)) {
    const span = document.getElementById(`slot-${slot}`);
    
    if (itemId) {
      const item = typeof itemId === 'string' ? items[itemId] : itemId;
      player.equipment[slot] = item;

      const newSpan = span.cloneNode(true);
      newSpan.textContent = item.name;
      newSpan.classList.add("equipped-item");
      span.replaceWith(newSpan);

      // ✅ Add context menu
      newSpan.addEventListener("click", (e) => {
        openContextMenu(itemId, e.clientX, e.clientY, true);
      });

      // ✅ Tooltip events
      newSpan.addEventListener("mouseenter", (e) => {
        showTooltip(itemId, e.clientX, e.clientY);
      });
      newSpan.addEventListener("mouseleave", hideTooltip);
      newSpan.addEventListener("mousemove", (e) => {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.left = `${e.clientX + 10}px`;
      });

    } else {
      span.textContent = "None";
      span.classList.remove("equipped-item");
    }
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
  document.getElementById('inventory-modal').classList.remove('hidden');
  renderInventory();
  renderEquipped();
  renderStatsToModal();
});

document.getElementById('close-inventory').addEventListener('click', () => {
  document.getElementById('inventory-modal').classList.add('hidden');
});

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
  const tooltip = document.getElementById('tooltip');
  const item = items[itemId];
  document.getElementById('tooltip-damage').textContent = ''; // Clear previous damage text

  if (!item) return;

  document.getElementById('tooltip-name').textContent = item.name;
  if (item.type === 'weapon') {
    document.getElementById('tooltip-damage').textContent = `Damage: ${item.damage ? `${item.damage[0]} - ${item.damage[1]}` : ''}`;
  }
  document.getElementById('tooltip-description').textContent = item.description || 'No description.';
  document.getElementById('tooltip-type').textContent = `Type: ${item.type || 'Unknown'}`;
  document.getElementById('tooltip-value').textContent = `Value: ${item.value || 0} Gold`;

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
  const locationID = player.location;
  const current = locations[locationID];

  const eventTriggered = triggerEventsFor(current, 'onExplore');

  if (!eventTriggered) {
    // No event occurred, so roll for combat
    if (Math.random() < 0.2 && current.hostiles && current.hostiles.length > 0) {
      const randomID = current.hostiles[Math.floor(Math.random() * current.hostiles.length)];
      const selectedEnemy = enemies[randomID];

      if (selectedEnemy) {
        startCombat(selectedEnemy);
        return;
      }
    }

    // If no combat either
    log("🌿 You explore the area but find nothing of interest this time.");
  }
}


function startCombat(enemy) {
  currentEnemy = structuredClone(enemy); // Clone to avoid modifying original
  updateCombatUI(enemy);
  showCombatUI();
  log(`⚔️ A wild ${currentEnemy.name} appears!`);
  logCombat("You ready your weapon and prepare for battle!");
}

function playerAction(type) {
  switch (type) {
    case 'attack': {
      logCombat(`🗡️ You attack the enemy!`);

      let weapon = getEquippedWeapon(); // always use this now
      let weaponDamage = 0;
      let rawDamage = 0;

      const isCrit = Math.random() < player.derivedStats.critChance / 100;
      const strMod = (player.coreStats.strength - 10) / 2;
      const dexMod = (player.coreStats.dexterity - 10) / 2;

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
        logCombat(`💥 Critical Hit! Damage: ${Math.floor(rawDamage)}`);
      } else {
        logCombat(`✖️ You will hit the ${currentEnemy.name} for ${Math.floor(rawDamage)} damage!`);
      }
      
      // Check to see if the enemy can evade
      const evadeChance = currentEnemy.stats.evasion || 0;
      logCombat(`🌀 ${currentEnemy.name} has an evade chance of ${evadeChance * 100}%`);
      if (Math.random() < evadeChance) {
        logCombat(`🚫 ${currentEnemy.name} evaded your attack!`);
        return; // Exit if the attack was evaded
      }

      // Check if the enemy has armor
      const enemyArmor = currentEnemy.stats.armor || 0;
      if (enemyArmor > 0) {
        const effectiveDamage = Math.max(rawDamage - enemyArmor, 0); // Ensure damage doesn't go below 0
        if (effectiveDamage <= 0) {
          logCombat(`🛡️ ${currentEnemy.name} blocked your attack with armor! No damage dealt.`);
          return; // Exit if no damage was dealt
        } else {
          logCombat(`🛡️ ${currentEnemy.name} has armor! Effective damage: ${effectiveDamage}`);
          currentEnemy.stats.hp -= effectiveDamage;
          logCombat(`💔 ${currentEnemy.name} takes ${effectiveDamage} damage!`);
        }
      } else {
        logCombat(`💔 ${currentEnemy.name} takes ${rawDamage} damage!`);
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
        renderHud();
        renderStatsToModal();
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
}


function logCombat(message) {
  const logBox = document.getElementById('combat-log');
  const entry = document.createElement('p');
  entry.textContent = message;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight; // Auto-scroll
}

export function log(message) {
  const logBox = document.getElementById('action-log');
  const entry = document.createElement('p');
  entry.textContent = message;
  logBox.appendChild(entry);
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

// When dragging starts, store the item ID
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("inventory-item")) {
    draggedItemId = e.target.dataset.itemId;
    isDragging = true;
  }
});

document.addEventListener("dragend", () => {
  isDragging = false;
});

// Allow drop target
document.querySelectorAll(".inventory-item").forEach(item => {
  item.addEventListener("click", (e) => {
    if (isDragging) return; // prevent click if dragging
    // Your context menu logic here
    openContextMenu(e, item.dataset.itemId);
  });
});

function isSlotCompatible(itemId, slot) {
  const item = player.inventory.find(i => i.id === itemId);
  return item && item.slot === slot;
}

function equipItem(itemId, slot) {
  const itemIndex = player.inventory.findIndex(i => i.id === itemId);
  if (itemIndex !== -1) {
    const item = player.inventory[itemIndex];
    player.equipment[slot] = item;
    player.inventory.splice(itemIndex, 1);
    updateInventoryUI();
    updateEquipmentUI();
  }
}

export function showStoryEventDialog(title, description, choices) {
  const modal = document.getElementById("story-event-modal");
  const titleElem = document.getElementById("story-event-title");
  const textElem = document.getElementById("story-event-text");
  const choicesContainer = document.getElementById("story-event-choices");

  titleElem.textContent = title;
  textElem.textContent = description;
  choicesContainer.innerHTML = ""; // Clear previous buttons

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      modal.classList.add("hidden");
      choice.action();
    };
    choicesContainer.appendChild(btn);
  });

  modal.classList.remove("hidden");
}


export function triggerEventsFor(location, triggerType) {
  if (!location.events) return false;

  for (const event of location.events) {
    if (
      event.trigger === triggerType &&
      !player.progression.completedEvents.includes(event.id) &&
      Math.random() < event.chance
    ) {
      event.effect(player, location);
      return true; // An event triggered
    }
  }

  return false; // No event triggered
}

