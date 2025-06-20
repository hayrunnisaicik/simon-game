const game = {
  count: 0,
  colors: ['green', 'red', 'yellow', 'blue'],
  compSeq: [],
  playerSeq: [],
  strict: false,
  sound: {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  }
};

function playSound(color) {
  const snd = game.sound[color];
  if (snd) snd.play();
}

function animateButton(color) {
  const btn = document.getElementById(color);
  if (!btn) return;
  btn.classList.add('animate');
  playSound(color);
  setTimeout(() => btn.classList.remove('animate'), 500);
}

function updateCount() {
  const countDisplay = document.getElementById('count-num');
  countDisplay.textContent = game.count < 10 ? '0' + game.count : game.count;
}

function resetGame() {
  game.count = 0;
  game.compSeq = [];
  game.playerSeq = [];
  updateCount();
}

function generateNext() {
  game.count++;
  updateCount();
  const nextColor = game.colors[Math.floor(Math.random() * game.colors.length)];
  game.compSeq.push(nextColor);
  playSequence();
}

function playSequence() {
  let i = 0;
  game.playerSeq = [];
  const interval = setInterval(() => {
    animateButton(game.compSeq[i]);
    i++;
    if (i >= game.compSeq.length) clearInterval(interval);
  }, 800);
}

function checkPlayerMove(color) {
  const idx = game.playerSeq.length - 1;
  if (game.compSeq[idx] !== color) {
    playSound(color);
    if (game.strict) {
      showFinalMessage('You lost! Try again.');
    } else {
      alert('Wrong move! Try again.');
      playSequence();
    }
    return;
  }
  if (game.playerSeq.length === game.compSeq.length) {
    if (game.count === 20) {
      showFinalMessage('Congratulations! You won!');
    } else {
      setTimeout(generateNext, 1000);
    }
  }
}

function showFinalMessage(message) {
  const board = document.getElementById('board');
  const finalScreen = document.getElementById('final-screen');
  const msg = document.getElementById('msg');

  msg.textContent = message;
  board.style.display = 'none';
  finalScreen.style.display = 'block';
}

function startGame() {
  resetGame();
  generateNext();
}

function toggleStrict() {
  const strictCheckbox = document.getElementById('strict');
  game.strict = strictCheckbox.checked;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').addEventListener('click', () => {
    toggleStrict();
    startGame();
  });

  game.colors.forEach(color => {
    const btn = document.getElementById(color);
    if (btn) {
      btn.addEventListener('click', () => {
        game.playerSeq.push(color);
        animateButton(color);
        checkPlayerMove(color);
      });
    }
  });

  document.getElementById('new-game').addEventListener('click', () => {
    const board = document.getElementById('board');
    const finalScreen = document.getElementById('final-screen');
    board.style.display = 'flex';
    finalScreen.style.display = 'none';
    document.getElementById('strict').checked = false;
    game.strict = false;
    resetGame();
  });
});
