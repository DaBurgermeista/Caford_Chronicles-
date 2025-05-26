import { player } from "./player.js";
import { showStoryEventDialog, log, renderHud, renderInventory } from "./game.js";

export const events = {
  "forest-chant": {
    id: "forest-chant",
    name: "The Faint Chanting",
    trigger: "onEnter",
    chance: 1.0,
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

                log("You find a forgotten altar. A glowing charm lies waiting. It hums with gentle energy.");
                player.progression.completedEvents.push("forest-chant");
                renderInventory();
              } else {
                player.derivedStats.hp = Math.max(0, player.derivedStats.hp - 5);
                log("You stumble through brambles, bloodied and confused. The chanting fades.");
              }
              renderHud();
            }
          },
          {
            text: "Ignore It",
            action: () => {
              log("You keep moving. The chanting fades. But you feel watched...");
            }
          }
        ]
      );
    }
  },

  // other events...
};
