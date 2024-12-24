import {readFileSync} from 'node:fs';

let test;

const PRUNER = 16777216;
const cache = new Array(PRUNER).fill(-1);

const calcNext = cur => {
    cur = (((cur * 64) ^ cur) >>> 0) % PRUNER;
    cur = ((Math.floor(cur / 32) ^ cur) >>> 0) % PRUNER;
    cur = (((cur * 2048) ^ cur) >>> 0) % PRUNER;
    return cur;
};

const getNext = cur => {
    if (cache[cur] < 0) cache[cur] = calcNext(cur);
    return cache[cur];
};

const solveOne = nr => {
    let cur = nr;
    for (let i = 0; i < 2000; i++) {
        cur = getNext(cur);
        if (test && i < 10) console.log(cur);
    }

    if (test) console.log(`${nr}: ${cur}`);
    return cur;
};

const solve = numbers => {
    return numbers
        .map(nr => solveOne(nr))
        .reduce((a, b) => a + b);
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const numbers = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => +l);

    const solution = solve(numbers);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input-test2.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
