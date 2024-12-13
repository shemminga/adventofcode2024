import {readFileSync} from 'node:fs';

let test;

const runCell = (instrs, x, y, z) => {
    const stack = [];
    let pc = 0;

    while (true) {
        const instr = instrs[pc][0];
        const op = instrs[pc][1];

        switch (instr) {
            case 'push':
                if (op === 'x') stack.push(x);
                else if (op === 'y') stack.push(y);
                else if (op === 'z') stack.push(z);
                else stack.push(+op);
                break;
            case 'add': {
                const sop1 = stack.pop();
                const sop2 = stack.pop();
                stack.push(sop1 + sop2);
                break;
            }
            case 'jmpos': {
                if (stack.pop() >= 0) pc += (+op);
                break;
            }
            case 'ret':
                return stack.pop();
            default: throw new Error(`Unknown instr ${instr}`);
        }

        pc++;
    }
};

const merge = space => {
    let todo = space.flat(2).filter(b => b.cloud);

    while (todo.length > 0) {
        const q = [todo.shift()];
        const {id} = q[0];
        q[0].id = 'Will be restored in the inner loop.';

        while (q.length > 0) {
            const cur = q.pop();

            if (!cur.cloud) continue;
            if (cur.id === id) continue;

            cur.id = id;

            if (cur.x > 0) q.push(space[cur.x - 1][cur.y][cur.z]);
            if (cur.y > 0) q.push(space[cur.x][cur.y - 1][cur.z]);
            if (cur.z > 0) q.push(space[cur.x][cur.y][cur.z - 1]);

            if (cur.x < space.length - 1) q.push(space[cur.x + 1][cur.y][cur.z]);
            if (cur.y < space[0].length - 1) q.push(space[cur.x][cur.y + 1][cur.z]);
            if (cur.z < space[0][0].length - 1) q.push(space[cur.x][cur.y][cur.z + 1]);
        }

        todo = todo.filter(b => b.id !== id);
    }
};

const runAllCells = instrs => {
    const zeroToThirty = [...Array(30).keys()];

    const space =
        zeroToThirty.map(x =>
            zeroToThirty.map(y =>
                zeroToThirty.map(z => ({
                    x, y, z,
                    id: 30 * 30 * x + 30 * y + z,
                    cloud: runCell(instrs, x, y, z) > 0}))));

    const beforeCells =
        space.flatMap(plane =>
            plane.flatMap(line =>
                line.filter(block => block.cloud)
                    .map(block => block.id)));
    console.log([...new Set(beforeCells)].length);

    merge(space);

    const afterCells =
        space.flatMap(plane =>
            plane.flatMap(line =>
                line.filter(block => block.cloud)
                    .map(block => block.id)));
    console.log([...new Set(afterCells)].length);

    return [...new Set(afterCells)].length;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const instrs = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.toLowerCase())
        .map(l => l.split(' '));

    const solution = runAllCells(instrs);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input1.txt');
    doFile('input2.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
