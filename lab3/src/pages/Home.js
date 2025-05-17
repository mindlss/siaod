import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import { useState } from 'react';
import GraphView from '../components/GraphView';
import { dijkstra } from '../lib/algorithms';

const Home = () => {
    const [matrixText, setMatrixText] = useState('');
    const [parsedMatrix, setParsedMatrix] = useState(null);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [path, setPath] = useState([]);
    const [pathLength, setPathLength] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    const handleLoad = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setMatrixText(e.target.result);
        reader.readAsText(file);
    };

    const handleRun = () => {
        const lines = matrixText.trim().split(/\r?\n/);
        const matrix = lines.map((line) =>
            line
                .trim()
                .split(/\s+/)
                .map((n) => parseInt(n, 10))
        );
        setParsedMatrix(matrix);
        setPath([]);
        setPathLength(null);
        setElapsedTime(null);
    };

    const handleFindPath = () => {
        const s = parseInt(start, 10);
        const e = parseInt(end, 10);
        if (
            parsedMatrix &&
            !isNaN(s) &&
            !isNaN(e) &&
            s >= 0 &&
            e >= 0 &&
            s < parsedMatrix.length &&
            e < parsedMatrix.length
        ) {
            const REPEATS = 1000;

            const t0 = performance.now();
            let result;
            for (let i = 0; i < REPEATS; i++) {
                result = dijkstra(parsedMatrix, s, e);
            }
            const t1 = performance.now();

            setPath(result.path);

            let length = 0;
            for (let i = 0; i < result.path.length - 1; i++) {
                length += parsedMatrix[result.path[i]][result.path[i + 1]];
            }
            setPathLength(length);

            setElapsedTime(((t1 - t0) / REPEATS).toFixed(3));
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <h1>Визуализация графа</h1>

            <div style={{ marginTop: 20 }}>
                <input type="file" accept=".txt" onChange={handleLoad} />
                <button onClick={handleRun} style={{ marginLeft: 10 }}>
                    Построить граф
                </button>
            </div>

            <textarea
                value={matrixText}
                onChange={(e) => setMatrixText(e.target.value)}
                rows={10}
                style={{ width: '100%', marginTop: 20 }}
            />

            <div style={{ marginTop: 20 }}>
                <input
                    type="number"
                    placeholder="Начальная вершина"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Конечная вершина"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    style={{ marginLeft: 10 }}
                />
                <button onClick={handleFindPath} style={{ marginLeft: 10 }}>
                    Найти путь
                </button>
            </div>

            {pathLength !== null && (
                <div style={{ marginTop: 15 }}>
                    <strong>Длина пути:</strong> {pathLength}{' '}
                    <span style={{ marginLeft: 20 }}>
                        <strong>Время выполнения:</strong> {elapsedTime} мс
                    </span>
                </div>
            )}

            {parsedMatrix && <GraphView matrix={parsedMatrix} path={path} />}
        </motion.div>
    );
};

export default Home;
