import {readFileSync} from 'node:fs';

let test;

const isSafe = xs => {
    const dir = xs[0] > xs[1];
    for (let i = 1; i < xs.length; i++) {
        if (xs[i - 1] === xs[i]) return false;
        if ((xs[i - 1] > xs[i]) !== dir) return false;
        if (Math.abs(xs[i - 1] - xs[i]) > 3) return false;
    }
    return true;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split(' ').map(x => +x));

    let solution = lines.filter(xs => {
        if (isSafe(xs)) return true;

        for (let i = 0; i < xs.length; i++)
            if (isSafe(xs.toSpliced(i, 1)))
                return true;

        return false;
    }).length;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
