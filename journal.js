import { enemies } from './enemy.js';
import { locations } from './location.js';
import { npcs } from './npcs.js';
import { log } from './game.js'

// journal.js
export const journalEntries = {};

// Load enemy-based journal entries
Object.values(enemies).forEach(enemy => {
  if (enemy.journal) {
    journalEntries[enemy.id] = {
      id: enemy.id,
      title: enemy.journal.title,
      text: enemy.journal.text,
      unlocked: false,
      category: "enemy",
      locationHint: enemy.journal.locationHint,
      tags: enemy.journal.tags || []
    };
  }
});

// Load location-based journal entries
Object.values(locations).forEach(location => {
  if (location.journal) {
    journalEntries[location.id] = {
      id: location.id,
      title: location.journal.title,
      text: location.journal.text,
      unlocked: false,
      category: "location",
      locationHint: location.journal.locationHint,
      tags: location.journal.tags || []
    };
  }
});

// Load NPC-based journal entries
Object.values(npcs).forEach(npc => {
  if (npc.journal) {
    journalEntries[npc.id] = {
      id: npc.id,
      title: npc.journal.title,
      text: npc.journal.text,
      unlocked: false,
      category: "npc",
      locationHint: npc.journal.locationHint,
      tags: npc.journal.tags || []
    };
  }
});

// This holds which entries are unlocked for the player
export const playerJournal = {};

/**
 * Unlock a journal entry by ID. Returns true if newly unlocked.
 */
export function unlockJournalEntry(id) {
  const entry = journalEntries[id];
  if (!entry) {
    console.warn(`No journal entry found for id: ${id}`);
    return false;
  }

  if (!playerJournal[id]) {
    playerJournal[id] = true;
    entry.unlocked = true;
    log(`📖 Unlocked journal entry: ${entry.title}`);
    return true;
  }

  return false;
}

/**
 * Get all journal entries the player has unlocked.
 */
export function getUnlockedEntries() {
  return Object.values(journalEntries).filter(entry => entry.unlocked);
}

/**
 * Get all journal entries (used for rendering full list)
 */
export function getAllEntries() {
  return Object.values(journalEntries);
}
