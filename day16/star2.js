import {readFileSync} from 'node:fs';

let test;
const Dir = { N: 0, E: 1, S: 2, W: 3 };

const findSE = (grid, se) => {
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === se)
                return {dir: Dir.E, i, j};
};

const straightMoves = (grid, {dir, i, j}) => {
    let newI = i, newJ = j;
    switch (dir) {
        case Dir.W: newJ -= 1; break;
        case Dir.E: newJ += 1; break;
        case Dir.N: newI -= 1; break;
        case Dir.S: newI += 1; break;
        default: throw new Error(`Unrecognized dir: ${dir}`);
    }

    if (grid[newI][newJ] !== '#') return [{dir, i: newI, j: newJ, cost: 1}];
    return [];
};

const cwMoves = (grid, {dir, i, j}) => {
    let newDir;
    switch (dir) {
        case Dir.W: newDir = Dir.N; break;
        case Dir.E: newDir = Dir.S; break;
        case Dir.N: newDir = Dir.E; break;
        case Dir.S: newDir = Dir.W; break;
        default: throw new Error(`Unrecognized dir: ${dir}`);
    }

    return [{dir: newDir, i, j, cost: 1000}];
};

const ccwMoves = (grid, {dir, i, j}) => {
    let newDir;
    switch (dir) {
        case Dir.W: newDir = Dir.S; break;
        case Dir.E: newDir = Dir.N; break;
        case Dir.N: newDir = Dir.W; break;
        case Dir.S: newDir = Dir.E; break;
        default: throw new Error(`Unrecognized dir: ${dir}`);
    }

    return [{dir: newDir, i, j, cost: 1000}];
};

const possibleMoves = (grid, loc) => {
    const sMv = straightMoves(grid, loc);
    const cwMv = cwMoves(grid, loc);
    const ccwMv = ccwMoves(grid, loc);

    return [...sMv, ...cwMv, ...ccwMv];
};

const fieldsOnShortestPaths = (pathGrid, endFields) => {
    const pathFields = new Set();
    const q = [...endFields];

    while (q.length > 0) {
        const cur = q.shift();
        pathFields.add(JSON.stringify({i: cur.i, j: cur.j}));
        pathGrid[cur.dir][cur.i][cur.j].forEach(f => q.push(f));
    }

    return pathFields.size;
};

const solve = grid => {
    const costGrid = Array.from(Array(4), () =>
        grid.map(r => Array(r.length).fill(Number.MAX_SAFE_INTEGER))
    );

    const pathGrid = Array.from(Array(4), () =>
        grid.map(r => Array(r.length))
    );

    const start = findSE(grid, 'S');
    const end = findSE(grid, 'E');
    costGrid[start.dir][start.i][start.j] = 0;
    pathGrid[start.dir][start.i][start.j] = [];

    const q = [start];

    while (q.length > 0) {
        const cur = q.shift();
        const curCost = costGrid[cur.dir][cur.i][cur.j];
        const posMv = possibleMoves(grid, cur);

        posMv
            .forEach(({dir, i, j, cost}) => {
                if (costGrid[dir][i][j] > curCost + cost) {
                    costGrid[dir][i][j] = curCost + cost;
                    q.push({dir, i, j});
                    pathGrid[dir][i][j] = [cur];
                } else if (costGrid[dir][i][j] === curCost + cost) {
                    pathGrid[dir][i][j].push(cur);
                }
            });

        q.sort((a, b) => costGrid[a.dir][a.i][a.j] - costGrid[b.dir][b.i][b.j]);
    }


    const minCost = Math.min(
        costGrid[Dir.N][end.i][end.j],
        costGrid[Dir.E][end.i][end.j],
        costGrid[Dir.S][end.i][end.j],
        costGrid[Dir.W][end.i][end.j]);

    const endFields = Object.values(Dir)
        .filter(dir => costGrid[dir][end.i][end.j] === minCost)
        .map(dir => ({dir, i: end.i, j: end.j}));

    return fieldsOnShortestPaths(pathGrid, endFields);
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
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input-test2.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
