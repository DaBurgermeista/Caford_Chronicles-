import { player } from './player.js';
import { locations } from './location.js';

document.addEventListener('DOMContentLoaded', () => {
  setupSidebar();
  setupStatsModal();
  renderHud();
  renderLocation();
  renderTravelOptions();
  renderDestinationSidebar();
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
      renderTravelOptions();       // if still keeping those buttons
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
}

function renderHud() {
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

  // Update location text in HUD
  document.querySelector('.location').textContent = `📍 ${locationData.name}`;

  // Update Game Screen
  const gameScreen = document.querySelector('.game-screen pre');
  gameScreen.textContent = locationData.asciiArt.join('\n');

  document.getElementById('location-name').textContent = locationData.name;
  document.getElementById('location-description').textContent =
    locationData.description;
}

function renderTravelOptions() {
  const current = locations[player.location];
  const container = document.getElementById('travel-options');
  container.innerHTML = ''; // Clear old options

  current.connections.forEach((destination) => {
    const btn = document.createElement('button');
    btn.textContent = `Go to ${destination}`;
    btn.classList.add('travel-btn');
    btn.addEventListener('click', () => {
      player.location = destination;
      renderLocation();
      renderTravelOptions();
    });
    container.appendChild(btn);
  });
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
        renderTravelOptions();
      } else {
        logToConsole(`You can't go to "${dest}" from here.`);
      }
      break;
    default:
      logToConsole(`Unknown command: ${cmd}`);
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

document.getElementById('travel-button').addEventListener('click', () => {
  const current = player.location;
  const next = locations[current].connections[0]; // only one other for now
  player.location = next;
  renderLocation();
  renderTravelOptions();
});
