import {readFileSync} from 'node:fs';

let test;

const readComboOperand = operand => {
    if (operand <= 3) return operand;
    if (operand === 4) return 'A';
    if (operand === 5) return 'B';
    if (operand === 6) return 'C';
    throw new Error(`Reserved combo operand ${operand}`);
};

const adv = (ip, operand) => {
    const denom = readComboOperand(operand);
    console.log(`${ip}: A = trunc(A / 2 ** ${denom})`);
};

const bxl = (ip, operand) => console.log(`${ip}: B = B xor ${operand}`);

const bst = (ip, operand) => {
    const val = readComboOperand(operand);
    console.log(`${ip}: B = ${val} % 8`);
};

const jnz = (ip, operand) => console.log(`${ip}: if A != 0: goto ${operand}`);

const bxc = ip => console.log(`${ip}: B = B xor C`);

const out = (ip, operand) => {
    const val = readComboOperand(operand);
    console.log(`${ip}: print ${val} % 8`);
};

const bdv = (ip, operand) => {
    const denom = readComboOperand(operand);
    console.log(`${ip}: B = trunc(A / 2 ** ${denom})`);
};

const cdv = (ip, operand) => {
    const denom = readComboOperand(operand);
    console.log(`${ip}: C = trunc(A / 2 ** ${denom})`);
};

const OPS = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

function explain(program) {
    let ip = 0;

    while (ip < program.length) {
        const op = program[ip];
        const operand = program[ip + 1];

        OPS[op](ip, operand);
        ip += 2;
    }
}

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const program = lines.filter(l => l.startsWith('Program'))
        .map(l => l.split(' '))
        .map(xs => xs[1])
        .flatMap(s => s.split(',')
            .map(n => +n));

    explain(program);

    const solution = '';
    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input-test2.txt');
    doFile('input-test3.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
