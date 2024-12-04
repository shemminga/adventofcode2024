import {readFileSync} from 'node:fs';

let test;

const gridVal = (grid, i, j) => {
    if (i < 0 || j < 0) return null;
    if (i >= grid.length || j >= grid[i].length) return null;
    return grid[i][j];
};

const isMS = (grid, iM, jM, iS, jS) => {
    return gridVal(grid, iM, jM) === 'M' &&
        gridVal(grid, iS, jS) === 'S';
};

const isXMas = (grid, i, j) => {
    if (grid[i][j] !== 'A') return false;

    let count = 0;
    if (isMS(grid, i - 1, j - 1, i + 1, j + 1)) count++; // NW-SE
    if (isMS(grid, i - 1, j + 1, i + 1, j - 1)) count++; // NE-SW
    if (isMS(grid, i + 1, j + 1, i - 1, j - 1)) count++; // SE-NW
    if (isMS(grid, i + 1, j - 1, i - 1, j + 1)) count++; // SW-NE

    return count === 2;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    let solution = 0;
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (isXMas(grid, i, j))
                solution++;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
