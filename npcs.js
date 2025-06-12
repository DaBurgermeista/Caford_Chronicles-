import { openShop } from './shops.js';

export const npcs = {
  "old_mystic": {
    id: "old_mystic",
    name: "Old Mystic",
    location: "whispering-glade",
    portrait: "assets/npcs/old_mystic.png", // You can update this to your image path
    journal: {
      title: "Old Mystic",
      text: "A reclusive seer muttering about forgotten futures and forest memories.",
      locationHint: "Whispering Glade",
      tags: ["npc"]
    },
    dialogue: {
      "start": {
        text: `<span style="color: #dabd50;"><em>A hunched figure emerges from the mist, eyes glowing faintly beneath a hood.</em></span><br><br>\"Ah... another soul adrift in the glade.\"`,
        options: [
          { text: "Who are you?", next: "who" },
          { text: "What is this place?", next: "where" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "who": {
        text: "\"They call me Seer of the Withering Path, though names matter little here. I watch, I listen... and sometimes, I warn.\"",
        options: [
          { text: "Warn about what?", next: "warning" },
          { text: "You seem... familiar.", next: "familiar" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "where": {
        text: "\"The Whispering Glade. A place where memories echo louder than footfalls. It listens, you know. The forest watches everything.\"",
        options: [
          { text: "That’s unsettling.", next: "warning" },
          { text: "Sounds peaceful to me.", next: "peaceful" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "warning": {
        text: `<span style="color: #dabd50;"><em>The Mystic leans closer, voice dropping to a rasp.</em></span><br><br>\"There is a presence... a hollow song beneath the earth. Something is waking.\"`,
        options: [
          { text: "What should I do?", next: "hint" },
          { text: "You’re mad.", next: "mad" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "familiar": {
        text: "\"Perhaps you’ve dreamt of me... or perhaps we’ve spoken in another thread of the weave. Time bends oddly here.\"",
        options: [
          { text: "I feel it too.", next: "hint" },
          { text: "This is nonsense.", next: "mad" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "peaceful": {
        text: `<span style="color: #dabd50;"><em>The Mystic chuckles softly.</em></span><br><br>\"Then you are either truly brave... or blissfully blind. Time will reveal which.\"`,
        options: [
          { text: "So what’s your advice?", next: "hint" },
          { text: "You’re weird.", next: "mad" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "hint": {
        text: "\"Return to me when the sun is swallowed and the wind carries no birdsong... Only then shall I guide you further.\"<br><br>*He turns away, vanishing as silently as he appeared.*",
        options: [
          { text: "I'll be back.", next: "end" }
        ]
        // A quest hook could be triggered here in the future
      },
      "mad": {
        text: `<span style="color: #dabd50;"><em>The Mystic gives you a tired smile.</em></span><br><br>\"Many have said the same... before vanishing forever.\"`,
        options: [
          { text: "Creepy.", next: "end" },
          { text: "Goodbye.", next: "end" }
        ]
      },
      "end": {
        text: `<span style="color: #dabd50;"><em>The Old Mystic bows faintly.</em></span><br><br>\"Tread carefully, wanderer. Not all paths lead home...\"`
      }
    }
  },
  "town_merchant": {
    id: "town_merchant",
    name: "Marla the Merchant",
    location: "oakheart-village",
    portrait: "assets/npcs/merchant.png",
    journal: {
      title: "Marla the Merchant",
      text: "Always ready with a smile and a bargain, Marla keeps Oakheart supplied with necessities and gossip.",
      locationHint: "Oakheart Village",
      tags: ["npc"]
    },
    dialogue: {
      "start": {
        text: "Welcome traveler! Care to browse my wares?",
        options: [
          { text: "Trade", action: () => openShop('general_goods') },
          { text: "Goodbye", next: "end" }
        ]
      },
      "end": {
        text: "Come again when you need supplies."
      }
    }
  },
  "town_blacksmith": {
    id: "town_blacksmith",
    name: "Borik the Smith",
    location: "oakheart-village",
    portrait: "assets/npcs/blacksmith.png",
    journal: {
      title: "Borik the Smith",
      text: "Gruff but dependable, Borik forges the arms that keep the village safe.",
      locationHint: "Blacksmith Forge",
      tags: ["npc"]
    },
    dialogue: {
      "start": {
        text: "Weapons, armor... I forge it all.",
        options: [
          { text: "Trade", action: () => openShop('blacksmith') },
          { text: "Goodbye", next: "end" }
        ]
      },
      "end": { text: "Keep your blade sharp." }
    }
  },
  "innkeeper": {
    id: "innkeeper",
    name: "Tomas the Innkeeper",
    location: "oakheart-village",
    portrait: "assets/npcs/innkeeper.png",
    journal: {
      title: "Tomas the Innkeeper",
      text: "Keeper of the Sleepy Stoat, Tomas always has a warm meal and a tale for those who linger.",
      locationHint: "The Sleepy Stoat",
      tags: ["npc"]
    },
    dialogue: {
      "start": {
        text: "Need a place to rest? The beds are clean enough.",
        options: [ { text: "Just looking", next: "end" } ]
      },
      "end": { text: "Safe travels." }
    }
  }
};
