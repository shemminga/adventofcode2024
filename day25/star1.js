import {readFileSync} from 'node:fs';

let test;

const fits = (lock, key) => {
    for (let i = 0; i < 5; i++)
        if (lock[i] + key[i] > 5)
            return false;
    return true;
};

const solve = (locks, keys) => {
    let fitCount = 0;

    for (const lock of locks)
        for (const key of keys)
            if (fits(lock, key))
                fitCount++;

    return fitCount;
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .map(l => l.split(''));

    const keys = [];
    const locks = [];

    let isKey = false, isFirst = true;
    let counts = Array(5).fill(-1);

    for (const line of lines) {
        if (line.length === 0) {
            if (isKey) keys.push(counts);
            else locks.push(counts);

            isFirst = true;
            counts = Array(5).fill(-1);
            continue;
        }

        if (isFirst) {
            isKey = line[0] === '.';
            isFirst = false;
        }

        for (let i = 0; i < 5; i++)
            if (line[i] === '#')
                counts[i]++;
    }

    if (!isFirst)
        if (isKey) keys.push(counts);
        else locks.push(counts);

    const solution = solve(locks, keys);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
