import { npcs } from './npcs.js';
import { player } from './player.js'

let currentNpc = null;
let currentNode = null;

export function talkToNpc(npcId) {
    const npc = npcs[npcId];
    if (!npc) return;
    if (player.inCombat) return;

    currentNpc = npc;
    currentNode = 'start';

    renderNpcDialogue();
    document.getElementById('npc-modal').classList.remove('hidden');
}

function renderNpcDialogue() {
  const node = currentNpc.dialogue[currentNode];
  document.getElementById('npc-name').textContent = currentNpc.name;
  document.getElementById('npc-dialogue-text').innerHTML = node.text;
  document.getElementById('npc-portrait').src = currentNpc.portrait || '';

  const optionsDiv = document.getElementById('npc-options');
  optionsDiv.innerHTML = '';
  (node.options || []).forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.onclick = () => {
      if (typeof option.action === 'function') {
        option.action();
      }
      if (option.next) {
        currentNode = option.next;
        if (currentNode === 'end') {
          closeNpcModal();
        } else {
          renderNpcDialogue();
        }
      } else if (!option.action) {
        closeNpcModal();
      }
    };
    optionsDiv.appendChild(btn);
  });
}

export function closeNpcModal() {
  document.getElementById('npc-modal').classList.add('hidden');
  currentNpc = null;
  currentNode = null;
}