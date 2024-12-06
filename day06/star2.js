import {readFileSync} from 'node:fs';

let test;

const dumpGrid = grid => test && grid.forEach(r => console.log(r.join('')));

const inBounds = (grid, gI, gJ) => gI >= 0 && gJ >= 0 && gI < grid.length && gJ < grid[gI].length;

const moveOneStep = (grid, gI, gJ, dir) => {
    let ngi = gI;
    let ngj = gJ;

    if (dir === 'U') ngi--;
    if (dir === 'D') ngi++;
    if (dir === 'L') ngj--;
    if (dir === 'R') ngj++;

    if (!inBounds(grid, ngi, ngj)) {
        grid[gI][gJ] = 'X';
        return [ngi, ngj, dir];
    }

    if (grid[ngi][ngj] === '#') {
        let ndir;
        if (dir === 'U') ndir = 'R';
        if (dir === 'D') ndir = 'L';
        if (dir === 'L') ndir = 'U';
        if (dir === 'R') ndir = 'D';
        return [gI, gJ, ndir];
    }

    grid[gI][gJ] = 'X';
    return [ngi, ngj, dir];
};

const cloneGrid = grid => grid.map(r => [...r]);

const runGrid = (oGrid, gI, gJ, obstI = null, obstJ = null) => {
    const grid = cloneGrid(oGrid);
    if (obstI !== null && obstJ !== null) grid[obstI][obstJ] = '#';

    const [ogi, ogj] = [gI, gJ];
    let dir = 'U';

    const visited = [];

    while (inBounds(grid, gI, gJ)) {
        const visId = `${gI} ${gJ} ${dir}`;
        if (visited.includes(visId)) return {grid, loop: true};
        visited.push(visId);

        [gI, gJ, dir] = moveOneStep(grid, gI, gJ, dir);
    }

    return {grid, loop: false};
};

const listOptions = (grid, startI, startJ) => {
    const { grid: xGrid } = runGrid(grid, startI, startJ);

    const options = [];
    for (let i = 0; i < xGrid.length; i++)
        for (let j = 0; j < xGrid[i].length; j++)
            if (xGrid[i][j] === 'X')
                if (i !== startI || j !== startJ)
                    options.push([i, j]);

    return options;
};

const isLooping = (grid, startI, startJ, obstI, obstJ) => runGrid(grid, startI, startJ, obstI, obstJ).loop;

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split(''));

    let startI, startJ, dir = 'U';
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === '^')
                [startI, startJ] = [i, j];

    const loopOpts = listOptions(grid, startI, startJ)
        .filter(([obstI, obstJ]) => isLooping(grid, startI, startJ, obstI, obstJ));

    if (test) console.log(loopOpts);

    const solution = loopOpts.length;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
