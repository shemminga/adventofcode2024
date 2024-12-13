import {readFileSync} from 'node:fs';

let test;

const solveMachine = ({a, b, prize}) => {
    if (test) console.group(JSON.stringify({a, b, prize}));
    if (a.x / a.y === b.x / b.y) return 0; // Parallel

    const nB = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
    const nA = (prize.x - nB * b.x) / a.x;

    if (test) {
        console.log(
            `${nA} * ${a.x} === ${prize.x} - ${nB} * ${b.x} => ${nA*a.x} === ${prize.x - nB*b.x} => ${nA*a.x ===
            prize.x - nB*b.x}`);
        console.log(
            `${nA} * ${a.y} === ${prize.y} - ${nB} * ${b.y} => ${nA * a.y} === ${prize.y - nB * b.y} => ${nA * a.y ===
            prize.y - nB * b.y}`);
    }

    const cost = nA * 3 + nB;
    if (test) {
        console.log(cost);
        console.groupEnd();
    }

    if (nA !== Math.round(nA) || nB !== Math.round(nB) ) return 0; // Integer steps only
    if (nA > 100 || nB > 100) return 0; // Max 100 button presses

    return cost;
};

const parseMachine = lines => {
    const aSplit = lines[0].split(/[+,]/);
    const bSplit = lines[1].split(/[+,]/);
    const prizeSplit = lines[2].split(/[=,]/);

    return {
        a: {x: +aSplit[1], y: +aSplit[3]},
        b: {x: +bSplit[1], y: +bSplit[3]},
        prize: {x: +prizeSplit[1], y: +prizeSplit[3]}
    };
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const machines = [...Array(Math.ceil(lines.length / 3))]
        .map(_ => lines.splice(0, 3))
        .map(m => parseMachine(m));

    const solution = machines
        .map(m => solveMachine(m))
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
