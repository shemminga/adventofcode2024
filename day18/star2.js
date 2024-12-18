import {readFileSync} from 'node:fs';

let test;

const tryNext = (grid, distGrid, pathGrid, q, cur, nextI, nextJ) => {
    const curDist = distGrid[cur.i][cur.j];

    if (nextI < 0 || nextI >= grid.length) return;
    if (nextJ < 0 || nextJ >= grid[nextI].length) return;
    if (grid[nextI][nextJ] === '#') return;
    if (curDist + 1 >= distGrid[nextI][nextJ]) return;

    pathGrid[nextI][nextJ] = cur;
    distGrid[nextI][nextJ] = curDist + 1;
    q.push({i: nextI, j: nextJ});
};

const shortestPath = grid => {
    const distGrid = grid.map(r => r.map(_ => Number.MAX_SAFE_INTEGER));
    const pathGrid = grid.map(r => Array(r.length));
    const q = [{i: 0, j: 0}];
    distGrid[0][0] = 0;

    while (q.length > 0) {
        const cur = q.shift();

        tryNext(grid, distGrid, pathGrid, q, cur, cur.i - 1, cur.j);
        tryNext(grid, distGrid, pathGrid, q, cur, cur.i, cur.j + 1);
        tryNext(grid, distGrid, pathGrid, q, cur, cur.i + 1, cur.j);
        tryNext(grid, distGrid, pathGrid, q, cur, cur.i, cur.j - 1);
    }

    if (distGrid[grid.length - 1][grid[0].length - 1] === Number.MAX_SAFE_INTEGER) {
        return null;
    }

    let prev = {i: grid.length - 1, j: grid[0].length - 1};
    const path = new Set();
    while (prev.i !== 0 || prev.j !== 0) {
        path.add(JSON.stringify(prev));
        prev = pathGrid[prev.i][prev.j];
    }

    return path;
};

const solve = (grid, bytes) => {
    let path = shortestPath(grid);

    for (let byteId = 0; byteId < bytes.length; byteId++) {
        const byte = bytes[byteId];
        grid[byte.i][byte.j] = '#';

        if (path.has(JSON.stringify(byte))) {
            // console.log(`Current shortest path blocked at ${byte.i},${byte.j}`);

            // const oldLen = path.size;
            path = shortestPath(grid);

            if (path === null) {
                // console.log("No paths left. Bugger.");
                return `${byte.j},${byte.i}`;
            }

            // console.log(`\`-> Shortest path length increases from ${oldLen} to ${path.size}`);
        }
    }
};

const doFile = (filename, iSize, jSize) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const bytes = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => {
            const [x, y] = l.split(',');
            return {i: +y, j: +x};
        });

    const grid = Array.from(Array(iSize), _ => Array(jSize).fill('.'));

    const solution = solve(grid, bytes);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt', 7, 7);
    doFile('input.txt', 71, 71);
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
