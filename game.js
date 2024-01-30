const game = document.querySelector("#game");
const gameBoard = document.querySelector("#game-board");
let gameState = [];
let background;
let gameMode;
let size;

// LANDING
const landingStart = document.getElementById("landingGameMode");
const landingSetImage = document.getElementById("landingSetImage");
const landingMyImage = document.getElementById("landingMyImage");

// BUTTONS
const landingButtons = landingStart.querySelectorAll("button");
const newGameButton = document.getElementById("newGame");
const setImageButton = document.getElementById("setImage");
const myImageButton = document.getElementById("myImage");

// GAME MODE
landingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    gameMode = button.getAttribute("id");
    size = document.querySelector("#size").value;
    landingStart.style.display = "none";
    if (gameMode == "newGame") {
      background = `url(images/${Math.floor(Math.random() * 7 + 1)}.jpg)`;
      renderGame(size, background);
    }
    if (gameMode == "setImage") {
      landingSetImage.removeAttribute("style");
      for (i = 1; i <= 7; i++) {
        const img = document.createElement("img");
        img.src = `images/${i}.jpg`;
        img.width = "300";
        img.height = "300";
        img.alt = `Game Image ${i}`;
        landingSetImage.appendChild(img);
      }
      landingSetImage.addEventListener("click", (event) => {
        if (event.target.tagName == "IMG") {
          background = `url(${event.target.src})`;
          landingSetImage.style.display = "none";
          renderGame(size, background);
        }
      });
    }
    if (gameMode == "myImage") {
      landingMyImage.removeAttribute("style");
      const input = document.querySelector("#landingMyImage input");

      input.addEventListener("change", () => {
        image.src = URL.createObjectURL(input.files[0]);
        background = `url(${image.src})`;
        landingMyImage.style.display = "none";
        renderGame(size, background);
      });
    }
  });
});

