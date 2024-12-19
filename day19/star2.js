import {readFileSync} from 'node:fs';

let test;

const possibleDesigns = (design, towels, cache) => {
    if (design === '') return 1;
    if (cache[design] !== undefined) return cache[design];

    let possibleCount = 0;
    for (const towel of towels) {
        if (!design.startsWith(towel)) continue;

        const subdesign = design.slice(towel.length);
        possibleCount += possibleDesigns(subdesign, towels, cache);
    }

    cache[design] = possibleCount;
    return possibleCount;
};

const solve = (towels, designs) => {
    const cache = {};
    let possibleCount = 0;

    designs.forEach((design) => {
        possibleCount += possibleDesigns(design, towels, cache);
    });

    return possibleCount;
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const lines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const towels = lines[0].split(', ');
    const designs = lines.slice(1);

    const solution = solve(towels, designs);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
