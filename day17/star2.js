import {readFileSync} from 'node:fs';

let test;

const readComboOperand = (operand, registers) => {
    if (operand <= 3) return operand;
    if (operand === 4) return registers.A;
    if (operand === 5) return registers.B;
    if (operand === 6) return registers.C;
    throw new Error(`Reserved combo operand ${operand}`);
};

const adv = (ip, operand, registers) => {
    const num = registers.A;
    const denom = readComboOperand(operand, registers);

    registers.A = Math.trunc(num / 2 ** denom);

    return ip + 2;
};

const bxl = (ip, operand, registers) => {
    registers.B = (registers.B ^ operand) >>> 0;
    return ip + 2;
};

const bst = (ip, operand, registers) => {
    registers.B = readComboOperand(operand, registers) % 8;
    return ip + 2;
};

const jnz = (ip, operand, registers) => {
    if (registers.A === 0) return ip + 2;
    return operand;
};

const bxc = (ip, operand, registers) => {
    registers.B = (registers.B ^ registers.C) >>> 0;
    return ip + 2;
};

const out = (ip, operand, registers, output) => {
    const val = readComboOperand(operand, registers) % 8;
    output.push(val);
    return ip + 2;
};

const bdv = (ip, operand, registers) => {
    const num = registers.A;
    const denom = readComboOperand(operand, registers);

    registers.B = Math.trunc(num / 2 ** denom);

    return ip + 2;
};

const cdv = (ip, operand, registers) => {
    const num = registers.A;
    const denom = readComboOperand(operand, registers);

    registers.C = Math.trunc(num / 2 ** denom);

    return ip + 2;
};

const OPS = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const run = (program, registers) => {
    let ip = 0;
    const output = [];

    while (ip < program.length) {
        if (ip === program.length - 1) throw new Error("Reading operand past end of program.");
        if (ip % 2 === 1) throw new Error('Odd IP');

        const op = program[ip];
        const operand = program[ip + 1];

        ip = OPS[op](ip, operand, registers, output);
    }

    return output.join(',');
};

const solveRecursive = (program, registers, A, programStr) => {
    for (let i = 0; i < 8; i++) {
        if (A === 0) {
            A++;
            continue;
        }

        const output = run(program, {...registers, A});
        if (programStr === output) return A;
        if (programStr.endsWith(output)) {
            const tryRecurse = solveRecursive(program, registers, A * 8, programStr);
            if (tryRecurse !== false) return tryRecurse;
        }
        A++;
    }

    return false;
};

const solve = (program, registers) => {
    /*
     * Each program is a loop which number of iterations is solely dependent on Register A. Register A can only be set
     * by an ADV instruction. And it's only used with operand 3. Each iteration will divide A by 8 and truncate. There's
     * also only one OUT per iteration.
     */

    const programStr = program.join(',');

    return solveRecursive(program, registers, 0, programStr);
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const registers = {};
    lines.filter(l => l.startsWith('Register'))
        .map(l => l.split(/[: ]/))
        .forEach(l => registers[l[1]] = +l[3]);

    const program = lines.filter(l => l.startsWith('Program'))
        .map(l => l.split(' '))
        .map(xs => xs[1])
        .flatMap(s => s.split(',')
            .map(n => +n));

    const solution = solve(program, registers);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test3.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
