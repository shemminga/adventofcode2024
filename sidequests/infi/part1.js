import {readFileSync} from 'node:fs';

let test;

const runCell = (instrs, x, y, z) => {
    const stack = [];
    let pc = 0;

    while (true) {
        const instr = instrs[pc][0];
        const op = instrs[pc][1];

        switch (instr) {
            case 'push':
                if (op === 'x') stack.push(x);
                else if (op === 'y') stack.push(y);
                else if (op === 'z') stack.push(z);
                else stack.push(+op);
                break;
            case 'add': {
                const sop1 = stack.pop();
                const sop2 = stack.pop();
                stack.push(sop1 + sop2);
                break;
            }
            case 'jmpos': {
                if (stack.pop() >= 0) pc += (+op);
                break;
            }
            case 'ret':
                return stack.pop();
            default: throw new Error(`Unknown instr ${instr}`);
        }

        pc++;
    }
};

const runAllCells = instrs => {
    let sum = 0;
    for (let x = 0; x < 30; x++)
        for (let y = 0; y < 30; y++)
            for (let z = 0; z < 30; z++)
                sum += runCell(instrs, x, y, z);
    return sum;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const instrs = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.toLowerCase())
        .map(l => l
            .split(' '));

    const solution = runAllCells(instrs);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input1.txt');
    doFile('input2.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
