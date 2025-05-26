export const items = {
  "iron_sword": {
    id: "iron_sword",
    name: "Iron Sword",
    type: "weapon",
    subtype: "sword",
    slot: "main-hand",
    damage: [3, 6],
    critBonus: 2,
    statRequirements: { strength: 5 },
    value: 12,
    weight: 4,
    stackable: false,
    description: "A reliable iron blade.",
    flavor: "Still bears the mark of its dwarven smith.",
    icon: "🗡️",
    rarity: "common",
    tags: ["melee", "starter", "physical"]
  },

  "short_bow": {
    id: "short_bow",
    name: "Short Bow",
    type: "weapon",
    subtype: "bow",
    slot: "main-hand",
    damage: [2, 5],
    critBonus: 3,
    statRequirements: { dexterity: 6 },
    value: 15,
    weight: 3,
    stackable: false,
    description: "A lightweight bow ideal for hunting.",
    icon: "🏹",
    rarity: "common",
    tags: ["ranged", "agile", "wood"]
  },

  "leather_armor": {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    subtype: "light",
    slot: "chest",
    armor: 2,
    resistance: { poison: 1 },
    statRequirements: { dexterity: 4 },
    value: 18,
    weight: 6,
    stackable: false,
    description: "Light armor offering modest protection.",
    icon: "🛡️",
    rarity: "common",
    tags: ["armor", "starter"]
  },

  "iron_helm": {
    id: "iron_helm",
    name: "Iron Helm",
    type: "armor",
    subtype: "heavy",
    slot: "head",
    armor: 1,
    resistance: { blunt: 1 },
    statRequirements: { strength: 5 },
    value: 10,
    weight: 2,
    stackable: false,
    description: "Protects your noggin. Barely.",
    icon: "🥽",
    rarity: "common",
    tags: ["armor", "metal"]
  },

  "healing_potion": {
    id: "healing_potion",
    name: "Healing Potion",
    type: "consumable",
    subtype: "potion",
    effects: [{ type: "heal", amount: 20, target: "self" }],
    stackable: true,
    maxStack: 5,
    value: 8,
    weight: 0.2,
    description: "Restores a small amount of health.",
    icon: "🧪",
    rarity: "common",
    tags: ["potion", "healing"]
  },

  "mana_draught": {
    id: "mana_draught",
    name: "Mana Draught",
    type: "consumable",
    subtype: "potion",
    effects: [{ type: "restore_mp", amount: 10, target: "self" }],
    stackable: true,
    maxStack: 3,
    value: 10,
    weight: 0.3,
    description: "Faintly glowing liquid for spellcasters.",
    icon: "🔮",
    rarity: "uncommon",
    tags: ["potion", "mana"]
  },

  "tower_key": {
    id: "tower_key",
    name: "Ancient Tower Key",
    type: "key",
    subtype: "quest",
    usableInCombat: false,
    stackable: false,
    value: 0,
    weight: 0,
    description: "Unlocks the sealed gate of the ruined tower.",
    icon: "🗝️",
    rarity: "rare",
    tags: ["quest", "key", "story"]
  },

  "mystic_charm": {
    id: "mystic_charm",
    name: "Mystic Charm",
    type: "accessory",
    subtype: "enchanted",
    slot: "accessory",
    effects: [{ type: "buff", stat: "wisdom", amount: 2 }],
    stackable: false,
    value: 125,
    weight: 0.1,
    description: "A charm that hums with gentle energy.",
    icon: "✨",
    rarity: "rare",
    tags: ["artifact", "enchanted", "wisdom"]
  },
  "silver_leaf": {
    id: "silver_leaf",
    name: "Silver Leaf",
    type: "collectible",
    subtype: "nature",
    stackable: true,
    maxStack: 10,
    value: 5,
    weight: 0.05,
    description: "A rare leaf with a silvery sheen.",
    icon: "🍂",
    rarity: "uncommon",
    tags: ["collectible", "nature"]
  },
  "ancient_relic": {
    id: "ancient_relic",
    name: "Ancient Relic",
    type: "accessory",
    subtype: "mystical",
    slot: "accessory",
    effects: [{ type: "buff", stat: "intelligence", amount: 3 }],
    stackable: false,
    value: 200,
    weight: 0.2,
    description: "An artifact from a forgotten age, pulsing with arcane energy.",
    icon: "🪄",
    rarity: "legendary",
    tags: ["artifact", "mystical", "intelligence"]
  }
};

export function addItem(itemId, quantity = 1) {
  const existing = player.inventory.find(i => i.id === itemId);
  if (existing && items[itemId].stackable) {
    existing.quantity += quantity;
  } else {
    player.inventory.push({ id: itemId, quantity });
  }
}

export function removeItem(itemId, quantity = 1) {
  const index = player.inventory.findIndex(i => i.id === itemId);
  if (index !== -1) {
    if (player.inventory[index].quantity > quantity) {
      player.inventory[index].quantity -= quantity;
    } else {
      player.inventory.splice(index, 1);
    }
  }
}