// RENDER GAME
function renderGame(size, background) {
  game.removeAttribute("style");
  let boardSize = parseInt(
    getComputedStyle(gameBoard).getPropertyValue("width")
  );

  generateBoardTiles();
  shuffleArray(gameState);
  addTilesToBoard();
  updateTiles();

  function generateBoardTiles() {
    for (i = 0, x = 0; i < size; i++) {
      for (j = 0; j < size; j++, x++) {
        // Create tile
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("position", x);
        // Set background
        tile.style.background = background;
        tile.style.backgroundSize = `${
          boardSize + "px" + " " + boardSize + "px"
        }`;
        if (x == size ** 2 - 1) tile.classList.add("empty");
        // Set tile size
        tile.style.width = `${boardSize / size}px`;
        tile.style.height = `${boardSize / size}px`;
        // Set background position
        tile.style["background-position-x"] = `-${(j * boardSize) / size}px`;
        tile.style["background-position-y"] = `-${(i * boardSize) / size}px`;
        // Add tiles to array
        gameState.push(tile);
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function addTilesToBoard() {
    gameState.forEach((tile, tileIndex) => {
      tile.setAttribute("current", tileIndex);
      gameBoard.appendChild(tile);
    });
  }

  let lastEmptyPosition;

  // AUTOMATIC COMPUTER
  // setInterval(() => {
  //   let emptyX, emptyY;

  //   gameState.forEach((tile) => {
  //     if (tile.getAttribute("position") == size ** 2 - 1) {
  //       emptyX = Number(tile.getAttribute("x"));
  //       emptyY = Number(tile.getAttribute("y"));
  //     }
  //   });

  //   randomSign = ["x", "y"];
  //   randomSymbol = ["+", "-"];

  //   tempX = emptyX;
  //   tempY = emptyY;

  //   function getRandomTile() {
  //     sign = randomSign[Math.floor(Math.random() * randomSign.length)];
  //     number = randomSymbol[Math.floor(Math.random() * randomSymbol.length)];

  //     if (sign == "x" && number == "+" && emptyX < 2)
  //       return (tempX = emptyX + 1);
  //     if (sign == "x" && number == "-" && emptyX > 0)
  //       return (tempX = emptyX - 1);
  //     if (sign == "y" && number == "+" && emptyY < 2)
  //       return (tempY = emptyY + 1);
  //     if (sign == "y" && number == "-" && emptyY > 0)
  //       return (tempY = emptyY - 1);

  //     getRandomTile();
  //   }

  //   getRandomTile();
  //   move();

  //   function move() {
  //     if (lastEmptyPosition == tempX + tempY * 3) {
  //       getRandomTile();
  //       move();
  //     } else {
  //       gameState.forEach((tile) => {
  //         if (tile.getAttribute("current") == tempX + tempY * 3) {
  //           lastEmptyPosition = emptyX + emptyY * 3;
  //           tile.click();
  //         }
  //       });
  //     }
  //   }
  // }, 1);
  // AUTOMATIC COMPUTER

  gameBoard.addEventListener("click", (event) => {
    let x, y;

    gameState.forEach((tile) => {
      if (tile == event.target) {
        x = Number(tile.getAttribute("x"));
        y = Number(tile.getAttribute("y"));
      }
    });

    let emptyX, emptyY;

    gameState.forEach((tile) => {
      if (tile.getAttribute("position") == size ** 2 - 1) {
        emptyX = Number(tile.getAttribute("x"));
        emptyY = Number(tile.getAttribute("y"));
        emptyElement = tile;
      }
    });

    if (
      (y === emptyY && (x + 1 === emptyX || x - 1 === emptyX)) ||
      (x === emptyX && (y + 1 === emptyY || y - 1 === emptyY))
    ) {
      moveElement(event.target, emptyElement);
      updateTiles();
      checkIfYouWon();
    }
  });

  function moveElement(tile1, tile2) {
    const tempCurrentPosition = tile1.getAttribute("current");
    tile1.setAttribute("current", tile2.getAttribute("current"));
    tile2.setAttribute("current", tempCurrentPosition);
  }

  function updateTiles() {
    gameState.forEach((tile) => {
      tile.setAttribute("x", tile.getAttribute("current") % size);
      tile.setAttribute("y", Math.trunc(tile.getAttribute("current") / size));
      tile.style.left = `${(tile.getAttribute("x") * boardSize) / size}px`;
      tile.style.top = `${(tile.getAttribute("y") * boardSize) / size}px`;
    });
  }

  function checkIfYouWon() {
    if (
      gameState.every((tile) => {
        return tile.getAttribute("position") == tile.getAttribute("current");
      }) == true
    ) {
      gameBoard.classList.add("won");
      gameBoard.querySelector(".tile.empty").classList.remove("empty");
      document.querySelector("[end-game-text]").innerHTML = `You Won!`;
    }
  }

  // RESTART
  const buttonRestart = document.getElementById("buttonRestart");

  buttonRestart.addEventListener("click", () => {
    window.location = window.location;
  });
}

// const gameTiles = document.querySelectorAll(".tile");

// const gameState = [
//   [gameTiles[0], gameTiles[1], gameTiles[2]],
//   [gameTiles[3], gameTiles[4], gameTiles[5]],
//   [gameTiles[6], gameTiles[7], gameTiles[8]],
// ];

// function render(gameBoard, gameState) {
//   gameState.forEach((row, rowIndex) => {
//     row.forEach((column, columnIndex) => {
//       column.style.top = `${rowIndex * 100}px`;
//       column.style.left = `${columnIndex * 100}px`;
//       column.style["background-position-y"] = `-${rowIndex * 100}px`;
//       column.style["background-position-x"] = `-${columnIndex * 100}px`;
//       gameBoard.appendChild(column);
//     });
//   });
// }

// function moveElement(tile1, tile2) {
//   const tempTop = tile1.style.top;
//   const tempLeft = tile1.style.left;

//   tile1.style.top = tile2.style.top;
//   tile1.style.left = tile2.style.left;

//   tile2.style.top = tempTop;
//   tile2.style.left = tempLeft;
// }

//   if (
//     (y === emptyY && (x + 1 === emptyX || x - 1 === emptyX)) ||
//     (x === emptyX && (y + 1 === emptyY || y - 1 === emptyY))
//   ) {
//     moveElement(gameState[x][y], gameState[emptyX][emptyY]);

//     const temp = gameState[x][y];
//     gameState[x][y] = gameState[emptyX][emptyY];
//     gameState[emptyX][emptyY] = temp;
//   }
// });
