import {readFileSync} from 'node:fs';

let test;

const reachableTops = (grid, i, j, prev = -1) => {
    if (i < 0 || i >= grid.length) return [];
    if (j < 0 || j >= grid[i].length) return [];
    if (grid[i][j] !== prev + 1) return [];
    if (grid[i][j] === 9) return [{i, j}];

    const topsN = reachableTops(grid, i - 1, j, grid[i][j]);
    const topsE = reachableTops(grid, i, j + 1, grid[i][j]);
    const topsS = reachableTops(grid, i + 1, j, grid[i][j]);
    const topsW = reachableTops(grid, i, j - 1, grid[i][j]);

    const tops = [...topsN, ...topsE, ...topsS, ...topsW]
        .map(t => JSON.stringify(t));

    return [...new Set(tops)]
        .map(t => JSON.parse(t));
};

const trailheadScore = (grid, i, j) => {
    return reachableTops(grid, i, j).length;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l
            .split('')
            .map(b => +b));

    const zeroes = grid
        .flatMap((r, i) => r
            .map((c, j) => ({i, j, h: c}))
        .filter(({i, j, h}) => h === 0));

    const solution = zeroes
        .map(({i, j}) => trailheadScore(grid, i, j))
        .reduce((acc, x) => acc + x);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
