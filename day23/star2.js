import {readFileSync} from 'node:fs';

let test;

const solve = conns => {
    /** @type {Set<string>[]} */
    const possibleCombos = [];

    for (const comp of conns.keys()) {
        possibleCombos.push(new Set([comp]));
    }
    if (test) console.log(possibleCombos);

    for (const [comp, others] of conns) {
        const newCombos = possibleCombos
            .filter(c => !c.has(comp))
            .filter(c => c.intersection(others).size === c.size)
            .map(c => new Set([...c, comp]));
        newCombos.forEach(c => possibleCombos.push(c));
    }

    const possiblePasswords = possibleCombos
        .map(c => [...c]
            .toSorted((a, b) => a.localeCompare(b))
            .join(','))
        .toSorted((a, b) => a.length - b.length)
        .reverse();

    if (test) console.log (possiblePasswords);

    return possiblePasswords[0];
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const conns = new Map();
    readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split('-'))
        .forEach(([c1, c2]) => {
            if (!conns.has(c1)) conns.set(c1, new Set());
            if (!conns.has(c2)) conns.set(c2, new Set());
            conns.get(c1).add(c2);
            conns.get(c2).add(c1);
        });

    const solution = solve(conns);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
