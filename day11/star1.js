import {readFileSync} from 'node:fs';

let test;

const modifyStones = stones => {
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === '0') stones[i] = '1';
        else if (stones[i].length % 2 === 0) {
            const newStone1 = stones[i].substring(0, stones[i].length / 2);
            const newStone2 = '' + (+stones[i].substring(stones[i].length / 2));
            stones.splice(i, 1, newStone1, newStone2);
            i++;
        } else stones[i] = '' + ((+stones[i]) * 2024);
    }
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const stones = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .flatMap(l => l.split(' '));

    if (test) console.log(stones);
    for (let i = 0; i < 25; i++) {
        modifyStones(stones);
        if (test && i < 6) console.log(stones);
    }

    const solution = stones.length;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
