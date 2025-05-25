export const enemies = {
  goblin_raider: {
    id: 'goblin_raider',
    name: 'Goblin Raider',
    level: 2,
    description: 'A snarling goblin armed with rusty blades.',
    theme: 'forest',
    asciiArt: [
      "  (o_o)  ",
      " <|=|=>  ",
      "  / \\    "
    ],
    image: 'assets/goblin_warrior_32x32.png',
    stats: {
      hp: 30,
      maxHp: 30,
      mp: 5,
      maxMp: 5,
      stamina: 10,
      armor: 1,
      critChance: 0.05,
      evasion: 0.1,
      attackPower: 5
    },
    traits: ['aggressive'],
    aiType: 'berserker',
    skills: [
      {
        name: 'Wild Slash',
        type: 'attack',
        staminaCost: 3,
        damage: [4, 8],
        description: 'A reckless slash for moderate damage.',
        effects: [],
        chanceToUse: 0.6
      }
    ],
    loot: [
      { id: 'gold', amount: [5, 10], chance: 1.0 }
    ],
    xpReward: 18,
    goldReward: [5, 12],
    fleeChance: 0.1
  },
};
