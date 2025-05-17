import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

function buildKMPTable(pattern) {
    const table = Array(pattern.length).fill(0);
    let j = 0;

    for (let i = 1; i < pattern.length; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = table[j - 1];
        }
        if (pattern[i] === pattern[j]) {
            j++;
            table[i] = j;
        }
    }
    return table;
}

function kmpSearch(text, pattern) {
    if (pattern.length === 0) return 0;
    const table = buildKMPTable(pattern);
    let j = 0;

    for (let i = 0; i < text.length; i++) {
        while (j > 0 && text[i] !== pattern[j]) {
            j = table[j - 1];
        }
        if (text[i] === pattern[j]) {
            j++;
        }
        if (j === pattern.length) {
            return i - j + 1;
        }
    }
    return -1;
}

function buildBadCharTable(pattern) {
    const table = {};
    for (let i = 0; i < pattern.length; i++) {
        table[pattern[i]] = i;
    }
    return table;
}

function boyerMooreSearch(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    if (m === 0) return 0;

    const badCharTable = buildBadCharTable(pattern);
    let s = 0;

    while (s <= n - m) {
        let j = m - 1;

        while (j >= 0 && pattern[j] === text[s + j]) {
            j--;
        }

        if (j < 0) {
            return s;
        } else {
            const badCharIndex = badCharTable[text[s + j]] ?? -1;
            s += Math.max(1, j - badCharIndex);
        }
    }
    return -1;
}

function measureSearch(fn, text, pattern) {
    const start = process.hrtime.bigint();
    const index = fn(text, pattern);
    const end = process.hrtime.bigint();
    const timeMs = Number(end - start) / 1e6;
    return { index, timeMs };
}

function main() {
    const filePath = path.resolve(process.cwd(), 'find.txt');
    if (!fs.existsSync(filePath)) {
        console.error(chalk.red('Ошибка: файл find.txt не найден.'));
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
    if (content.length < 3) {
        console.error(
            chalk.red(
                'Ошибка: файл find.txt должен содержать 3 строки: текст, подстроку и чувствительность к регистру (yes/no).'
            )
        );
        process.exit(1);
    }

    let [text, pattern, caseSensitiveRaw] = content;

    const caseSensitive =
        caseSensitiveRaw.trim().toLowerCase() === 'yes' ? true : false;

    if (!caseSensitive) {
        text = text.toLowerCase();
        pattern = pattern.toLowerCase();
    }

    console.log(chalk.blue.bold('Текст:'), chalk.white(text));
    console.log(chalk.blue.bold('Подстрока:'), chalk.white(pattern));
    console.log(
        chalk.blue.bold('Чувствительность к регистру:'),
        chalk.white(caseSensitive ? 'Да' : 'Нет')
    );
    console.log('');

    const kmpResult = measureSearch(kmpSearch, text, pattern);
    console.log(
        chalk.green('Кнута-Морриса-Пратта:'),
        `индекс = ${chalk.yellow(kmpResult.index)}`,
        `время = ${chalk.yellow(kmpResult.timeMs.toFixed(3))} мс`
    );

    const bmResult = measureSearch(boyerMooreSearch, text, pattern);
    console.log(
        chalk.green('Бойера-Мура (упрощ.):'),
        `индекс = ${chalk.yellow(bmResult.index)}`,
        `время = ${chalk.yellow(bmResult.timeMs.toFixed(3))} мс`
    );

    const startStd = process.hrtime.bigint();
    const stdIndex = text.indexOf(pattern);
    const endStd = process.hrtime.bigint();
    const stdTime = Number(endStd - startStd) / 1e6;
    console.log(
        chalk.green('Стандартный indexOf:'),
        `индекс = ${chalk.yellow(stdIndex)}`,
        `время = ${chalk.yellow(stdTime.toFixed(3))} мс`
    );
}

main();
