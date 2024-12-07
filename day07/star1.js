import {readFileSync} from 'node:fs';

let test;

const canBeMadeTrue = eq => {
    const [result, ...operands] = eq;

    if (test)
        console.group(eq);

    let possibleIntermediates = [result];
    while (operands.length > 1) {
        const operand = operands.pop();

        const divs = possibleIntermediates
            .filter(n => n !== 0)
            .map(n => n / operand)
            .filter(n => n === Math.round(n));

        const subs = possibleIntermediates
            .map(n => n - operand)
            .filter(n => n >= 0);

        if (test) console.log(`${possibleIntermediates} / ${operand} => ${divs}   |||` +
            `   ${possibleIntermediates} - ${operand} => ${subs}`);

        possibleIntermediates = [...divs, ...subs];
    }

    const firstOperand = operands.pop();
    const truable = possibleIntermediates.filter(n => n === firstOperand).length > 0;

    if (test) {
        console.log(`Last operand ${firstOperand} is in ${possibleIntermediates}? ${truable}`);
        console.groupEnd();
    }

    return truable;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l
        .split(/[: ]+/))
        .map(l => l.map(x => +x));

    const trueLines = lines.filter(canBeMadeTrue);

    if (test) console.log(trueLines);

    const solution = trueLines.map(l => l[0])
        .reduce((acc, x) => acc + x);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
