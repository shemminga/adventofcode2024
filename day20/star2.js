import {readFileSync} from 'node:fs';

let test;

const findS = grid => {
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === 'S')
                return {i,j};
    throw new Error('No S found');
};

const setIfNext = (grid, visited, i, j, setter) => {
    if (i < 0 || i >= grid.length) return;
    if (j < 0 || j >= grid[i].length) return;
    if (grid[i][j] !== '.' && grid[i][j] !== 'E') return;
    if (visited[i][j]) return;

    setter(i, j);
};

const findPath = grid => {
    const visited = grid.map(r => r.map(_ => false));
    const path = [];

    let cur = findS(grid);
    let curLen = 0;

    while (true) {
        visited[cur.i][cur.j] = true;
        path.push({...cur, len: curLen});

        if (grid[cur.i][cur.j] === 'E') break;

        let next;
        setIfNext(grid, visited, cur.i - 1, cur.j, (i, j) => next = {i, j});
        setIfNext(grid, visited, cur.i, cur.j + 1, (i, j) => next = {i, j});
        setIfNext(grid, visited, cur.i + 1, cur.j, (i, j) => next = {i, j});
        setIfNext(grid, visited, cur.i, cur.j - 1, (i, j) => next = {i, j});

        if (!next) throw new Error(`No next set for ${cur.i},${cur.j}`);

        cur = next;
        curLen++;
    }

    return path;
};


const solve = grid => {
    const path = findPath(grid);

    const cheats = [];
    for (let startIdx = 0; startIdx < path.length - 50; startIdx++) {
        for (let endIdx = startIdx + 50; endIdx < path.length; endIdx++) {
            const start = path[startIdx];
            const end = path[endIdx];
            const mhDist = Math.abs(start.i - end.i) + Math.abs(start.j - end.j);
            const cheatSave = end.len - start.len - mhDist;

            if (mhDist <= 20 && cheatSave >= 50) cheats.push({s: start, e: end, d: cheatSave});
        }
    }

    if (test) {
        const histo = {};
        cheats.forEach(c => histo[c.d] = 0);
        cheats.forEach(c => histo[c.d]++);
        Object.entries(histo).forEach(([k, v]) => console.log(`${k} => ${v}`));
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
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
