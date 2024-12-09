import {readFileSync} from 'node:fs';

let test;

const dumpBlocks = blocks => {
    if (test) console.log(blocks.map(b => ('' + b.id).repeat(b.size)).join(''));
};

const compact = blocksIn => {
    const blocks = [...blocksIn], newBlocks = [];
    let cursor1 = 0, cursor2 = blocks.length - 1;
    let freeSpace = 0;

    while (cursor1 <= cursor2) {
        while (blocks[cursor1].id !== '.') {
            newBlocks.push(blocks[cursor1]);
            cursor1++;
        }
        while (blocks[cursor2].id === '.') {
            freeSpace += blocks[cursor2].size;
            cursor2--;
        }

        if (cursor1 > cursor2) break;

        const block1 = blocks[cursor1], block2 = blocks[cursor2];

        if (block1.size === block2.size) {
            newBlocks.push(block2);
            freeSpace += block2.size;
            cursor1++;
            cursor2--;
        } else if (block1.size > block2.size) {
            newBlocks.push(block2);
            block1.size -= block2.size;
            freeSpace += block2.size;
            cursor2--;
        } else if (block1.size < block2.size) {
            newBlocks.push({
                id: block2.id,
                size: block1.size,
            });
            block2.size -= block1.size;
            freeSpace += block1.size;
            cursor1++;
        }
    }

    newBlocks.push({
        id: '.',
        size: freeSpace
    });

    return newBlocks;
};

const checksum = blocks => {
    let rv = 0, idx = 0;

    blocks
        .filter(b => b.id !== '.')
        .forEach(b => {
            // if (test) console.log(idx, b, rv);
            rv += ((idx + idx + b.size - 1) / 2) * b.size * b.id;
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
