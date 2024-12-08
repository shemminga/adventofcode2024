import {readFileSync} from 'node:fs';

let test;

const calcAntinode = (trans1, trans2) => {
    const di = trans1.i - trans2.i;
    const dj = trans1.j - trans2.j;

    const antinode1 = {i: trans1.i + di, j: trans1.j + dj};
    const antinode2 = {i: trans2.i - di, j: trans2.j - dj};

    return [antinode1, antinode2];
};

const calcAntinodes = transmitters => {
    return transmitters
        .flatMap((t1, idx1) =>
            transmitters
                .slice(idx1 + 1)
                .flatMap(t2 => calcAntinode(t1, t2))
        );
};

const calcAllAntinodes = transCoords => {
    const strings = Object.values(transCoords)
        .flatMap(calcAntinodes)
        .map(JSON.stringify);

    const uniq = [...new Set(strings)];
    return uniq.map(s => JSON.parse(s));
};

const calcGrid = grid => {
    const transCoords = {};
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] !== '.')
                if (!transCoords[grid[i][j]]) transCoords[grid[i][j]] = [{i, j}];
                else transCoords[grid[i][j]].push({i, j});

    return calcAllAntinodes(transCoords)
        .filter(an => an.i >= 0 && an.i < grid.length)
        .filter(an => an.j >= 0 && an.j < grid[an.i].length);
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

    const solution = calcGrid(grid).length;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
