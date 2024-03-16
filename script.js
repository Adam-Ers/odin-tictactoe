function createTile() {
    let tile = "_";
    
    const checkTileEmpty = () => {
        return tile === "_";
    };

    const setTile = value => {
        tile = value;
    };

    const getTile = () => tile;

    return { 
        setTile, getTile, checkTileEmpty,
    };
}

const displayController = (function () {
    const header = document.querySelector('.boardHeader');
    const buttons = document.querySelectorAll('.boardButton');

    const initialize = () => {
        buttons.forEach(button => {
            button.textContent = "";
        });

        assignButtonsToFunction(gameBoard.tryTile);
    }

    const assignButtonsToFunction = func => {
        buttons.forEach(button => {
            button.addEventListener('click', func);
        });
    };

    const changeHeaderText = text => {
        header.textContent = text;
    };

    const changeButtonText = (button, text) => {
        button.textContent = text;
    }

    return { 
        initialize,
        changeHeaderText,
        changeButtonText,
        assignButtonsToFunction,
    };
})();

const gameBoard = (function () { 
    const columns = 3;
    const rows = 3;
    const board = [];
    let turn = "X";
    let gameOver = false;

    const start = () => {
        for (y = 0; y < rows; y++) {
            board[y] = [];
            for (x = 0; x < columns; x++) {
                board[y].push(createTile());
            }
        }

        displayController.initialize();
    };

    const print = () => {
        const printableBoard = board.map(x => x.map(tile => tile.getTile()));
        console.log(printableBoard);
    }

    const changeTurn = () => {
        if (gameOver) { return; }
        if (turn === "X") { turn = "O";}
        else { turn = "X"; }
        displayController.changeHeaderText(`${turn} Turn`);
    }

    const tryTile = e => {
        if (gameOver) { return; }
        const buttonID = parseInt(e.target.id) - 1;
        const buttonRow = Math.floor((buttonID) / 3);
        const buttonColumn = buttonID - (buttonRow * 3);

        const tile = board[buttonRow][buttonColumn];
        if (tile.checkTileEmpty())
        {
            tile.setTile(turn);
            displayController.changeButtonText(e.target, turn);
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
                if (board[y][x].getTile() === turn) {
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
                if (board[pos][pos].getTile() === turn) {
                    counter++;
                }
            }

            if (counter === rows) { gameOver = true;}
            // Then try from top-right to bottom-right
            let y = 0;
            counter = 0;
            for (x = rows - 1; x >= 0; x--) {
                if (board[y][x].getTile() === turn) {
                    counter++;
                }
                y++;
            }

            if (counter === rows) { gameOver = true; }
        }

        if (gameOver) {
            displayController.changeHeaderText(`${turn} wins!`);
        }
    }
    
    return {
        start,
        print,
        tryTile,
    };
})();

window.addEventListener("load", (e) => {
    gameBoard.start();
})