import {readFileSync} from 'node:fs';

let test;

const correctOrder = (line, rules) => {
    for (let i = 0; i < line.length; i++) {
        const page = line[i];
        if (!rules[page]) rules[page] = [];

        for(let j = 0; j < i; j++) {
            const page2 = line[j];
            if (rules[page].includes(page2)) return false;
        }
    }
    return true;
};

const fixOrder = (line, rules) => {
    const rv = [];
    const q = [...line].reverse();

    while (q.length > 0) {
        const page = q.shift();
        const earlierPageStillInQ = rules[page].filter(r => q.includes(r)).length > 0;

        if (earlierPageStillInQ) q.push(page);
        else rv.push(page);
    }

    return rv.reverse();
};


const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const rules = {};

    lines
        .filter(l => l.includes('|'))
        .map(l => l.split('|'))
        .forEach(r => {
            if (!rules[r[0]]) rules[r[0]] = [];
            rules[r[0]].push(r[1]);
        });

    const solution = lines
        .filter(l => l.includes(','))
        .map(l => l.split(','))
        .filter(l => !correctOrder(l, rules))
        .map(l => fixOrder(l, rules))
        .map(l => +l[Math.floor(l.length / 2)])
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
