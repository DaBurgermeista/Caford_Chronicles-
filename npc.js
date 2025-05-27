import { npcs } from './npcs.js';

let currentNpc = null;
let currentNode = null;

export function talkToNpc(npcId) {
    const npc = npcs[npcId];
    if (!npc) return;

    currentNpc = npc;
    currentNode = 'start';

    renderNpcDialogue();
    document.getElementById('npc-modal').classList.remove('hidden');
}

function renderNpcDialogue() {
  const node = currentNpc.dialogue[currentNode];
  document.getElementById('npc-name').textContent = currentNpc.name;
  document.getElementById('npc-dialogue-text').textContent = node.text;
  document.getElementById('npc-portrait').src = currentNpc.portrait || '';

  const optionsDiv = document.getElementById('npc-options');
  optionsDiv.innerHTML = '';
  (node.options || []).forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.onclick = () => {
      currentNode = option.next;
      if (currentNode === 'end') {
        closeNpcModal();
      } else {
        renderNpcDialogue();
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