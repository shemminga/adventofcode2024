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
    registers.B ^= operand;
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
    registers.B = registers.B ^ registers.C;
    return ip + 2;
};

const out = (ip, operand, registers, output) => {
    output.push(readComboOperand(operand, registers) % 8);
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

const solve = (program, registers) => {
    let ip = 0;
    const output = [];

    while (ip < program.length) {
        if (ip === program.length - 1) throw new Error("Reading operand past end of program.");

        const op = program[ip];
        const operand = program[ip + 1];

        ip = OPS[op](ip, operand, registers, output);
    }

    return output.join(',');
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

    console.log(registers);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input-test2.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
