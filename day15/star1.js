import {readFileSync} from 'node:fs';

let test;

const dumpGrid = (grid, label) => {
    console.group(label);
    grid.forEach(r => console.log(r.join('')));
    console.groupEnd();
};

const moveBoxOrBot = (grid, i, j, dir) => {
    let targetI = i, targetJ = j;
    switch (dir) {
        case '<': targetJ -= 1; break;
        case '>': targetJ += 1; break;
        case '^': targetI -= 1; break;
        case 'v': targetI += 1; break;
        default: throw new Error(`Unrecognized dir: ${dir}`);
    }

    if (grid[targetI][targetJ] === '#') return {i, j};

    if (grid[targetI][targetJ] === 'O') moveBoxOrBot(grid, targetI, targetJ, dir);

    if (grid[targetI][targetJ] === '.') {
        grid[targetI][targetJ] = grid[i][j];
        grid[i][j] = '.';
        return {i: targetI, j: targetJ};
    }

    return {i, j};
};

const findBot = grid => {
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === '@')
                return {i,j};
};

const scoreGrid = grid => {
    let score = 0;

    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === 'O')
                score += 100 * i + j;

    return score;
};

const solve = (grid, moves) => {
    let {i, j} = findBot(grid);

    while (moves.length > 0) {
        const move = moves.shift();
        ({i, j} = moveBoxOrBot(grid, i, j, move));

        if (test && grid.length < 10) {
            dumpGrid(grid, `Move ${move}:`);
        }
    }

    return scoreGrid(grid);
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const grid = lines.filter(l => l.includes('#'))
        .map(l => l.split(''));

    const moves = lines.filter(l => !l.includes('#'))
        .flatMap(l => l.split(''));

    const solution = solve(grid, moves);

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
