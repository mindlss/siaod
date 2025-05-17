const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Stack {
    constructor(name) {
        this.items = [];
        this.name = name;
    }

    push(item) {
        if (!this.isEmpty() && item > this.peek()) {
            throw new Error(
                `Нельзя класть диск ${item} на диск меньшего размера ${this.peek()}`
            );
        }
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

function moveDisks(n, source, target, auxiliary, moves) {
    if (n === 1) {
        const disk = source.pop();
        target.push(disk);
        moves.push(
            `Переместить диск ${disk} со стержня ${source.name} на стержень ${target.name}`
        );
        return;
    }
    moveDisks(n - 1, source, auxiliary, target, moves);
    moveDisks(1, source, target, auxiliary, moves);
    moveDisks(n - 1, auxiliary, target, source, moves);
}

console.log(
    chalk.blue.bold('Перенос дисков между стержнями с использованием стеков\n')
);

const inputPath = path.join(__dirname, '../disks.txt');

const data = fs.readFileSync(inputPath, 'utf-8');

const disks = data
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map(Number)
    .sort((a, b) => b - a);

const A = new Stack('A');
const B = new Stack('B');
const C = new Stack('C');

disks.forEach((disk) => A.push(disk));

const moves = [];

moveDisks(disks.length, A, C, B, moves);

console.log(chalk.cyan(`Всего ходов: ${moves.length}`));
moves.forEach((move) => console.log(move));

const outputPath = path.join(__dirname, '../moves.txt');
fs.writeFileSync(outputPath, moves.join('\n'), 'utf-8');
console.log(chalk.cyan(`\n✅ Результат сохранён в файл: ${outputPath}\n`));
