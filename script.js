function createTile() {
    let tile = "_";
    const getTile = () => tile;
    const setTile = value => { tile = value; };
    const isTileEmpty = () => { return tile === "_"; };

    return { 
        setTile, getTile, isTileEmpty,
    };
}

const domController = (function () {
    const header = document.querySelector('.boardHeader');
    const buttons = document.querySelectorAll('.boardButton');
    const player1NameInput = document.querySelector('#player1Name');
    const player2NameInput = document.querySelector('#player2Name');
    const restartButton = document.querySelector('.restartButton');
    let player1Name = "X";
    let player2Name = "O";

    const crossPath = "./cross.svg";
    const circlePath = "./circle.svg";

    const initialize = () => {
        resetButtons();
        assignButtonsToFunction(gameBoard.tryTile);

        player1NameInput.addEventListener("blur", e => { changePlayerName(1, e.target.value); });
        player2NameInput.addEventListener("blur", e => { changePlayerName(2, e.target.value); });
        restartButton.addEventListener("click", gameBoard.restart);
    };

    const assignButtonsToFunction = func => {
        buttons.forEach(button => {
            button.addEventListener('click', func);
        });
    };

    const changePlayerName = (player, name) => {
        if (name === '') { name = player != 2 ? "X" : "O"; }
        if (player === 2) { player2Name = name; }
        else { player1Name = name; }
        changeHeaderPlayer(player);
    };

    const changeHeaderText = text => { header.textContent = text; };

    const changeHeaderPlayer = player => {
        let playerText = player != 2 ? player1Name : player2Name;
        changeHeaderText(`${playerText}'s Turn`);
        if (gameBoard.isGameOver()) { changeHeaderText(`${playerText} wins!`); }
    };

    const changeButtonText = (button, text) => { button.textContent = text; };

    const changeButtonSymbol = (button, symbol) => {
        button.innerHTML = "";
        const path = symbol === "X" ? crossPath : circlePath;

        const img = document.createElement('img');
        img.setAttribute("src", path);
        button.appendChild(img);
    }

    const resetButtons = () => {
        buttons.forEach(button => {
            button.innerHTML = "";
        });
    };

    return { 
        initialize,
        changeButtonText,
        changeButtonSymbol,
        changeHeaderPlayer,
        assignButtonsToFunction,
        resetButtons,
    };
})();

const gameBoard = (function () { 
    const columns = 3;
    const rows = 3;
    const board = [];
    let turn = 1;
    let currentTurnMark = "X";
    let gameOver = false;
    const isGameOver = () => gameOver;

    const start = () => {
        createBoard();
        domController.initialize();
    };

    const restart = () => { 
        turn = 1;
        currentTurnMark = "X";
        gameOver = false;
        start();
        domController.changeHeaderPlayer(turn);
     };

    const createBoard = () => {
        for (i = 0; i < board.length; i++) { board.pop(); }
        for (y = 0; y < rows; y++) {
            board[y] = [];
            for (x = 0; x < columns; x++) {
                board[y].push(createTile());
            }
        }
    };

    const print = () => {
        const printableBoard = board.map(x => x.map(tile => tile.getTile()));
        console.log(printableBoard);
    }

    const changeTurn = () => {
        if (gameOver) { return; }
        if (turn === 1) { turn = 2;}
        else { turn = 1; }
        currentTurnMark = turn != 2 ? "X" : "O";
        domController.changeHeaderPlayer(turn);
    }

    const tryTile = e => {
        if (gameOver) { return; }
        const buttonID = parseInt(e.target.id) - 1;
        const buttonRow = Math.floor((buttonID) / 3);
        const buttonColumn = buttonID - (buttonRow * 3);

        const tile = board[buttonRow][buttonColumn];
        if (tile.isTileEmpty())
        {
            tile.setTile(currentTurnMark);
            domController.changeButtonSymbol(e.target, currentTurnMark);
            checkWin();
            changeTurn();
        }
    }

    const checkWin = () => {
        let rowMarks = new Array(rows);
        rowMarks.fill(0);
        let columnMarks = new Array(columns);
        columnMarks.fill(0);
        // Check each tile for the player's mark and add it to that row and column's tally.
        for (y = 0; y < rows; y++) {
            for (x = 0; x < columns; x++) {
                if (board[y][x].getTile() === currentTurnMark) {
                    rowMarks[y] += 1;
                    columnMarks[x] += 1;
                }
            }
        }
        // See if either one has the value of its length (the height or width of the board) and award a win if so.
        if (rowMarks.includes(rows) || columnMarks.includes(columns)) {
            gameOver = true;
        }

        // Check diagonals by using a for loop (only works if rows = columns)
        if (rows === columns) {
            let counter = 0;
            // First from top-left to bottom-right
            for (pos = 0; pos < rows; pos++) {
                if (board[pos][pos].getTile() === currentTurnMark) {
                    counter++;
                }
            }

            if (counter === rows) { gameOver = true;}
            // Then try from top-right to bottom-right
            let y = 0;
            counter = 0;
            for (x = rows - 1; x >= 0; x--) {
                if (board[y][x].getTile() === currentTurnMark) {
                    counter++;
                }
                y++;
            }

            if (counter === rows) { gameOver = true; }

            domController.changeHeaderPlayer(turn);
        }
    }
    
    return {
        isGameOver,
        start,
        print,
        tryTile,
        restart,
    };
})();

window.addEventListener("load", (e) => {
    gameBoard.start();
})