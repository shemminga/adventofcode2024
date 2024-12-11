import {readFileSync} from 'node:fs';

let test;
const cache = {};

const modifyStone1 = stone => {
    if (stone === '0') return ['1'];

    if (stone.length % 2 === 0) {
        const newStone1 = stone.substring(0, stone.length / 2);
        const newStone2 = '' + (+stone.substring(stone.length / 2));
        return [newStone1, newStone2];
    }

    return ['' + (+stone * 2024)];
};

const countStoneN = (stone, n) => {
    if (n === 0) return 1;

    const cacheKey = stone + ' ' + n;
    if (cache[cacheKey]) return cache[cacheKey];

    const nextStones = modifyStone1(stone);
    const count = countStonesN(nextStones, n - 1);

    cache[cacheKey] = count;
    return count;
};

const countStonesN = (stones, n) => {
    return stones
        .map(s => countStoneN(s, n))
        .reduce((acc, x) => acc + x);
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    let stones = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .flatMap(l => l.split(' '));

    const solution = countStonesN(stones, 75);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
