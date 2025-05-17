const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Deque {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    pushFront(item) {
        this.items.unshift(item);
    }

    pushBack(item) {
        this.items.push(item);
    }

    popFront() {
        return this.items.shift();
    }

    popBack() {
        return this.items.pop();
    }

    peekFront() {
        return this.items[0];
    }

    peekBack() {
        return this.items[this.items.length - 1];
    }
}

function checkSquareBracketsBalance(filePath) {
    const deque = new Deque();

    const data = fs.readFileSync(filePath, 'utf-8');

    for (const char of data) {
        if (char === '[') {
            deque.pushBack(char);
        } else if (char === ']') {
            if (deque.isEmpty()) {
                return false;
            }
            deque.popBack();
        }
    }

    return deque.isEmpty();
}

console.log(chalk.blue.bold('Проверка баланса квадратных скобок\n'));

const inputPath = path.join(__dirname, '../program.txt');

const balanced = checkSquareBracketsBalance(inputPath);

if (balanced) {
    console.log(chalk.green('Баланс квадратных скобок соблюдён.'));
} else {
    console.log(chalk.red('Баланс квадратных скобок НЕ соблюдён!'));
}
