export function dijkstra(matrix, start, end) {
    const n = matrix.length;
    const dist = Array(n).fill(Infinity);
    const prev = Array(n).fill(null);
    const visited = Array(n).fill(false);
    dist[start] = 0;

    for (let i = 0; i < n; i++) {
        let u = -1;
        for (let j = 0; j < n; j++) {
            if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
        }

        if (dist[u] === Infinity) break;
        visited[u] = true;

        for (let v = 0; v < n; v++) {
            if (matrix[u][v] > 0 && dist[u] + matrix[u][v] < dist[v]) {
                dist[v] = dist[u] + matrix[u][v];
                prev[v] = u;
            }
        }
    }

    const path = [];
    for (let at = end; at !== null; at = prev[at]) path.push(at);
    path.reverse();

    return { dist: dist[end], path };
}
