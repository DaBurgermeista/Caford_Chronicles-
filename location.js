export const locations = {
  'Whispering Glade': {
    id: 'whispering-glade',
    name: 'Whispering Glade',
    description: 'Tall trees surround you, their ancient trunks twisted with age. Shafts of golden sunlight pierce the leafy canopy, illuminating patches of wildflowers and mossy stones. The air hums with faint magic, carrying the soft whispers of unseen spirits and the distant call of birds. Every step feels watched, yet oddly welcoming, as if the forest itself is alive and curious about your presence.',
    asciiArt: [
      '🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲',
      '🌲      🧙‍♂️       🌲',
      '🌲  A forest path  🌲',
      '🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲',
    ],
    connections: ['Ruined Outpost'],

    // Optional Features
    ambientSound: 'birds-chirping.mp3',
    theme: 'forest', // for future background styling
    events: [],
    npcs: [],
    loot: [],
    tags: ['safe', 'nature', 'starter'],

    discoverText: 'You step into a quiet glade where whispers ride the wind.',
    revisitText: 'You return to the familiar rustle of the glade.',
  },
  'Ruined Outpost': {
    id: 'ruined-outpost',
    name: 'Ruined Outpost',
    description: 'Crumbled walls and old bloodstains hint at past battles.',
    asciiArt: [
      '🏰🏰🏰    💀    🧱🧱🧱',
      '🪦  ⚔️  A broken gate  🪖',
      '🏚️🏚️🏚️          ⚔️🏚️🏚️🏚️',
    ],
    connections: ['Whispering Glade'],
    ambientSound: 'wind-howl.mp3',
    theme: 'ruin',
    events: ['ambush'],
    npcs: ['Ghostly Guard'],
    loot: ['rusted sword', 'tattered journal'],
    tags: ['danger', 'ruins'],

    discoverText: 'The wind moans through a forgotten stronghold.',
    revisitText: 'The crumbled towers offer no comfort.',
  },
};
