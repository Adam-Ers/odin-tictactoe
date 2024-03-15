const gameBoard = (function () { 
    const columns = 3;
    const rows = 3;
    const board = [];

    const start = () => {
        for (x = 0; x < columns; x++) {
            for (y = 0; y < rows; y++) {
                board.push("_");
            }
        }

        // console.log(board);
    };
    
    return {
        start,
    };
})();

window.addEventListener("load", (e) => {
    gameBoard.start();
})