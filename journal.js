// journal.js
export const journalEntries = {
  "chanter-of-bark": {
    id: "chanter-of-bark",
    title: "The Chanter of Bark",
    unlocked: false,
    category: "enemy",
    text: "A once-wise druid who succumbed to forest madness, now chanting with roots coiled through his throat...",
    locationHint: "Whispering Glade",
    tags: ["enemy", "whispering-glade"]
  },
  "ruined-outpost-origin": {
    id: "ruined-outpost-origin",
    title: "Origins of the Outpost",
    unlocked: false,
    category: "location",
    text: "This outpost stood as a last bastion against creeping corruption. But the vines grew back, and so did something else...",
    locationHint: "Ruined Outpost",
    tags: ["location", "ruins"]
  },
  "hollow-watcher": {
    id: "hollow-watcher",
    title: "The Hollow-Eyed Watcher",
    unlocked: false,
    category: "enemy",
    text: "A spectral owl with burning sockets, known to haunt the ancient woods. Some say it watches for the return of something long buried.",
    locationHint: "Deeper Forest",
    tags: ["enemy", "spirit"]
  },
  // More entries can be added here
};

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
    console.log(`📖 Unlocked journal entry: ${entry.title}`);
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
