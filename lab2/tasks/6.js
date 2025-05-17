const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    toArray() {
        return [...this.items];
    }
}

function processFile(filePath) {
    const stackDigits = new Stack();
    const stackLetters = new Stack();
    const stackOthers = new Stack();

    const data = fs.readFileSync(filePath, 'utf-8');

    for (const char of data) {
        if (char >= '0' && char <= '9') {
            stackDigits.push(char);
        } else if (
            (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z')
        ) {
            stackLetters.push(char);
        } else {
            stackOthers.push(char);
        }
    }

    const digits = [];
    while (!stackDigits.isEmpty()) digits.unshift(stackDigits.pop());

    const letters = [];
    while (!stackLetters.isEmpty()) letters.unshift(stackLetters.pop());

    const others = [];
    while (!stackOthers.isEmpty()) others.unshift(stackOthers.pop());

    return { digits, letters, others };
}

console.log(
    chalk.blue.bold(
        'Вывод цифр, букв и остальных символов с сохранением порядка\n'
    )
);

const inputPath = path.join(__dirname, '../chars.txt');

const { digits, letters, others } = processFile(inputPath);

console.log(chalk.yellow('Цифры:'));
console.log(chalk.green(digits.join('')));

console.log(chalk.yellow('\nБуквы:'));
console.log(chalk.green(letters.join('')));

console.log(chalk.yellow('\nПрочие символы:'));
console.log(chalk.green(others.join('')));
