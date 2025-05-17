import { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

const GraphView = ({ matrix, path = [] }) => {
    const containerRef = useRef(null);
    const networkRef = useRef(null);

    useEffect(() => {
        const nodes = matrix.map((_, i) => ({
            id: i,
            label: `В${i}`,
            color: path.includes(i) ? 'green' : undefined,
        }));

        const edges = [];
        matrix.forEach((row, i) => {
            row.forEach((weight, j) => {
                if (weight !== 0) {
                    const isInPathEdge = path.some(
                        (v, idx) => v === i && path[idx + 1] === j
                    );
                    edges.push({
                        from: i,
                        to: j,
                        label: String(weight),
                        arrows: 'to',
                        color: isInPathEdge ? 'green' : 'blue',
                        width: isInPathEdge ? 3 : 1,
                    });
                }
            });
        });

        const data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges),
        };

        const options = {
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
            },
            edges: {
                smooth: true,
                font: { align: 'middle' },
            },
            nodes: {
                shape: 'dot',
                size: 15,
                font: { size: 16, color: '#333' },
            },
        };

        if (networkRef.current) {
            networkRef.current.setData(data);
            networkRef.current.setOptions(options);
        } else {
            networkRef.current = new Network(
                containerRef.current,
                data,
                options
            );
        }

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [matrix, path]);

    return (
        <div
            ref={containerRef}
            style={{ height: '400px', border: '1px solid #ccc', marginTop: 20 }}
        />
    );
};

export default GraphView;
