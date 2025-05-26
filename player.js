export const player = {
  name: 'Daveric',
  level: 1,
  xp: 0,
  xpToNext: 100,
  statPoints: 0,
  skillPoints: 0,
  gold: 56,
  location: 'Whispering Glade',

  coreStats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },

  derivedStats: {
    hp: 40,
    maxHp: 40,
    mp: 10,
    maxMp: 10,
    stamina: 20,
    maxStamina: 20,
    armor: 2,
    evasion: 5,
    initiative: 10,
    critChance: 5, // In percent %
    critDamage: 150, // In percent %
    attackSpeed: 1.0,
    spellPower: 8,
    healingPower: 6,
    resistances: {
      fire: 0,
      ice: 0,
      lightning: 0,
      poison: 0,
      shadow: 0,
      arcane: 0,
    },
  },

  progression: {
    stepsTaken: 0,
    kills: 0,
    questsCompleted: 0,
    completedEvents: [],
    encumbrance: {
      weight: 0,
      maxWeight: 40,
    },
  },

  equipment: {
    "main-hand": null,
    "off-hand": null,
    "head": null,
    "chest": null,
    "accessory": null
  },

  inventory: [
    {id: 'healing_potion', quantity: 3},
    {id: 'iron_sword', quantity: 1}
  ],

  statusEffects: {
    buffs: [],
    debuffs: [],
  },

  meta: {
    tags: ['Haunted One', 'Guild Member'],
    corruption: 0,
    resonance: 0,
    hunger: 0,
    sanity: 100,
    notoriety: 0,
  },
};

export function applyItemEffects(item) {
  if (!item.effects) return;
  item.effects.forEach(effect => {
    if (effect.type === "buff") {
      player.coreStats[effect.stat] += effect.amount;
      console.log(`Applied buff: ${effect.stat} +${effect.amount}`);
      
    }
  });
}

export function removeItemEffects(item) {
  if (!item.effects) return;
  item.effects.forEach(effect => {
    if (effect.type === "buff") {
      player.coreStats[effect.stat] -= effect.amount;
      console.log(`Removed buff: ${effect.stat} -${effect.amount}`);
    }
  });
}