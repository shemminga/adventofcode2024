import {readFileSync} from 'node:fs';

let test;

const doOp = (op, val1, val2) => {
    switch (op) {
        case 'OR': return (val1 | val2) >>> 0;
        case 'AND': return (val1 & val2) >>> 0;
        case 'XOR': return (val1 ^ val2) >>> 0;
    }
    throw new Error(`Unknown op: ${op}`);
};

const solve = (instrs, lines) => {
    const q = [...instrs];

    while (q.length > 0) {
        const instr = q.shift();

        if (lines[instr.in1] === undefined || lines[instr.in2] === undefined) {
            // Unset input, wait a bit
            q.push(instr);
            continue;
        }

        lines[instr.out] = doOp(instr.op, lines[instr.in1], lines[instr.in2]);
        if (test)
            console.log(`${instr.in1} ${lines[instr.in1]} ${instr.op} ${instr.in2} ${lines[instr.in2]} => ` +
                `${instr.out} ${lines[instr.out]}`);
    }

    let result = 0;

    Object.keys(lines)
        .filter(l => l.startsWith('z'))
        .forEach(l => {
            const znr = +l.substring(1);
            const val = lines[l];
            result += val * 2**znr;
        });

    return result;
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const fileLines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const lines = {};
    fileLines
        .filter(l => l.includes(':'))
        .map(l => l.split(': '))
        .filter(([name, val]) => lines[name] = +val);

    const instrs = fileLines
        .filter(l => l.includes('->'))
        .map(l => l.split(' '))
        .map(([in1, op, in2, _, out]) => ({op, in1, in2, out}));

    const solution = solve(instrs, lines);

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
