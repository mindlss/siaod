import chalk from 'chalk';

function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i] === col || Math.abs(board[i] - col) === row - i) {
            return false;
        }
    }
    return true;
}

function solveNQueens(row = 0, board = [], solutions = []) {
    if (row === 8) {
        solutions.push([...board]);
        return;
    }

    for (let col = 0; col < 8; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            solveNQueens(row + 1, board, solutions);
        }
    }
}

function printBoard(board) {
    const size = 8;
    const queen = chalk.green.bold('♛');
    for (let row = 0; row < size; row++) {
        let line = '';
        for (let col = 0; col < size; col++) {
            const isQueen = board[row] === col;

            const isBlackCell = (row + col) % 2 === 1;
            const cellChar = isQueen ? queen : ' ';
            if (isBlackCell) {
                line += chalk.bgBlack(` ${cellChar} `);
            } else {
                line += chalk.bgGray.black(` ${cellChar} `);
            }
        }
        console.log(line);
    }
}

function main() {
    const solutions = [];
    solveNQueens(0, [], solutions);

    console.log(chalk.green(`Найдено решений: ${solutions.length}`));
    if (solutions.length > 0) {
        console.log(chalk.blue('Пример решения:'));
        printBoard(solutions[0]);
    }
}

main();
