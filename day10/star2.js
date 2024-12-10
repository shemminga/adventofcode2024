import {readFileSync} from 'node:fs';

let test;
let cacheGrid;

const trailheadRating = (grid, i, j, prev = -1) => {
    if (i < 0 || i >= grid.length) return 0;
    if (j < 0 || j >= grid[i].length) return 0;
    if (grid[i][j] !== prev + 1) return 0;
    if (grid[i][j] === 9) return 1;

    if (cacheGrid[i][j] !== undefined) return cacheGrid[i][j];

    let score = 0;
    score += trailheadRating(grid, i - 1, j, grid[i][j]);
    score += trailheadRating(grid, i, j + 1, grid[i][j]);
    score += trailheadRating(grid, i + 1, j, grid[i][j]);
    score += trailheadRating(grid, i, j - 1, grid[i][j]);

    cacheGrid[i][j] = score;

    return score;
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

    cacheGrid = Array.from(Array(grid.length), () => []);

    const zeroes = grid
        .flatMap((r, i) => r
            .map((c, j) => ({i, j, h: c}))
        .filter(({i, j, h}) => h === 0));

    const solution = zeroes
        .map(({i, j}) => trailheadRating(grid, i, j))
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
