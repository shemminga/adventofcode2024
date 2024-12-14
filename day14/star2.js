import {readFileSync} from 'node:fs';

let test;

const gridToStringLines = (bots, xSize, ySize) => {
    const grid = Array.from(Array(ySize),
            _ => Array(xSize).fill('.'));

    bots.forEach(b => {
        if (grid[b.y][b.x] === '.') grid[b.y][b.x] = '0';
        grid[b.y][b.x]++;
    });

    return grid.map(l => l.join(''));

};

const dumpGrid = (secs, bots, xSize, ySize) => {
    const strings = gridToStringLines(bots, xSize, ySize);

    console.group(`After ${secs} seconds`);
    strings.forEach(str => console.log(str));
    console.groupEnd();
};

const couldBeTree = (bots, xSize, ySize) => {
    /* I had no idea what "a picture of a Christmas tree" was supposed to look like in ASCII Art. There are just too
     * many ways to do that.
     *
     * Turns out "a picture" is part of the thing drawn. There's a frame around it.
     */

    const topBottomFrame = '1111111111111111111111111111111';

    return gridToStringLines(bots, xSize, ySize)
        .filter(l => l.includes(topBottomFrame))
        .length === 2;
};

const move = (bot, xSize, ySize) => {
    let x = (bot.x + bot.vx) % xSize;
    let y = (bot.y + bot.vy) % ySize;

    if (x < 0) x += xSize;
    if (y < 0) y += ySize;

    return {...bot, x, y};
};

const doFile = (filename, xSize, ySize) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    let bots = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l
            .split(/[=, ]/)
            .filter(x => x !== 'p' && x !== 'v')
            .map(n => +n))
        .map(b => ({
            x: b[0], y: b[1], vx: b[2], vy: b[3]
        }));

    // There is one at 12790, but the answer is too high.
    for (let i = 0; i < 12790 - 1; i++) {
        bots = bots.map(bot => move(bot, xSize, ySize));

        if (couldBeTree(bots,xSize, ySize))
            dumpGrid(i + 1, bots, xSize, ySize);
    }

    const solution = 0;

    console.timeEnd(filename);
    console.groupEnd();
    console.log(''); // Weird console bug
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    // doFile('input-test1.txt', 11, 7);
    doFile('input.txt', 101, 103);
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
