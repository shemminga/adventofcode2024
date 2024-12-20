import {readFileSync} from 'node:fs';

let test;

const findS = grid => {
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === 'S')
                return {i,j};
    throw new Error('No S found');
};

const markBorder = (grid, borders, i, j) => {
    if (i < 0 || i >= grid.length) return;
    if (j < 0 || j >= grid[i].length) return;
    if (grid[i][j] !== '#') return;

    borders[i][j]++;
};

const setIfNext = (grid, pathLength, i, j, setter) => {
    if (i < 0 || i >= grid.length) return;
    if (j < 0 || j >= grid[i].length) return;
    if (grid[i][j] !== '.' && grid[i][j] !== 'E') return;
    if (pathLength[i][j] >= 0) return;

    setter(i, j);
};

const markAnalysisGrids = (grid, pathLength, borders) => {
    let cur = findS(grid);
    let curLen = 0;
    pathLength[cur.i][cur.j] = curLen;

    while (true) {
        markBorder(grid, borders, cur.i - 1, cur.j);
        markBorder(grid, borders, cur.i, cur.j + 1);
        markBorder(grid, borders, cur.i + 1, cur.j);
        markBorder(grid, borders, cur.i, cur.j - 1);

        if (grid[cur.i][cur.j] === 'E') break;

        let next;
        setIfNext(grid, pathLength, cur.i - 1, cur.j, (i, j) => next = {i, j});
        setIfNext(grid, pathLength, cur.i, cur.j + 1, (i, j) => next = {i, j});
        setIfNext(grid, pathLength, cur.i + 1, cur.j, (i, j) => next = {i, j});
        setIfNext(grid, pathLength, cur.i, cur.j - 1, (i, j) => next = {i, j});

        if (!next) throw new Error(`No next set for ${cur.i},${cur.j}`);

        cur = next;
        curLen++;
        pathLength[cur.i][cur.j] = curLen;
    }
};

const delta = (pathLength, i1, j1, i2, j2) => {
    if (i1 < 0 || i1 > pathLength.length) return 0;
    if (j1 < 0 || j1 > pathLength[i1].length) return 0;
    if (i2 < 0 || i2 > pathLength.length) return 0;
    if (j2 < 0 || j2 > pathLength[i2].length) return 0;
    if (pathLength[i1][j1] < 0) return 0;
    if (pathLength[i2][j2] < 0) return 0;

    return pathLength[i2][j2] - pathLength[i1][j1] - 2; // 2 for cheat path cost
};

const pushIfCheat = (cheats, pathLength, i1, j1, i2, j2) => {
    const d = delta(pathLength, i1, j1, i2, j2);

    if (d > 0) cheats.push({
        s: {i: i1, j: j1},
        e: {i: i2, j: j2},
        d
    });
};

const findCheats = (grid, borders, pathLength) => {
    const cheats = [];
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (borders[i][j] >= 2) {
                pushIfCheat(cheats, pathLength, i - 1, j, i, j + 1);
                pushIfCheat(cheats, pathLength, i - 1, j, i, j - 1);
                pushIfCheat(cheats, pathLength, i - 1, j, i + 1, j);

                pushIfCheat(cheats, pathLength, i, j + 1, i - 1, j);
                pushIfCheat(cheats, pathLength, i, j + 1, i, j - 1);
                pushIfCheat(cheats, pathLength, i, j + 1, i + 1, j);

                pushIfCheat(cheats, pathLength, i, j - 1, i - 1, j);
                pushIfCheat(cheats, pathLength, i, j - 1, i, j + 1);
                pushIfCheat(cheats, pathLength, i, j - 1, i + 1, j);

                pushIfCheat(cheats, pathLength, i + 1, j, i - 1, j);
                pushIfCheat(cheats, pathLength, i + 1, j, i, j + 1);
                pushIfCheat(cheats, pathLength, i + 1, j, i, j - 1);
            }

    return cheats;
};

const solve = grid => {
    const pathLength = grid.map(r => r.map(_ => -1));
    const borders = grid.map(r => r.map(_ => 0));

    markAnalysisGrids(grid, pathLength, borders);
    const cheats = findCheats(grid, borders, pathLength);

    if (test) {
        const histo = Object.groupBy(cheats, cheat => cheat.d);
        Object.entries(histo).forEach(([k, v]) => console.log(`${k} => ${v.length}`));
    }

    return cheats.filter(cheat => cheat.d >= 100).length;
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split(''));

    const solution = solve(grid);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
    console.log(''); // Weird and annoying console bug
    console.log(''); // Weird and annoying console bug
    console.log(''); // Weird and annoying console bug
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
