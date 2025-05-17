import chalk from 'chalk';

function binarySearch(arr, key) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === key) return mid;
        else if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

class BSTNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(key) {
        this.root = this._insertRec(this.root, key);
    }

    _insertRec(node, key) {
        if (node === null) return new BSTNode(key);

        if (key === node.key) {
            return node;
        }

        if (key < node.key) {
            node.left = this._insertRec(node.left, key);
        } else {
            node.right = this._insertRec(node.right, key);
        }
        return node;
    }

    search(key) {
        return this._searchRec(this.root, key);
    }

    _searchRec(node, key) {
        if (node === null) return false;

        if (key === node.key) return true;

        if (key < node.key) return this._searchRec(node.left, key);

        return this._searchRec(node.right, key);
    }

    remove(key) {
        this.root = this._removeRec(this.root, key);
    }

    _removeRec(node, key) {
        if (node === null) return null;

        if (key < node.key) {
            node.left = this._removeRec(node.left, key);
        } else if (key > node.key) {
            node.right = this._removeRec(node.right, key);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            let minLargerNode = node.right;
            while (minLargerNode.left !== null) {
                minLargerNode = minLargerNode.left;
            }
            node.key = minLargerNode.key;

            node.right = this._removeRec(node.right, minLargerNode.key);
        }
        return node;
    }
}

function fibonacciSearch(arr, key) {
    const n = arr.length;
    let fibMMm2 = 0;
    let fibMMm1 = 1;
    let fibM = fibMMm2 + fibMMm1;

    while (fibM < n) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm2 + fibMMm1;
    }

    let offset = -1;

    while (fibM > 1) {
        let i = Math.min(offset + fibMMm2, n - 1);

        if (arr[i] < key) {
            fibM = fibMMm1;
            fibMMm1 = fibMMm2;
            fibMMm2 = fibM - fibMMm1;
            offset = i;
        } else if (arr[i] > key) {
            fibM = fibMMm2;
            fibMMm1 = fibMMm1 - fibMMm2;
            fibMMm2 = fibM - fibMMm1;
        } else {
            return i;
        }
    }

    if (fibMMm1 && arr[offset + 1] === key) return offset + 1;

    return -1;
}

function interpolationSearch(arr, key) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high && key >= arr[low] && key <= arr[high]) {
        if (low === high) {
            if (arr[low] === key) return low;
            return -1;
        }

        const pos =
            low +
            Math.floor(
                ((high - low) / (arr[high] - arr[low])) * (key - arr[low])
            );

        if (arr[pos] === key) return pos;
        if (arr[pos] < key) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}

function generateSortedArray(n, max = 100000) {
    const arr = new Set();
    while (arr.size < n) {
        arr.add(Math.floor(Math.random() * max));
    }
    return Array.from(arr).sort((a, b) => a - b);
}

function measureTime(fn) {
    const start = process.hrtime.bigint();
    const res = fn();
    const end = process.hrtime.bigint();
    return {
        time: Number(end - start) / 1e6,
        result: res,
    };
}

function testBinarySearch(arr, keys) {
    const times = [];
    keys.forEach((key) => {
        const { time } = measureTime(() => binarySearch(arr, key));
        times.push(time);
    });
    return times.reduce((a, b) => a + b, 0);
}

function testBST(arr, keys) {
    const tree = new BST();
    arr.forEach((k) => tree.insert(k));
    const times = [];
    keys.forEach((key) => {
        const { time } = measureTime(() => tree.search(key));
        times.push(time);
    });
    return times.reduce((a, b) => a + b, 0);
}

function testFibSearch(arr, keys) {
    const times = [];
    keys.forEach((key) => {
        const { time } = measureTime(() => fibonacciSearch(arr, key));
        times.push(time);
    });
    return times.reduce((a, b) => a + b, 0);
}

function testInterpolationSearch(arr, keys) {
    const times = [];
    keys.forEach((key) => {
        const { time } = measureTime(() => interpolationSearch(arr, key));
        times.push(time);
    });
    return times.reduce((a, b) => a + b, 0);
}

function main() {
    const n = 10000;
    const arr = generateSortedArray(n);
    const keys = arr.slice(0, 500);

    console.log(
        chalk.green(
            'Тестируем алгоритмы поиска на 10000 элементов и 500 запросах\n'
        )
    );

    console.log(chalk.yellow('Бинарный поиск:'));
    console.log(
        `Общее время поиска: ${testBinarySearch(arr, keys).toFixed(3)} ms\n`
    );

    console.log(chalk.yellow('Поиск в бинарном дереве:'));
    console.log(`Общее время поиска: ${testBST(arr, keys).toFixed(3)} ms\n`);

    console.log(chalk.yellow('Фибоначчиев поиск:'));
    console.log(
        `Общее время поиска: ${testFibSearch(arr, keys).toFixed(3)} ms\n`
    );

    console.log(chalk.yellow('Интерполяционный поиск:'));
    console.log(
        `Общее время поиска: ${testInterpolationSearch(arr, keys).toFixed(
            3
        )} ms\n`
    );
}

main();
