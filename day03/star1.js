import {readFileSync} from 'node:fs';

let test;

const scanOne = instr => {
    while (instr.length > 0) {
        if (instr.startsWith('mul(')) {
            instr = instr.substring(4);
            break;
        }
        instr = instr.substring(1);
    }

    if (instr[0] === ',') return [null, null, instr];

    let num1 = 0;
    while (instr.length > 0) {
        if (instr[0] >= '0' && instr[0] <= '9') {
            num1 *= 10;
            num1 += instr[0] - '0';
            instr = instr.substring(1);
        } else if (instr[0] === ',') {
            instr = instr.substring(1);
            break;
        } else return [null, null, instr];
    }

    if (instr[0] === ')') return [null, null, instr];

    let num2 = 0;
    while (instr.length > 0) {
        if (instr[0] >= '0' && instr[0] <= '9') {
            num2 *= 10;
            num2 += instr[0] - '0';
            instr = instr.substring(1);
        } else if (instr[0] === ')') {
            instr = instr.substring(1);
            return [num1, num2, instr];
        } else return [null, null, instr];
    }

    return [null, null, instr];
};

const scanAll = instr => {
    const muls = [];

    while (instr.length > 0) {
        const mul = scanOne(instr);
        if (mul[0] !== null) muls.push([mul[0], mul[1]]);
        instr = mul[2];
    }

    return muls;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const instr = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .join();

    const muls = scanAll(instr);

    const solution = muls.map(m => m[0] * m[1])
        .reduce((acc, x) => acc + x, 0);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
