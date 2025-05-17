const chalk = require('chalk');
const { generateMatrix } = require('./2');

function bubbleSortMatrixRows(matrix) {
    const result = matrix.map((row) => [...row]);
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            const sumA = result[j].reduce((a, b) => a + b, 0);
            const sumB = result[j + 1].reduce((a, b) => a + b, 0);
            if (sumA > sumB) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
            }
        }
    }

    return result;
}

function nativeSortMatrixRows(matrix) {
    return [...matrix].sort((a, b) => {
        const sumA = a.reduce((x, y) => x + y, 0);
        const sumB = b.reduce((x, y) => x + y, 0);
        return sumA - sumB;
    });
}

function printMatrixBars(matrix, label) {
    console.log(`\n${chalk.cyan(label)}`);
    matrix.slice(0, 20).forEach((row, i) => {
        const sum = row.reduce((a, b) => a + b, 0);
        const bar = '█'.repeat(Math.floor(sum / 1000));
        const line = `${String(i).padStart(2)}: ${bar} (${sum})`;
        console.log(i % 2 === 0 ? chalk.gray(line) : line);
    });
    console.log('\n');
}

const matrix = generateMatrix({
    m: 100,
    n: 100,
    min_limit: 0,
    max_limit: 1000,
});

printMatrixBars(matrix.slice(0, 20), '🔹 Оригинальная матрица');

// Bubble Sort
console.time('⏱ Пузырьковая сортировка');
const bubbleSorted = bubbleSortMatrixRows(matrix);
console.timeEnd('⏱ Пузырьковая сортировка');

// Native Sort
console.time('⏱ Стандартная сортировка');
const nativeSorted = nativeSortMatrixRows(matrix);
console.timeEnd('⏱ Стандартная сортировка');

console.log('✅ Сортировка завершена. Вывод первых 20 строк:');

printMatrixBars(bubbleSorted, '🔹 Пузырьковая сортировка');
printMatrixBars(nativeSorted, '🔹 Стандартная сортировка');
