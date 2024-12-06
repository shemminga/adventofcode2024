import {readFileSync} from 'node:fs';

let test;

const inBounds = (grid, gI, gJ) => gI >= 0 && gJ >= 0 && gI < grid.length && gJ < grid[gI].length;

const moveOneStep = (grid, gI, gJ, dir) => {
    grid[gI][gJ] = 'X';

    let ngi = gI;
    let ngj = gJ;

    if (dir === 'U') ngi--;
    if (dir === 'D') ngi++;
    if (dir === 'L') ngj--;
    if (dir === 'R') ngj++;

    if (!inBounds(grid, ngi, ngj)) return [ngi, ngj, dir];

    if (grid[ngi][ngj] === '#') {
        let ndir;
        if (dir === 'U') ndir = 'R';
        if (dir === 'D') ndir = 'L';
        if (dir === 'L') ndir = 'U';
        if (dir === 'R') ndir = 'D';
        return [gI, gJ, ndir];
    }

    return [ngi, ngj, dir];
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split(''));

    let gI, gJ, dir = 'U';
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === '^')
                [gI, gJ] = [i, j];

    while (inBounds(grid, gI, gJ))
        [gI, gJ, dir] = moveOneStep(grid, gI, gJ, dir);

    let solution = 0;

    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === 'X')
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
