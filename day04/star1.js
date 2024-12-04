import {readFileSync} from 'node:fs';

let test;

const gridVal = (grid, i, j) => {
    if (i < 0 || j < 0) return null;
    if (i >= grid.length || j >= grid[i].length) return null;
    return grid[i][j];
};

const assertValidCoords = (n1, n2, n3) => {
    if (n1 === n2 && n1 === n3) return;
    if (Math.abs(n1 - n2) === 1 && (n1 - n2) === (n2 - n3)) return;
    throw new Error(`Sanity check failed: ${n1} ${n2} ${n3}`);
};

const isMas = (grid, iM, jM, iA, jA, iS, jS) => {
    assertValidCoords(iM, iA, iS);
    assertValidCoords(jM, jA, jS);

    return gridVal(grid, iM, jM) === 'M' &&
        gridVal(grid, iA, jA) === 'A' &&
        gridVal(grid, iS, jS) === 'S';
};

const countXmases = (grid, i, j) => {
    if (grid[i][j] !== 'X') return 0;

    let count = 0;

    if (isMas(grid, i - 1, j + 0, i - 2, j + 0, i - 3, j + 0)) count++; // N
    if (isMas(grid, i - 1, j + 1, i - 2, j + 2, i - 3, j + 3)) count++; // NE
    if (isMas(grid, i - 0, j + 1, i - 0, j + 2, i - 0, j + 3)) count++; // E
    if (isMas(grid, i + 1, j + 1, i + 2, j + 2, i + 3, j + 3)) count++; // SE
    if (isMas(grid, i + 1, j + 0, i + 2, j + 0, i + 3, j + 0)) count++; // S
    if (isMas(grid, i + 1, j - 1, i + 2, j - 2, i + 3, j - 3)) count++; // SW
    if (isMas(grid, i + 0, j - 1, i + 0, j - 2, i + 0, j - 3)) count++; // W
    if (isMas(grid, i - 1, j - 1, i - 2, j - 2, i - 3, j - 3)) count++; // NW

    return count;
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
            solution += countXmases(grid, i, j);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
