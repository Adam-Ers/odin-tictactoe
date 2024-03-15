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

const gameBoard = (function () { 
    const columns = 3;
    const rows = 3;
    const board = [];
    let turn = "X";

    const header = document.querySelector('.boardHeader');
    const buttons = document.querySelectorAll('.boardButton');

    const start = () => {
        for (y = 0; y < rows; y++) {
            board[y] = [];
            for (x = 0; x < columns; x++) {
                board[y].push(createTile());
            }
        }

        console.log(buttons);
        buttons.forEach(button => {
            button.addEventListener('click', tryTile);
        });

        // console.log(board);
    };

    const print = () => {
        const printableBoard = board.map(x => x.map(tile => tile.getTile()));
        console.log(printableBoard);
    }

    const changeTurn = () => {
        if (turn === "X") { turn = "O";}
        else { turn = "X"; }
        header.textContent = `${turn} Turn`;
    }

    const tryTile = e => {
        const buttonID = parseInt(e.target.id) - 1;
        const buttonRow = Math.floor((buttonID) / 3);
        const buttonColumn = buttonID - (buttonRow * 3);

        const tile = board[buttonRow][buttonColumn];
        if (tile.checkTileEmpty())
        {
            tile.setTile(turn);
            e.target.textContent = turn;
            changeTurn();
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