import { player } from "./player.js";
import { showStoryEventDialog, log, renderHud, renderInventory } from "./game.js";

export const events = {
  "forest-chant": {
    id: "forest-chant",
    name: "The Faint Chanting",
    trigger: "onEnter",
    chance: 0.3,
    description: "You pause. Beneath the rustling leaves and birdsong… is that chanting? Faint. Musical. Definitely not natural. It’s coming from deeper in the glade. Do you follow it?",
    effect: (player, location) => {
        if (player.progression.completedEvents.includes("forest-chant")) {
          log("You feel a familiar chill in the air, but the chanting is gone. Perhaps it was just your imagination.");
            return; // Event already completed
        }
      showStoryEventDialog(
        "The Faint Chanting",
        "You pause. Beneath the rustling leaves and birdsong… is that chanting? It’s coming from deeper in the glade. You can feel your skin prickle.",
        [
          {
            text: "Follow the Chant",
            action: () => {
              if (player.coreStats.wisdom >= 10) {
                // Add charm to inventory manually
                const existing = player.inventory.find(item => item.id === "mystic_charm");
                if (existing) {
                  existing.quantity += 1;
                } else {
                  player.inventory.push({ id: "mystic_charm", quantity: 1 });
                }
                player.progression.completedEvents.push("forest-chant");
                renderInventory();
                renderHud();
                return "You find a forgotten altar. You find a glowing <span class='tooltip-item' data-itemid='mystic_charm'>Mystic Charm</span> nestled in the roots. It hums with gentle energy.";
              } else {
                player.derivedStats.hp = Math.max(0, player.derivedStats.hp - 5);
                renderHud();
                return "You stumble through brambles, bloodied and confused. The chanting fades.";
              }
              
            }
          },
          {
            text: "Ignore It",
            action: () => {
              return "You keep moving. The chanting fades. But you feel watched...";
            }
          }
        ]
      );
    }
  },
  "glade-hollow-tree": {
    id: "glade-hollow-tree",
    name: "The Hollow Tree",
    trigger: "onExplore",
    chance: 0.25,
    description: "You find an ancient tree with a dark hollow. Something gleams inside.",
    effect: (player, location) => {
        if (player.progression.completedEvents.includes("glade-hollow-tree")) {
        return "The hollow is empty now, just a silent knot in the bark.";
        }

        showStoryEventDialog(
        "The Hollow Tree",
        "You stumble upon an old tree split by lightning, its interior blackened and hollow. Something glints deep inside.",
        [
            {
            text: "Reach inside",
            action: () => {
                if (player.coreStats.dexterity >= 8) {
                player.inventory.push({ id: "silver_leaf", quantity: 1 });
                player.progression.completedEvents.push("glade-hollow-tree");
                renderInventory();
                return "You deftly retrieve a rare Silver Leaf from inside!";
                } else {
                player.derivedStats.hp = Math.max(0, player.derivedStats.hp - 3);
                renderHud();
                return "You reach in and something bites! You pull your hand back, bleeding.";
                }               
            }
            },
            {
            text: "Leave it alone",
            action: () => {
                return "You decide not to risk it. The forest watches in silence.";
            }
            }
        ]
        );
    }
    },
    "ruins-echoes": {
      id: "ruins-echoes",
      name: "Echoes of War",
      trigger: "onEnter",
      chance: 0.3,
      description: "You step through the crumbling arch and feel a sudden chill, as if the ruin remembers something...",
      effect: (player, location) => {
        if (player.progression.completedEvents.includes("ruins-echoes")) {
          showStoryEventDialog(
            "Echoes of War",
            "The silence feels heavier than before, like the ruin is watching you.",
            [
              {
                text: "Close",
                action: () => {
                  return "You quietly move on, trying not to disturb the ghosts of the past.";
                }
              }
            ]
          );
          return;
        }

        showStoryEventDialog(
          "Echoes of War",
          "Ghostly figures shimmer into view — soldiers locked in eternal battle. You watch as they vanish into dust.",
          [
            {
              text: "Continue",
              action: () => {
                player.progression.completedEvents.push("ruins-echoes");
                player.progression.xp += 10;
                renderHud();
                return "The vision fades. You feel the weight of unseen memories... and gain 10 XP.";
              }
            }
          ]
        );
      }
    },
    "ruins-collapse": {
    id: "ruins-collapse",
    name: "Collapsed Passage",
    trigger: "onExplore",
    chance: 0.15,
    description: "The ground shifts underfoot. A nearby passage groans ominously...",
    effect: (player, location) => {
        if (player.progression.completedEvents.includes("ruins-collapse")) {
        return "You remember where the collapse happened and avoid it carefully.";
        }

        showStoryEventDialog(
        "Collapsed Passage",
        "The floor cracks open, stones tumbling into shadow! You just manage to stay upright. Below… something glows.",
        [
            {
            text: "Climb down carefully",
            action: () => {
                if (player.coreStats.strength >= 9) {
                player.inventory.push({ id: "ancient_relic", quantity: 1 });
                player.progression.completedEvents.push("ruins-collapse");
                renderInventory();
                renderHud();
                return "You climb down and recover an Ancient Relic from the rubble.";
                } else {
                player.derivedStats.hp = Math.max(0, player.derivedStats.hp - 4);
                renderHud();
                return "You lose your footing and land hard. The relic remains out of reach.";
                }
            }
            },
            {
            text: "Stay above",
            action: () => {
                return "You back away cautiously. Whatever’s down there will have to wait.";
            }
            }
        ]
        );
    }
    }


  // other events...
};
