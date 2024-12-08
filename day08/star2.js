import {readFileSync} from 'node:fs';

let test;

const calcAntinodesFromTransmitter = (trans, di, dj, dir, maxCoords) => {
    const rv = [];

    let i = trans.i;
    let j = trans.j;
    while(i >= 0 && i <= maxCoords.i && j >= 0 && j <= maxCoords.j) {
        rv.push({i, j});
        i += dir * di;
        j += dir * dj;
    }

    return rv;
};

const calcAntinodesForPair = (trans1, trans2, maxCoords) => {
    const di = trans1.i - trans2.i;
    const dj = trans1.j - trans2.j;

    const antinodes1 = calcAntinodesFromTransmitter(trans1, di, dj, +1, maxCoords);
    const antinodes2 = calcAntinodesFromTransmitter(trans2, di, dj, -1, maxCoords);

    return [...antinodes1, ...antinodes2];
};

const calcAntinodes = (transmitters, maxCoords) => {
    return transmitters
        .flatMap((t1, idx1) =>
            transmitters
                .slice(idx1 + 1)
                .flatMap(t2 => calcAntinodesForPair(t1, t2, maxCoords))
        );
};

const calcAllAntinodes = (transCoords, maxCoords) => {
    const strings = Object.values(transCoords)
        .flatMap(transmitters => calcAntinodes(transmitters, maxCoords))
        .map(an => JSON.stringify(an));

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

    const maxCoords = {i: grid.length - 1, j: grid[0].length - 1};

    return calcAllAntinodes(transCoords, maxCoords);
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
