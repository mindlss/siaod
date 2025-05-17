const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Stack {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }
}

function checkParenthesesBalance(filePath) {
    const stack = new Stack();

    const data = fs.readFileSync(filePath, 'utf-8');

    for (const char of data) {
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            if (stack.isEmpty()) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.isEmpty();
}

console.log(chalk.blue.bold('Проверка баланса круглых скобок\n'));

const inputPath = path.join(__dirname, '../program.txt');

const balanced = checkParenthesesBalance(inputPath);

if (balanced) {
    console.log(chalk.green('Баланс круглых скобок соблюдён.'));
} else {
    console.log(chalk.red('Баланс круглых скобок НЕ соблюдён!'));
}
