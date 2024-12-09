import {readFileSync} from 'node:fs';

let test;

const dumpBlocks = blocks => {
    if (test) console.log(blocks.map(b => ('' + b.id).repeat(b.size)).join(''));
};

const compact = blocksIn => {
    const blocks = [...blocksIn], newBlocks = [];

    for (let endCursor = blocks.length - 1; endCursor >= 0; endCursor--) {
        if (blocks[endCursor].id === '.') continue;

        for (let beginCursor = 0; beginCursor < endCursor; beginCursor++) {
            if (blocks[beginCursor].id !== '.') continue;

            if (blocks[beginCursor].size < blocks[endCursor].size) continue;

            if (blocks[beginCursor].size === blocks[endCursor].size) {
                blocks[beginCursor].id = blocks[endCursor].id;
                blocks[endCursor].id = '.';
                break;
            }

            const newBlock = {
                id: '.',
                size: blocks[beginCursor].size - blocks[endCursor].size
            };
            blocks[beginCursor].id = blocks[endCursor].id;
            blocks[beginCursor].size = blocks[endCursor].size;
            blocks[endCursor].id = '.';

            blocks.splice(beginCursor + 1, 0, newBlock);
            endCursor++;
            break;
        }

        dumpBlocks(blocks);
    }

    return blocks;
};

const checksum = blocks => {
    let rv = 0, idx = 0;

    blocks
        .forEach(b => {
            // if (test) console.log(idx, b, rv);
            if (b.id !== '.') rv += ((idx + idx + b.size - 1) / 2) * b.size * b.id;
            idx += b.size;
        });

    return rv;
};
const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const blocks = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .flatMap(l => l
            .split('')
            .map((b, idx) => ({
                id: (idx % 2 === 1) ? '.' : (idx / 2),
                size: +b
            })));

    dumpBlocks(blocks);
    const newBlocks = compact(blocks);
    dumpBlocks(newBlocks);

    const solution = checksum(newBlocks);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
