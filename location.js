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
  tags: ["forest", "ruins", "road"]
}
};
