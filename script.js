const gameBoard = document.getElementById("game-board");

const symbols = ["🍎", "🍌", "🍍", "🍉", "🍇", "🧀", "🍔", "🍊"];
const symbolsPairs = [...symbols, ...symbols];

let flippedCards = [];
let matchedCards = 0;

// shuffling the symbols1
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// make a card on the board
function createBoard() {
  const shuffledSymbols = shuffle(symbolsPairs);

  shuffledSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = symbol;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    card.dataset.symbol = symbol;
    card.addEventListener("click", ()=>flipCard(card))
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchedCards += 2;
    flippedCards = [];


    if (matchedCards === symbolsPairs.length) {
      setTimeout(() => alert("you win!!!"), 500);
    } 
  }
  else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
      flippedCards = [];
    }, 1000);
  }
}

createBoard();