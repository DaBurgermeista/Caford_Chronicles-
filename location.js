import { enemies } from "./enemy.js";
import { events } from "./events.js";

export const locations = {
  'Oakheart Village': {
    id: 'oakheart-village',
    name: 'Oakheart Village',
    description: 'A small frontier town bustling with traders and travellers.',
    image: 'assets/oakheart_village_128x128.png',
    connections: ['Market Square', 'Blacksmith Forge', 'The Sleepy Stoat', 'Whispering Glade'],
    discovered: true,
    theme: 'town',
    npcs: ['innkeeper', 'town_merchant', 'town_blacksmith'],
    hostiles: [],
    loot: [],
    tags: ['town', 'safe', 'starter'],
    discoverText: 'You arrive at the humble Oakheart Village.',
    revisitText: 'You return to the busy streets of Oakheart.',
    journal: {
      title: "Oakheart Village",
      text: "Oakheart Village grew up around a colossal oak said to have taken root in a fallen star. Over centuries its gnarled limbs were built into the original forge’s hearth—so that every blade quenched here carries a whisper of that celestial fire.",
      locationHint: "Where your journey began...",
      tags: ["location", "town"]
    },
  },
  'Whispering Glade': {
    id: 'whispering-glade',
    name: 'Whispering Glade',
    description: 'Tall trees surround you, their ancient trunks twisted with age. Shafts of golden sunlight pierce the leafy canopy, illuminating patches of wildflowers and mossy stones. The air hums with faint magic, carrying the soft whispers of unseen spirits and the distant call of birds. Every step feels watched, yet oddly welcoming, as if the forest itself is alive and curious about your presence.',
    image: 'assets/whispering_glade_128x128.png',
    connections: ['Ruined Outpost', 'Moss-Eaten Path', 'Oakheart Village'],
    discovered: false,

    // Optional Features
    ambientSound: 'birds-chirping.mp3',
    theme: 'forest', // for future background styling
    flavorTexts: [
      "You pause beneath a gnarled tree as the wind carries distant murmurs too faint to understand.",
      "A soft shimmer passes through the underbrush, vanishing before your eyes can focus.",
      "The scent of wildflowers and damp moss clings to the air, laced with something older.",
      "Your footsteps make no sound here—as if the forest is muffling them on purpose.",
      "Somewhere nearby, a branch creaks without wind, and every bird seems to fall silent for a breath.",
    ],
    journal: {
      title: "Whispering Glade",
      text: "A forested expanse where the wind seems to speak in hushed tones. Some say the trees remember...",
      locationHint: "Start here to find echoes of what came before.",
      tags: ["location", "forest"]
    },
    events: [events['forest-chant'], events['glade-hollow-tree']],
    npcs: ["old_mystic"],
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
    flavorTexts: [
      "The wind whistles through crumbling archways, carrying with it the faint clink of armor long rusted away.",
      "A broken banner still clings to a splintered pole, its symbol faded.",
      "An eerie silence blankets the outpost, broken only by the distant creak of rotting wood.",
      "You find claw marks etched into the outpost walls, too high to be made by man."
    ],
    journal: {
      title: "Ruined Outpost",
      text: "Once a proud guard post, now overrun with moss and memory. The walls hum with past violence.",
      locationHint: "Explore beyond the glade to uncover what was lost.",
      tags: ["location", "ruins"]
    },
    events: [events['ruins-collapse'], events['ruins-echoes']],
    npcs: ['Ghostly Guard'],
    hostiles: ['bandit', 'goblin_raider'],
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
  tags: ["forest", "ruins", "road"],
  journal: {
    title: "Moss-Eaten Path",
    text: "A once-proud roadway now lost beneath creeping moss. Travelers whisper that memories cling to every stone here.",
    locationHint: "Between the Whispering Glade and the Ruined Outpost",
    tags: ["location", "forest", "ruins"]
  }
  },
  'Market Square': {
    id: 'market-square',
    name: 'Market Square',
    description: 'Stalls filled with goods line the busy square.',
    connections: ['Oakheart Village', 'Blacksmith Forge', 'The Sleepy Stoat'],
    discovered: true,
    theme: 'town',
    npcs: ['town_merchant'],
    hostiles: [],
    loot: [],
    tags: ['town'],
    journal: {
      title: 'Market Square',
      text: 'The heart of Oakheart commerce, where news and coin change hands in equal measure.',
      locationHint: 'Within Oakheart Village',
      tags: ['location', 'town']
    }
  },
  'Blacksmith Forge': {
    id: 'blacksmith-forge',
    name: 'Blacksmith Forge',
    description: 'Heat and hammering steel fill the air.',
    connections: ['Oakheart Village', 'Market Square'],
    discovered: true,
    theme: 'town',
    npcs: ['town_blacksmith'],
    hostiles: [],
    loot: [],
    tags: ['town'],
    journal: {
      title: 'Blacksmith Forge',
      text: 'Borik\'s anvil rings from dawn till dusk, shaping the weapons that defend Oakheart.',
      locationHint: 'Adjacent to Market Square',
      tags: ['location', 'town']
    }
  },
  'The Sleepy Stoat': {
    id: 'sleepy-stoat',
    name: 'The Sleepy Stoat',
    description: 'A cozy tavern welcoming weary adventurers.',
    connections: ['Oakheart Village', 'Market Square'],
    discovered: true,
    theme: 'town',
    npcs: ['innkeeper'],
    hostiles: [],
    loot: [],
    tags: ['town'],
    journal: {
      title: 'The Sleepy Stoat',
      text: 'Many a quest begins over a mug of frothy ale at this humble tavern.',
      locationHint: 'Oakheart Village',
      tags: ['location', 'town']
    }
  }
};
