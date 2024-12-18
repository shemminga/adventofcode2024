import {readFileSync} from 'node:fs';

let test;

const tryNext = (grid, distGrid, q, curDist, nextI, nextJ) => {
    if (nextI < 0 || nextI >= grid.length) return;
    if (nextJ < 0 || nextJ >= grid[nextI].length) return;
    if (grid[nextI][nextJ] === '#') return;
    if (curDist + 1 >= distGrid[nextI][nextJ]) return;

    distGrid[nextI][nextJ] = curDist + 1;
    q.push({i: nextI, j: nextJ});
};

const solve = grid => {
    const distGrid = grid.map(r => r.map(_ => Number.MAX_SAFE_INTEGER));
    const q = [{i: 0, j: 0}];
    distGrid[0][0] = 0;

    while (q.length > 0) {
        const cur = q.shift();
        const curDist = distGrid[cur.i][cur.j];

        tryNext(grid, distGrid, q, curDist, cur.i - 1, cur.j);
        tryNext(grid, distGrid, q, curDist, cur.i, cur.j + 1);
        tryNext(grid, distGrid, q, curDist, cur.i + 1, cur.j);
        tryNext(grid, distGrid, q, curDist, cur.i, cur.j - 1);
    }

    return distGrid[grid.length - 1][grid[0].length - 1];
};

const doFile = (filename, iSize, jSize, nrBytes) => {
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
        })
        .slice(0, nrBytes);

    const grid = Array.from(Array(iSize), _ => Array(jSize).fill('.'));

    bytes.forEach(({i, j}) => grid[i][j] = '#');

    const solution = solve(grid);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt', 7, 7, 12);
    doFile('input.txt', 71, 71, 1024);
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
