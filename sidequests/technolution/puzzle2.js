/*
 * >  Move the pointer to the right
 * <  Move the pointer to the left
 * +  Increment the memory cell at the pointer
 * -  Decrement the memory cell at the pointer
 * .  Output the character signified by the cell at the pointer
 * ,  UNUSED Input a character and store it in the cell at the pointer
 * [  Jump past the matching ] if the cell at the pointer is 0
 * ]  Jump back to the matching [ if the cell at the pointer is nonzero
 */

const ASSIGNABLE_INSTRUCTIONS = ['>', '<', '+', '-', '.'];

const copyAdjustTape = (tape, ptr, adjustment) => {
    const nextTape = [...tape];
    nextTape[ptr] = (256 + tape[ptr] + adjustment) % 256;
    return nextTape;
};

const executeInstr = (program, pos, ptr, tape, instrMap, output) => {
    let level = 1;
    let i = pos;
    switch(instrMap[program[pos]]) {
        case '>': return [pos + 1, ptr + 1, tape, output];
        case '<': return [pos + 1, ptr - 1, tape, output];
        case '+': return [pos + 1, ptr, copyAdjustTape(tape, ptr, +1), output];
        case '-': return [pos + 1, ptr, copyAdjustTape(tape, ptr, -1), output];
        case '.': return [pos + 1, ptr, tape, output + String.fromCharCode(tape[ptr])];
        case ',': throw new Error("Not implemented");
        case '[':
            if (tape[ptr] !== 0) return [pos + 1, ptr, tape, output];
            while (level > 0) {
                i++;
                if (program[i] === program[pos]) level++;
                if (instrMap[program[i]] === ']') level--;
            }
            return [i + 1, ptr, tape, output];
        case ']':
            if (tape[ptr] === 0) return [pos + 1, ptr, tape, output];
            while (level > 0) {
                i--;
                if (program[i] === program[pos]) level++;
                if (instrMap[program[i]] === '[') level--;
            }
            return [i + 1, ptr, tape, output];
        default: throw new Error(`${pos} ${program[pos]} ${instrMap[program[pos]]}`);
    }
};

const realRun = (program, instrMap) => {
    let pos = 0, ptr = 0, tape = [], output = '';

    while (pos < program.length) {
        if (ptr >= tape.length) tape.push(0);
        [pos, ptr, tape, output] = executeInstr(program, pos, ptr, tape, instrMap, output);
    }

    return output;
};

let visitedStates = [];
const stateString = (pos, ptr, tape, output) => `${pos} ${ptr} ${tape.join(',')} ${output}`;

const tryNext = (program, pos, ptr, tape, instrMap, output) => {
    const state = stateString(pos, ptr, tape, output);
    if (visitedStates.includes(state)) return false; // Infinite loop
    visitedStates.push(state);

    if (ptr < 0) return false;
    if (ptr >= 300) return false; // Limit memory
    if (output.length > 10) return false; // Limit output
    if (ptr >= tape.length) tape.push(0);
    if (pos >= program.length) return output === "42" ? instrMap : false;

    if (instrMap[program[pos]]) {
        const [nextPos, nextPtr, nextTape, nextOutput] = executeInstr(program, pos, ptr, tape, instrMap, output);
        return tryNext(program, nextPos, nextPtr, nextTape, instrMap, nextOutput);
    }

    const results = ASSIGNABLE_INSTRUCTIONS
        .filter(instr => !Object.values(instrMap).includes(instr))
        .map(instr => {
            const nextInstrMap = {...instrMap, [program[pos]]: instr};
            const [nextPos, nextPtr, nextTape, nextOutput] = executeInstr(program, pos, ptr, tape, nextInstrMap,
                output);
            return tryNext(program, nextPos, nextPtr, nextTape, nextInstrMap, nextOutput);
        }).filter(x => x);

    if (results.length > 1) console.warn("Multiple solutions found: ", results);

    return results.length === 0 ? false : results[0];
};

const isValidJumpCombo = (program, left, right) => {
    let level = 0;

    for (let i = 0; i < program.length; i++) {
        if (program[i] === left) level++;
        if (program[i] === right) level--;

        if (level < 0) return false;
    }

    return level === 0;
};

const jumpCombos = program => {
    const combos = [];
    const triedLeft = [];

    for (let i = 0; i < program.length; i++) {
        if (triedLeft.includes(program[i])) continue;
        triedLeft.push(program[i]);

        const triedRight = [];
        for (let j = i + 1; j < program.length; j++) {
            if (program[i] === program[j]) continue;
            if (triedLeft.includes(program[j])) continue;
            if (triedRight.includes(program[j])) continue;
            triedRight.push(program[j]);

            if (isValidJumpCombo(program, program[i], program[j]))
                combos.push([program[i], program[j]]);
        }
    }

    return combos;
};

const tryRun = program => {
    const results = jumpCombos(program)
        .map(([left, right]) => {
            visitedStates = [];
            return tryNext(program, 0, 0, [], {[left]: '[', [right]: ']'}, "")
        })
        .filter(x => x);

    if (results.length > 1) console.warn("Multiple solutions found: ", results);
    return results.length === 0 ? false : results[0];
};

const doSolve = (example, real) => {
    console.group(`*** ${new Date().toLocaleTimeString()} ***`);
    console.time();

    const instrMap = tryRun(example);
    console.log(instrMap);
    const solution = realRun(real, instrMap);

    console.timeEnd();
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doSolve('PPPPPSRPPPPPPPPPPTFWRPPLFFL', 'PPPPPPPSRPPPPPPTFWRPPPPPPPLPPPPPPPPLFLFL');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
