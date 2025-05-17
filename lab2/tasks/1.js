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

    toArray() {
        return [...this.items];
    }
}

function sortBooksWithDeques(lines) {
    const dequeSorted = new Deque();
    const buffer = new Deque();

    for (const line of lines) {
        while (
            !dequeSorted.isEmpty() &&
            dequeSorted.peekFront().localeCompare(line) < 0
        ) {
            buffer.pushBack(dequeSorted.popFront());
        }

        dequeSorted.pushFront(line);

        while (!buffer.isEmpty()) {
            dequeSorted.pushFront(buffer.popBack());
        }
    }

    return dequeSorted.toArray();
}

console.log(
    chalk.blue.bold('Сортировка названий книг с использованием двух деков\n')
);

const inputPath = path.join(__dirname, '../books.txt');
const outputPath = path.join(__dirname, '../sorted_books.txt');

const data = fs.readFileSync(inputPath, 'utf-8');
const lines = data.split(/\r?\n/).filter((l) => l.trim() !== '');

const sorted = sortBooksWithDeques(lines);

fs.writeFileSync(outputPath, sorted.join('\n'), 'utf-8');

console.log(chalk.green('Отсортированные книги:'));
sorted.forEach((book) => console.log(chalk.yellow(book)));

console.log(chalk.cyan(`\nРезультат сохранён в файл: ${outputPath}\n`));
