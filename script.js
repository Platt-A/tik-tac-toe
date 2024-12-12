// JavaScript (script.js)
const Gameboard = (() => {
    let board = Array(9).fill("");

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (!board[index]) {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => board.fill("");

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => ({ name, marker });

const GameController = (() => {
    let players = [],
        currentPlayerIndex = 0,
        isGameOver = false;

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const startGame = (player1Name, player2Name) => {
        players = [
            Player(player1Name || "Player 1", "X"),
            Player(player2Name || "Player 2", "O")
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateDisplay();
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn!`);
    };

    const playRound = (index) => {
        if (isGameOver || !Gameboard.updateBoard(index, players[currentPlayerIndex].marker)) return;

        DisplayController.updateDisplay();

        if (checkWinner(players[currentPlayerIndex].marker)) {
            isGameOver = true;
            DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
            return;
        }

        if (Gameboard.getBoard().every(cell => cell)) {
            isGameOver = true;
            DisplayController.setMessage("It's a tie!");
            return;
        }

        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn!`);
    };

    const checkWinner = (marker) => {
        return winningCombos.some(combo => {
            if (combo.every(index => Gameboard.getBoard()[index] === marker)) {
                DisplayController.highlightWinningCells(combo);
                return true;
            }
            return false;
        });
    };

    return { startGame, playRound };
})();

const DisplayController = (() => {
    const boardElement = document.querySelector(".board");
    const messageElement = document.getElementById("game-message");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");

    const initialize = () => {
        boardElement.innerHTML = Array(9).fill("").map((_, i) => `<div data-index="${i}"></div>`).join("");
        boardElement.childNodes.forEach(cell => cell.addEventListener("click", () => GameController.playRound(+cell.dataset.index)));
        startButton.addEventListener("click", startGameHandler);
        restartButton.addEventListener("click", () => GameController.startGame());
    };

    const startGameHandler = () => {
        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;
        GameController.startGame(player1Name, player2Name);
    };

    const updateDisplay = () => {
        Gameboard.getBoard().forEach((marker, i) => {
            const cell = boardElement.childNodes[i];
            cell.textContent = marker;
            cell.classList.remove("winning");
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    const highlightWinningCells = (combo) => {
        combo.forEach(index => boardElement.childNodes[index].classList.add("winning"));
    };

    return { initialize, updateDisplay, setMessage, highlightWinningCells };
})();

// Initialize the game
DisplayController.initialize();
