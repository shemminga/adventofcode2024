import {readFileSync} from 'node:fs';

let test;

const checkBlock = (blockNr, carryIn, wireDests) => {
    /* Schema of full adder:
     *
     * Sum:
     * 1: x  XOR y   => S_
     * 2: S_ XOR cIn => z
     *
     * Carry:
     * 3: x  AND y   => xy_
     * 4: S_ AND cIn => SC
     * 5: SC OR  xy_ => cOut
     */

    const x = 'x' + blockNr;
    const y = 'y' + blockNr;
    const z = 'z' + blockNr;

    // === Check sum block
    // Check gate 1
    const xorInX = wireDests.get(x).filter(instr => instr.op === 'XOR')[0];
    const xorInY = wireDests.get(y).filter(instr => instr.op === 'XOR')[0];
    if (xorInX !== xorInY) console.log(`${x} and ${y} don't share an XOR`);

    const s_ = xorInX.out;

    // Check gate 2
    const xorInS_ = wireDests.get(s_).filter(instr => instr.op === 'XOR')[0];
    const xorInCIn = wireDests.get(carryIn).filter(instr => instr.op === 'XOR')[0];
    if (xorInS_ !== xorInCIn) console.log(`${s_} and ${carryIn} don't share an XOR`);
    if (xorInS_.out !== z) console.log(`Output of ${s_} XOR ${carryIn} !== ${z}`);

    // === Check carry block
    // Check gate 3
    const andInX = wireDests.get(x).filter(instr => instr.op === 'AND')[0];
    const andInY = wireDests.get(y).filter(instr => instr.op === 'AND')[0];
    if (andInX !== andInY) console.log(`${x} and ${y} don't share an AND`);

    const xy_ = andInX.out;

    // Check gate 4
    const andInS_ = wireDests.get(s_).filter(instr => instr.op === 'AND')[0];
    const andInCIn = wireDests.get(carryIn).filter(instr => instr.op === 'AND')[0];
    if (andInS_ !== andInCIn) console.log(`${s_} and ${carryIn} don't share an AND`);

    const sc = andInS_.out;

    // Check gate 5
    const orInXY_ = wireDests.get(xy_).filter(instr => instr.op === 'OR')[0];
    const orInSC = wireDests.get(sc).filter(instr => instr.op === 'OR')[0];
    if (orInXY_ !== orInSC) console.log(`${s_} and ${sc} don't share an OR`);

    // Return carry out
    return orInXY_.out;
};

const swap = (out1, out2, instrs, swaps) => {
    swaps.push(out1, out2);
    instrs.forEach(instr => {
        if (instr.out === out1) instr.out = out2;
        else if (instr.out === out2) instr.out = out1;
    });
};

const solve = instrs => {
    // The following swaps fix the ripple-carry adder. Found by running the check without the swap, and the seeing
    // what needs to be fixed.
    const swaps = [];
    swap('fkb', 'z16', instrs, swaps);
    swap('nnr', 'rqf', instrs, swaps);
    swap('rdn', 'z31', instrs, swaps);
    swap('rrn', 'z37', instrs, swaps);

    const wireDests = new Map();

    instrs.forEach(instr => {
        if (!wireDests.has(instr.in1)) wireDests.set(instr.in1, []);
        if (!wireDests.has(instr.in2)) wireDests.set(instr.in2, []);
        wireDests.get(instr.in1).push(instr);
        wireDests.get(instr.in2).push(instr);
    });

    // x00 + y00 is correct. It's a half adder, with prt as its carry out.

    let carry = 'prt';
    for (let i = 1; i < 45; i++) {
        const blockNr = ('' + i).padStart(2, '0');
        carry = checkBlock(blockNr, carry, wireDests);
    }

    if (carry !== 'z45') {
        console.log(`Final carry out is not most significant bit, but: ${carry}`);
    }

    return swaps.toSorted((a, b) => a.localeCompare(b)).join(',');
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const fileLines = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const instrs = fileLines
        .filter(l => l.includes('->'))
        .map(l => l.split(' '))
        .map(([in1, op, in2, _, out]) => ({op, in1, in2, out}));

    const solution = solve(instrs);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
