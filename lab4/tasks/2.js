import chalk from 'chalk';

function hashFunc(key, size) {
    return key % size;
}

function pseudoRandom(i, size) {
    return (i * 7 + 3) % size;
}

class HashTable {
    constructor(size = 101, method = 'linear') {
        this.size = size;
        this.method = method;
        this.table = new Array(size).fill(null);
        this.deleted = Symbol('deleted');
    }

    add(key) {
        let idx = hashFunc(key, this.size);
        if (this.method === 'chains') {
            if (!this.table[idx]) this.table[idx] = [];
            if (!this.table[idx].includes(key)) this.table[idx].push(key);
            return;
        }

        for (let i = 0; i < this.size; i++) {
            let probeIdx;
            if (this.method === 'linear') {
                probeIdx = (idx + i) % this.size;
            } else if (this.method === 'pseudo') {
                probeIdx = (idx + pseudoRandom(i, this.size)) % this.size;
            }
            if (
                this.table[probeIdx] === null ||
                this.table[probeIdx] === this.deleted
            ) {
                this.table[probeIdx] = key;
                return;
            }
        }
        throw new Error('HashTable is full');
    }

    search(key) {
        let idx = hashFunc(key, this.size);
        if (this.method === 'chains') {
            return this.table[idx]?.includes(key) ?? false;
        }

        for (let i = 0; i < this.size; i++) {
            let probeIdx;
            if (this.method === 'linear') {
                probeIdx = (idx + i) % this.size;
            } else if (this.method === 'pseudo') {
                probeIdx = (idx + pseudoRandom(i, this.size)) % this.size;
            }
            if (this.table[probeIdx] === null) return false;
            if (this.table[probeIdx] === key) return true;
        }
        return false;
    }

    remove(key) {
        let idx = hashFunc(key, this.size);
        if (this.method === 'chains') {
            if (!this.table[idx]) return;
            this.table[idx] = this.table[idx].filter((k) => k !== key);
            if (this.table[idx].length === 0) this.table[idx] = null;
            return;
        }

        for (let i = 0; i < this.size; i++) {
            let probeIdx;
            if (this.method === 'linear') {
                probeIdx = (idx + i) % this.size;
            } else if (this.method === 'pseudo') {
                probeIdx = (idx + pseudoRandom(i, this.size)) % this.size;
            }
            if (this.table[probeIdx] === null) return;
            if (this.table[probeIdx] === key) {
                this.table[probeIdx] = this.deleted;
                return;
            }
        }
    }
}

function generateRandomArray(n, max = 10000) {
    const arr = new Set();
    while (arr.size < n) {
        arr.add(Math.floor(Math.random() * max));
    }
    return Array.from(arr);
}

function measureTime(fn) {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1e6;
}

function testHashTable(method) {
    const table = new HashTable(10007, method);
    const data = generateRandomArray(5000);

    console.log(chalk.blue(`Тестируем метод: ${method}`));

    const addTime = measureTime(() => {
        data.forEach((key) => table.add(key));
    });
    console.log(`Время добавления 5000 элементов: ${addTime.toFixed(3)} ms`);

    const searchTime = measureTime(() => {
        data.forEach((key) => {
            if (!table.search(key)) {
                throw new Error('Не найден элемент, который был добавлен');
            }
        });
    });
    console.log(`Время поиска 5000 элементов: ${searchTime.toFixed(3)} ms`);

    const removeTime = measureTime(() => {
        data.forEach((key) => table.remove(key));
    });
    console.log(`Время удаления 5000 элементов: ${removeTime.toFixed(3)} ms\n`);
}

function main() {
    testHashTable('linear');
    testHashTable('pseudo');
    testHashTable('chains');
}

main();
