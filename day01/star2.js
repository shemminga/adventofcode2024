import {readFileSync} from 'node:fs';

let test;

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const input = lines.map(l => l.split('   '));
    const list1 = input.map(xs => +xs[0]).sort((a, b) => a - b);
    const list2 = input.map(xs => +xs[1]).sort((a, b) => a - b);

    let solution = 0;
    list1.forEach(x1 =>
        list2.forEach(x2 => {
            if (x1 === x2)
                solution += x1;
        }));

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
