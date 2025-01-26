const gameBoard = document.getElementById("game-board");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const leaderboard = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");

const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");

const themes = {
  food: ["🍎", "🍌", "🍍", "🍉", "🍇", "🧀", "🍔", "🍊"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
};

let currentTheme = themes.food;
let difficulty = 8;
let symbolPairs = [];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let time = 0;
let timerInterval;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function selectDifficulty(level) {
  const difficulties = { easy: 8, medium: 12, hard: 16 };
  difficulty = difficulties[level];
  alert(`Difficulty set to ${level.toUpperCase()}`);
}

function changeTheme(theme) {
  currentTheme = themes[theme];
  alert(`Theme set to ${theme.toUpperCase()}`);
}

function startGame() {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  leaderboard.style.display = "none";

  symbolPairs = shuffle([...currentTheme.slice(0, difficulty / 2), ...currentTheme.slice(0, difficulty / 2)]);
  matchedCards = 0;
  moves = 0;
  time = 0;
  flippedCards = [];
  updateStats();
  clearInterval(timerInterval);

  startTimer();
  createBoard();
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timerElement.textContent = `Time: ${time}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateStats() {
  movesElement.textContent = `Moves: ${moves}`;
}

function createBoard() {
  gameBoard.innerHTML = "";
  symbolPairs.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = symbol;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.dataset.symbol = symbol;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  moves++;
  updateStats();

  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchedCards += 2;
    flippedCards = [];

    if (matchedCards === symbolPairs.length) {
      stopTimer();
      setTimeout(() => {
        alert(`You win! Time: ${time}s, Moves: ${moves}`);
        saveScore();
        showLeaderboard();
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

function saveScore() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ time, moves });
  scores.sort((a, b) => a.time - b.time);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function showLeaderboard() {
  gameContainer.style.display = "none";
  leaderboard.style.display = "block";

  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  leaderboardList.innerHTML = scores
    .map((score, index) => `<li>#${index + 1}: Time - ${score.time}s, Moves - ${score.moves}</li>`)
    .join("");
}
