const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Deque {
    constructor(items = []) {
        this.items = [...items];
    }
    isEmpty() {
        return this.items.length === 0;
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
    peekAt(i) {
        return this.items[i];
    }
    size() {
        return this.items.length;
    }
    indexOf(item) {
        return this.items.indexOf(item);
    }
}

console.log(chalk.blue.bold('Расшифровка сообщения с помощью дека\n'));

const seqPath = path.join(__dirname, '../sequence.txt');
const inputPath = path.join(__dirname, '../encrypted.txt');
const outputPath = path.join(__dirname, '../decrypted.txt');

const sequence = fs.readFileSync(seqPath, 'utf-8').trim().split('');
const deque = new Deque(sequence);

console.log(
    chalk.cyan(`Последовательность символов (deque):\n${sequence.join('')}\n`)
);

const encrypted = fs.readFileSync(inputPath, 'utf-8');
console.log(chalk.green('Зашифрованное сообщение (первые 100 символов):'));
console.log(chalk.yellow(encrypted.slice(0, 100)));
if (encrypted.length > 100) console.log(chalk.gray('…\n'));

const N = deque.size();
const decrypted = [...encrypted]
    .map((ch) => {
        const i = deque.indexOf(ch);
        if (i === -1) {
            return ch;
        }
        const origIdx = (i - 2 + N) % N;
        return deque.peekAt(origIdx);
    })
    .join('');

console.log(chalk.green('\nРасшифрованное сообщение (первые 100 символов):'));
console.log(chalk.yellow(decrypted.slice(0, 100)));
if (decrypted.length > 100) console.log(chalk.gray('…\n'));

fs.writeFileSync(outputPath, decrypted, 'utf-8');
console.log(chalk.cyan(`\n✅ Расшифровка сохранена в файл: ${outputPath}\n`));
