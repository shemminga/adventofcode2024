import {readFileSync} from 'node:fs';

let test;

const COORDS = {};

(() => {
    const numpad = [
        '789',
        '456',
        '123',
        '.0A'
    ];

    for (let i = 0; i < numpad.length; i++)
        for (let j = 0; j < numpad[i].length; j++)
            if (numpad[i].charAt(j) !== '.')
                COORDS[numpad[i].charAt(j)] = {i, j, isNum: true};

    const dpad = [
        '.^#',
        '<v>'
    ];

    for (let i = 0; i < dpad.length; i++)
        for (let j = 0; j < dpad[i].length; j++)
            if (dpad[i].charAt(j) !== '.')
                COORDS[dpad[i].charAt(j)] = {i, j, isNum: false};
})();

const genPerms = (list1, list2) => {
    if (list1.length === 0) return [list2.join('') + '#'];
    if (list2.length === 0) return [list1.join('') + '#'];

    const [x1, ...xs1] = list1;
    const [x2, ...xs2] = list2;

    const perms = [];
    genPerms(xs1, list2).map(p => x1 + p).forEach(p => perms.push(p));
    genPerms(list1, xs2).map(p => x2 + p).forEach(p => perms.push(p));
    return perms;
};

const routes = (start, end) => {
    const sCoord = COORDS[start];
    const eCoord = COORDS[end];
    const di = eCoord.i - sCoord.i;
    const dj = eCoord.j - sCoord.j;

    const vPart = di < 0 ? '^'.repeat(-di) : 'v'.repeat(di);
    const hPart = dj < 0 ? '<'.repeat(-dj) : '>'.repeat(dj);

    const rv = genPerms(vPart.split(''), hPart.split(''));

    if ((sCoord.isNum && sCoord.i === 3) || (!sCoord.isNum && sCoord.i === 0)) {
        const forbiddenPrefix = '<'.repeat(sCoord.j);
        return rv.filter(r => !r.startsWith(forbiddenPrefix));
    }

    if (sCoord.isNum && sCoord.j === 0) {
        const forbiddenPrefix = 'v'.repeat(3 - sCoord.i);
        return rv.filter(r => !r.startsWith(forbiddenPrefix));
    }

    if (!sCoord.isNum && sCoord.j === 0) {
        return rv.filter(r => !r.startsWith('^'));
    }

    return rv;
};

const oneStep = (start, end, level) => {
    return routes(start, end)
        .flatMap(c => solveSub(c, '#', level - 1));
};

const solveSub = (input, confirm, level) => {
    if (level === 0) return [input];

    let cur = confirm;

    let routes = [];

    for (let targetIdx = 0; targetIdx < input.length; targetIdx++) {
        const next = input.charAt(targetIdx);
        const newParts = oneStep(cur, next, level);
        if (routes.length === 0) routes = newParts;
        else routes = newParts.flatMap(newPart => routes.map(base => base + newPart));
        cur = next;
    }

    return routes;
};

const solveCode = code => {
    console.group(code);

    const routes = solveSub(code, 'A', 3);
    const spath = routes.reduce((min, route) => Math.min(min, route.length), Number.MAX_SAFE_INTEGER);

    const numPart = parseInt(code, 10);
    const complexity = spath * numPart;
    console.log(`${code} => ${spath} * ${numPart} = ${complexity}`);

    console.groupEnd();
    return complexity;
};

const solve = codes => {
    return codes.map(code => solveCode(code))
        .reduce((acc, cur) => acc + cur)
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const codes = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const solution = solve(codes);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
