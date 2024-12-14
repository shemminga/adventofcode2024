import {readFileSync} from 'node:fs';

const RUNTIME = 100;
let test;

const move = (bot, xSize, ySize) => {
    let x = (bot[0] + RUNTIME * bot[2]) % xSize;
    let y = (bot[1] + RUNTIME * bot[3]) % ySize;

    if (x < 0) x += xSize;
    if (y < 0) y += ySize;

    return {x,y};
};

const doFile = (filename, xSize, ySize) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const bots = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l
            .split(/[=, ]/)
            .filter(x => x !== 'p' && x !== 'v')
            .map(n => +n));

    const after = bots.map(bot => move(bot, xSize, ySize));

    const xSep = Math.floor(xSize / 2);
    const ySep = Math.floor(ySize / 2);

    const quarters = Array(4).fill(0);

    after
        .filter(b => b.x !== xSep)
        .filter(b => b.y !== ySep)
        .forEach(b => {
            if (b.x < xSep && b.y < ySep) quarters[0]++;
            if (b.x > xSep && b.y < ySep) quarters[1]++;
            if (b.x < xSep && b.y > ySep) quarters[2]++;
            if (b.x > xSep && b.y > ySep) quarters[3]++;
        });

    console.log(quarters);

    const solution = quarters.reduce((cum, x) => cum * x, 1);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt', 11, 7);
    doFile('input.txt', 101, 103);
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
