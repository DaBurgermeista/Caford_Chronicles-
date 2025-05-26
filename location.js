import { enemies } from "./enemy.js";
import { events } from "./events.js";

export const locations = {
  'Whispering Glade': {
    id: 'whispering-glade',
    name: 'Whispering Glade',
    description: 'Tall trees surround you, their ancient trunks twisted with age. Shafts of golden sunlight pierce the leafy canopy, illuminating patches of wildflowers and mossy stones. The air hums with faint magic, carrying the soft whispers of unseen spirits and the distant call of birds. Every step feels watched, yet oddly welcoming, as if the forest itself is alive and curious about your presence.',
    image: 'assets/whispering_glade_128x128.png',
    connections: ['Ruined Outpost', 'Moss-Eaten Path'],
    discovered: false,

    // Optional Features
    ambientSound: 'birds-chirping.mp3',
    theme: 'forest', // for future background styling
    events: [events['forest-chant'], events['glade-hollow-tree']],
    npcs: [],
    hostiles: ['goblin_raider', 'whisper_wisp', 'mossling', 
      'verdant_shade', 'gladefang_wolf', 'barbed_stag', 'needlewing_swarm',
      'chanter_of_bark', 'fey_trickster', 'hallow_eyed_watcher', 'the_thorned_sentinel',],
    loot: [],
    tags: ['safe', 'nature', 'starter'],

    discoverText: 'You step into a quiet glade where whispers ride the wind.',
    revisitText: 'You return to the familiar rustle of the glade.',
  },
  'Ruined Outpost': {
    id: 'ruined-outpost',
    name: 'Ruined Outpost',
    description: 'Crumbled walls and old bloodstains hint at past battles.',
    image: 'assets/ruined_outpost_128x128.png',
    connections: ['Whispering Glade', 'Moss-Eaten Path'],
    discovered: false,
    // Optional Features
    ambientSound: 'wind-howl.mp3',
    theme: 'ruins',
    events: [events['ruins-collapse'], events['ruins-echoes']],
    npcs: ['Ghostly Guard'],
    hostiles: ['bandit'],
    loot: ['rusted sword', 'tattered journal'],
    tags: ['danger', 'ruins'],

    discoverText: 'The wind moans through a forgotten stronghold.',
    revisitText: 'The crumbled towers offer no comfort.',
  },
  "Moss-Eaten Path": {
  id: "moss-eaten-path",
  name: "Moss-Eaten Path",
  description: "A narrow trail winds through ancient forest and crumbled stone. Vines and creeping moss have swallowed the road, and broken statues peek from the undergrowth. The air here is thick with memory—part nature, part forgotten place. A sense of unease lingers, as though you're being watched by both spirit and shadow.",
  discovered: false,
  image: 'assets/moss_eaten_path_128x128.png',
  asciiArt: [
    "🪨🌿🪨🌿🪨🌿🪨",
    "🌲   🪨   🌲",
    "🌿🪨🌿🪨🌿🪨🌿",
    "🌲   🌿   🌲",
    "🪨🌿🪨🌿🪨🌿🪨"
  ],
  connections: ["Whispering Glade", "Ruined Outpost"],
  theme: "forest",
  ambientSound: "forest-ambience.mp3",
  events: [],
  npcs: [],
  hostiles: ["gladefang_wolf", "hollow_eyed_watcher", "barbed_stag"],
  loot: ["old_map_fragment", "glimmering_root", "rusted_signet"],
  tags: ["forest", "ruins", "road"]
}
};
