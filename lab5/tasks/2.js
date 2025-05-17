import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import PriorityQueue from 'priorityqueuejs';

const SIZE = 4;
const GOAL = Array.from({ length: 15 }, (_, i) => i + 1).concat(0);

function isSolvable(puzzle) {
    let inversions = 0;
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = i + 1; j < puzzle.length; j++) {
            if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
                inversions++;
            }
        }
    }
    const blankRow = Math.floor(puzzle.indexOf(0) / SIZE);
    if (SIZE % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        return (SIZE - blankRow) % 2 === 0
            ? inversions % 2 === 1
            : inversions % 2 === 0;
    }
}

function getNeighbors(state) {
    const neighbors = [];
    const zeroPos = state.indexOf(0);
    const x = zeroPos % SIZE;
    const y = Math.floor(zeroPos / SIZE);

    const moves = [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
    ];

    for (const [nx, ny] of moves) {
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
            const newPos = ny * SIZE + nx;
            const newState = state.slice();
            [newState[zeroPos], newState[newPos]] = [
                newState[newPos],
                newState[zeroPos],
            ];
            neighbors.push({ state: newState, moved: newState[zeroPos] });
        }
    }

    return neighbors;
}

function manhattan(state) {
    let dist = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] === 0) continue;
        const correctPos = state[i] - 1;
        const x1 = i % SIZE,
            y1 = Math.floor(i / SIZE);
        const x2 = correctPos % SIZE,
            y2 = Math.floor(correctPos / SIZE);
        dist += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    return dist;
}

function solvePuzzle(start) {
    if (!isSolvable(start)) return [];

    const goalStr = GOAL.join(',');
    const visited = new Set();

    const pq = new PriorityQueue((a, b) => b.priority - a.priority);
    pq.enq({ state: start, path: [], cost: 0, priority: manhattan(start) });

    while (!pq.isEmpty()) {
        const { state, path, cost } = pq.deq();
        const stateStr = state.join(',');
        if (visited.has(stateStr)) continue;
        visited.add(stateStr);

        if (stateStr === goalStr) return path;

        for (const neighbor of getNeighbors(state)) {
            const newPath = [...path, neighbor.moved];
            const newCost = cost + 1;
            const priority = newCost + manhattan(neighbor.state);
            pq.enq({
                state: neighbor.state,
                path: newPath,
                cost: newCost,
                priority,
            });
        }
    }

    return [];
}

function printBoard(state) {
    let board = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const val = state[i * SIZE + j];
            board +=
                val === 0
                    ? chalk.bgWhite('    ')
                    : chalk.bgBlue(` ${val.toString().padStart(2)} `);
        }
        board += '\n';
    }
    console.log(board);
}

function main() {
    const filePath = path.resolve(process.cwd(), 'puzzle.txt');
    if (!fs.existsSync(filePath)) {
        console.error(chalk.red('Ошибка: файл puzzle.txt не найден.'));
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const input = content.split(/\s+/).map(Number);

    if (
        input.length !== SIZE * SIZE ||
        input.some((n) => n < 0 || n > 15 || isNaN(n))
    ) {
        console.error(
            chalk.red(
                `Ошибка: файл должен содержать ${SIZE * SIZE} чисел от 0 до 15.`
            )
        );
        process.exit(1);
    }

    console.log(chalk.blue.bold('Начальная позиция:'));
    printBoard(input);

    if (!isSolvable(input)) {
        console.log(chalk.red('Данная позиция НЕ решаема.'));
        process.exit(0);
    } else {
        console.log(chalk.green('Позиция решаема. Ищу решение...'));
    }

    const startTime = process.hrtime.bigint();
    const solution = solvePuzzle(input);
    const endTime = process.hrtime.bigint();

    if (solution.length === 0) {
        console.log(chalk.red('Решение не найдено.'));
    } else {
        console.log(
            chalk.green(
                `Решение найдено за ${(
                    Number(endTime - startTime) / 1e6
                ).toFixed(3)} мс.`
            )
        );
        console.log(chalk.yellow('Последовательность ходов:'));
        console.log(solution.join(' → '));
    }
}

main();
