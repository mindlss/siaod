function generateMatrix({ m = 3, n = 3, min_limit = 0, max_limit = 100 } = {}) {
    const matrix = [];

    for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const value =
                Math.floor(Math.random() * (max_limit - min_limit + 1)) +
                min_limit;
            row.push(value);
        }
        matrix.push(row);
    }

    return matrix;
}

const matrix = generateMatrix({ m: 20, n: 20, min_limit: 0, max_limit: 1000 });
console.log('Сгенерированная матрица:');
console.table(matrix);

module.exports = { generateMatrix };
