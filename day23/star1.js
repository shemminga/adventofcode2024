import {readFileSync} from 'node:fs';

let test;

const solve = conns => {
    const trios = new Set();
    for (const [comp1, others] of conns)
        if (comp1.startsWith('t'))
            for (const comp2 of others)
                for (const comp3 of conns.get(comp2))
                    if (others.has(comp3))
                        trios.add(
                            [comp1, comp2, comp3]
                                .toSorted((a, b) => a.localeCompare(b))
                                .join(',')
                        );

    if (test)
        console.log([...trios].toSorted((a, b) => a.localeCompare(b)));

    return trios.size;
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
