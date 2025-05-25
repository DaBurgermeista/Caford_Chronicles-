// Grab each button
const startBtn = document.getElementById('start');
const loadBtn = document.getElementById('load');
const optionsBtn = document.getElementById('options');
const creditsBtn = document.getElementById('credits');

const messageBox = document.getElementById('message');
const menuItems = Array.from(document.querySelectorAll('.menu li'));

let typingInterval;
let fadeTimeout;
let selectedIndex = 0;

menuItems[selectedIndex].classList.add('selected');

fetch('version.json')
  .then((res) => res.json())
  .then((data) => {
    document.getElementById('version').textContent = `Version: ${data.version}`;
  });


function typeMessage(message) {
  // Clear Stuff
  clearTimeout(fadeTimeout);
  clearInterval(typingInterval);
  messageBox.innerHTML = `<span class="message-text"></span><span class="cursor">_</span>`;

  const textSpan = messageBox.querySelector('.message-text');
  const cursor = messageBox.querySelector('.cursor');
  let i = 0;

  typingInterval = setInterval(() => {
    if (i < message.length) {
      textSpan.textContent += message[i];
      i++;
    } else {
      clearInterval(typingInterval);
      // Fade
      fadeTimeout = setTimeout(() => {
        textSpan.classList.add('fade-out');
        cursor.style.animation = 'none';
        setTimeout(() => {
          cursor.classList.add('fade-out');
        }, 10);
      }, 3000);
    }
  }, 50);
}

document.addEventListener('keydown', (e) => {
  const keysToBlock = ['ArrowUp', 'ArrowDown'];

  if (keysToBlock.includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === 'ArrowDown') {
    menuItems[selectedIndex].classList.remove('selected');
    selectedIndex = (selectedIndex + 1) % menuItems.length;
    menuItems[selectedIndex].classList.add('selected');
  } else if (e.key === 'ArrowUp') {
    menuItems[selectedIndex].classList.remove('selected');
    selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
    menuItems[selectedIndex].classList.add('selected');
  } else if (e.key === 'Enter') {
    const selectedOption = menuItems[selectedIndex].textContent;
    typeMessage(`> ${selectedOption} selected.`);

    if (selectedOption === 'Credits') {
      document.getElementById('credits-modal').classList.remove('hidden');
    } else if (selectedOption === 'Start Game') {
      setTimeout(() => {
        window.location.href = 'game.html';
      }, 1000);
    }
  }
});

document.querySelectorAll('.menu li').forEach((item) => {
  const option = item.textContent;
  item.addEventListener('click', () => {
    typeMessage(`> ${option} selected.`);

    if (option === 'Start Game') {
      setTimeout(() => {
        window.location.href = 'game.html';
      }, 1000);
    }

    if (option === 'Credits') {
      document.getElementById('credits-modal').classList.remove('hidden');
    }
  });
});

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('credits-modal').classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('credits-modal').classList.add('hidden');
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    document.querySelector('.sidebar').classList.toggle('hidden');
  }
});
