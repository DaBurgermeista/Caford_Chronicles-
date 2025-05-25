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
  whisper_wisp: {
    id: 'whisper_wisp',
    name: 'Whisper Wisp',
    level: 1,
    description: 'A glowing spirit that whispers secrets of the forest.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/whisper_wisp_32x32.png',
    stats: {
      hp: 20,
      maxHp: 20,
      mp: 15,
      maxMp: 15,
      stamina: 5,
      armor: 0,
      critChance: 0.0,
      evasion: 0.2,
      attackPower: 3
    },
    traits: ['ethereal'],
    aiType: 'support',
    skills: [
      {
        name: 'Whispering Light',
        type: 'heal',
        staminaCost: 2,
        healingAmount: [3, 6],
        description: 'Heals a small amount of health with soothing whispers.',
        effects: [],
        chanceToUse: 0.7
      }
    ],
    loot: [
      { id: 'gold', amount: [2, 5], chance: 1.0 }
    ],
    xpReward: 10,
    goldReward: [2, 5],
    fleeChance: 0.05
  },
  mossling: {
    id: 'mossling',
    name: 'Mossling',
    level: 1,
    description: 'A small, moss-covered creature that blends into the forest.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/mossling_32x32.png',
    stats: {
      hp: 25,
      maxHp: 25,
      mp: 0,
      maxMp: 0,
      stamina: 8,
      armor: 1,
      critChance: 0.02,
      evasion: 0.1,
      attackPower: 4
    },
    traits: ['stealthy'],
    aiType: 'ambusher',
    skills: [
      {
        name: 'Camouflage Strike',
        type: 'attack',
        staminaCost: 2,
        damage: [3, 6],
        description: 'A stealthy attack that deals moderate damage.',
        effects: [],
        chanceToUse: 0.5
      }
    ],
    loot: [
      { id: 'gold', amount: [1, 3], chance: 1.0 }
    ],
    xpReward: 12,
    goldReward: [1, 3],
    fleeChance: 0.05
  },
  verdant_shade: {
    id: 'verdant_shade',
    name: 'Verdant Shade',
    level: 4,
    description: 'A shadowy figure that blends with the forest, wielding nature\'s wrath.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/verdant_shade_32x32.png',
    stats: {
      hp: 50,
      maxHp: 50,
      mp: 20,
      maxMp: 20,
      stamina: 12,
      armor: 3,
      critChance: 0.15,
      evasion: 0.2,
      attackPower: 8
    },
    traits: ['elusive'],
    aiType: 'tactician',
    skills: [
      {
        name: 'Nature\'s Grasp',
        type: 'attack',
        staminaCost: 5,
        damage: [8, 16],
        description: 'A powerful strike that channels the forest\'s energy.',
        effects: [],
        chanceToUse: 0.4
      }
    ],
    loot: [
      { id: 'gold', amount: [15, 30], chance: 1.0 },
      { id: 'nature_staff', chance: 0.2 }
    ],
    xpReward: 40,
    goldReward: [15, 30],
    fleeChance: 0.2
  },
  gladefang_wolf: {
    id: 'gladefang_wolf',
    name: 'Gladefang Wolf',
    level: 3,
    description: 'A fierce wolf with glowing eyes, protector of the glade.',
    theme: 'forest',
    asciiArt: [
      "   /\\_/\\  ",
      "  ( o.o ) ",
      "   > ^ <  "
    ],
    image: 'assets/gladefang_wolf_32x32.png',
    stats: {
      hp: 35,
      maxHp: 35,
      mp: 0,
      maxMp: 0,
      stamina: 10,
      armor: 2,
      critChance: 0.1,
      evasion: 0.15,
      attackPower: 6
    },
    traits: ['predator'],
    aiType: 'hunter',
    skills: [
      {
        name: 'Feral Bite',
        type: 'attack',
        staminaCost: 3,
        damage: [5, 10],
        description: 'A vicious bite that can cause bleeding.',
        effects: [],
        chanceToUse: 0.6
      }
    ],
    loot: [
      { id: 'gold', amount: [8, 15], chance: 1.0 },
      { id: 'wolf_pelt', chance: 0.3 }
    ],
    xpReward: 30,
    goldReward: [8, 15],
    fleeChance: 0.1
  },
  barbed_stag: {
    id: 'barbed_stag',
    name: 'Barbed Stag',
    level: 5,
    description: 'A majestic stag with sharp, barbed antlers, guardian of the forest.',
    theme: 'forest',
    asciiArt: [
      "   /\\   ",
      "  /  \\  ",
      " ( o o ) ",
      "  \\_O_/  "
    ],
    image: 'assets/barbed_stag_32x32.png',
    stats: {
      hp: 60,
      maxHp: 60,
      mp: 0,
      maxMp: 0,
      stamina: 15,
      armor: 4,
      critChance: 0.2,
      evasion: 0.1,
      attackPower: 10
    },
    traits: ['guardian'],
    aiType: 'defender',
    skills: [
      {
        name: 'Barbed Charge',
        type: 'attack',
        staminaCost: 6,
        damage: [10, 20],
        description: 'A powerful charge that deals heavy damage and can knock back enemies.',
        effects: [],
        chanceToUse: 0.3
      }
    ],
    loot: [
      { id: 'gold', amount: [20, 40], chance: 1.0 },
      { id: 'stag_horn', chance: 0.4 }
    ],
    xpReward: 50,
    goldReward: [20, 40],
    fleeChance: 0.25
  },
  needlewing_swarm: { 
    id: 'needlewing_swarm',
    name: 'Needlewing Swarm',
    level: 2,
    description: 'A swarm of small, needle-like creatures that attack in unison.',
    theme: 'forest',
    asciiArt: [
      "  /\\_/\\  ",
      " ( o.o ) ",
      "  > ^ <  "
    ],
    image: 'assets/needlewing_swarm_32x32.png',
    stats: {
      hp: 28,
      maxHp: 28,
      mp: 0,
      maxMp: 0,
      stamina: 8,
      armor: 1,
      critChance: 0.05,
      evasion: 0.1,
      attackPower: 4
    },
    traits: ['swarm'],
    aiType: 'horde',
    skills: [
      {
        name: 'Needle Barrage',
        type: 'attack',
        staminaCost: 3,
        damage: [3, 7],
        description: 'A rapid attack that hits multiple targets.',
        effects: [],
        chanceToUse: 0.5
      }
    ],
    loot: [
      { id: 'gold', amount: [3, 8], chance: 1.0 }
    ],
    xpReward: 15,
    goldReward: [3, 8],
    fleeChance: 0.1
  },
  chanter_of_bark: {
    id: 'chanter_of_bark',
    name: 'Chanter of Bark',
    level: 4,
    description: 'A mystical being that channels the power of the forest.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/chanter_of_bark_32x32.png',
    stats: {
      hp: 45,
      maxHp: 45,
      mp: 25,
      maxMp: 25,
      stamina: 12,
      armor: 3,
      critChance: 0.1,
      evasion: 0.15,
      attackPower: 7
    },
    traits: ['mystical'],
    aiType: 'caster',
    skills: [
      {
        name: 'Barkskin Shield',
        type: 'defense',
        staminaCost: 4,
        description: 'Creates a protective shield that absorbs damage.',
        effects: [{ type: 'shield', amount: [5, 10] }],
        chanceToUse: 0.6
      }
    ],
    loot: [
      { id: 'gold', amount: [12, 25], chance: 1.0 },
      { id: 'bark_staff', chance: 0.3 }
    ],
    xpReward: 35,
    goldReward: [12, 25],
    fleeChance: 0.2
  },
  fey_trickster: {
    id: 'fey_trickster',
    name: 'Fey Trickster',
    level: 3,
    description: 'A mischievous fey creature that plays tricks on travelers.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/fey_trickster_32x32.png',
    stats: {
      hp: 35,
      maxHp: 35,
      mp: 20,
      maxMp: 20,
      stamina: 10,
      armor: 2,
      critChance: 0.1,
      evasion: 0.2,
      attackPower: 6
    },
    traits: ['trickster'],
    aiType: 'illusionist',
    skills: [
      {
        name: 'Illusionary Strike',
        type: 'attack',
        staminaCost: 3,
        damage: [4, 8],
        description: 'An attack that confuses the target, causing them to miss their next turn.',
        effects: [{ type: 'confuse', duration: 1 }],
        chanceToUse: 0.5
      }
    ],
    loot: [
      { id: 'gold', amount: [10, 15], chance: 1.0 },
      { id: 'fey_dust', chance: 0.4 }
    ],
    xpReward: 30,
    goldReward: [10, 15],
    fleeChance: 0.15
  },
  hallow_eyed_watcher: {
    id: 'hallow_eyed_watcher',
    name: 'Hallow-Eyed Watcher',
    level: 5,
    description: 'A mysterious guardian with glowing eyes that see through illusions.',
    theme: 'forest',
    asciiArt: [
      "   .-.",
      "  (o o)",
      "  | O |",
      "   '-' "
    ],
    image: 'assets/hallow_eyed_watcher_32x32.png',
    stats: {
      hp: 55,
      maxHp: 55,
      mp: 30,
      maxMp: 30,
      stamina: 15,
      armor: 4,
      critChance: 0.15,
      evasion: 0.1,
      attackPower: 9
    },
    traits: ['watchful'],
    aiType: 'sentinel',
    skills: [
      {
        name: 'Gaze of Clarity',
        type: 'support',
        staminaCost: 5,
        description: 'Removes all negative effects from allies and reveals hidden enemies.',
        effects: [{ type: 'cleanse' }],
        chanceToUse: 0.4
      }
    ],
    loot: [
      { id: 'gold', amount: [20, 35], chance: 1.0 },
      { id: 'watcher_eye', chance: 0.5 }
    ],
    xpReward: 45,
    goldReward: [20, 35],
    fleeChance: 0.2
  },
  the_thorned_sentinel: {
    id: 'the_thorned_sentinel',
    name: 'The Thorned Sentinel',
    level: 6,
    description: 'A towering guardian of the forest, covered in thorns and vines.',
    theme: 'forest',
    asciiArt: [
      "   /\\   ",
      "  /  \\  ",
      " ( o o ) ",
      "  \\_O_/  "
    ],
    image: 'assets/thorned_sentinel_32x32.png',
    stats: {
      hp: 80,
      maxHp: 80,
      mp: 40,
      maxMp: 40,
      stamina: 20,
      armor: 5,
      critChance: 0.2,
      evasion: 0.05,
      attackPower: 12
    },
    traits: ['immovable'],
    aiType: 'defender',
    skills: [
      {
        name: 'Thorned Slam',
        type: 'attack',
        staminaCost: 8,
        damage: [15, 25],
        description: 'A powerful slam that deals heavy damage and roots the target in place.',
        effects: [{ type: 'root', duration: 2 }],
        chanceToUse: 0.3
      }
    ],
    loot: [
      { id: 'gold', amount: [30, 50], chance: 1.0 },
      { id: 'sentinel_shield', chance: 0.6 }
    ],
    xpReward: 60,
    goldReward: [30, 50],
    fleeChance: 0.3
  },
  bandit: {
    id: 'bandit',
    name: 'Bandit',
    level: 3,
    description: 'A cunning bandit with a dagger and a sly grin.',
    theme: 'ruins',
    asciiArt: [],
    image: 'assets/bandit_32x32.png',
    stats: {
      hp: 40,
      maxHp: 40,
      mp: 10,
      maxMp: 10,
      stamina: 15,
      armor: 2,
      critChance: 0.1,
      evasion: 0.15,
      attackPower: 7
    },
    traits: ['cunning'],
    aiType: 'strategist',
    skills: [
      {
        name: 'Sneak Attack',
        type: 'attack',
        staminaCost: 4,
        damage: [6, 12],
        description: 'A surprise attack that deals extra damage.',
        effects: [],
        chanceToUse: 0.5
      }
    ],
    loot: [
      { id: 'gold', amount: [10, 20], chance: 1.0 },
      { id: 'dagger', chance: 0.3 }
    ],
    xpReward: 25,
    goldReward: [10, 20],
    fleeChance: 0.15
  }
};
