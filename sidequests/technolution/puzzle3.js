/*
 * >  Move the pointer to the right
 * <  Move the pointer to the left
 * +  Increment the memory cell at the pointer
 * -  Decrement the memory cell at the pointer
 * .  Output the character signified by the cell at the pointer
 * ,  Input a character and store it in the cell at the pointer
 * [  Jump past the matching ] if the cell at the pointer is 0
 * ]  Jump back to the matching [ if the cell at the pointer is nonzero
 */

const ASSIGNABLE_INSTRUCTIONS = ['>', '<', '+', '-', '.', ',', 'x'];

const copyAdjustTape = (tape, ptr, adjustment) => {
    const nextTape = [...tape];
    nextTape[ptr] = (256 + tape[ptr] + adjustment) % 256;
    return nextTape;
};

const copyReplaceTape = (tape, ptr, replacement) => {
    const nextTape = [...tape];
    nextTape[ptr] = replacement;
    return nextTape;
};

const executeInstr = (program, pos, ptr, tape, instrMap, output, input) => {
    let level = 1;
    let i = pos;
    switch(instrMap[program[pos]]) {
        case '>': return [pos + 1, ptr + 1, tape, output, input];
        case '<': return [pos + 1, ptr - 1, tape, output, input];
        case '+': return [pos + 1, ptr, copyAdjustTape(tape, ptr, +1), output, input];
        case '-': return [pos + 1, ptr, copyAdjustTape(tape, ptr, -1), output, input];
        case '.': return [pos + 1, ptr, tape, output + String.fromCharCode(tape[ptr]), input];
        case ',': return [pos + 1, ptr, copyReplaceTape(tape, ptr, input.charCodeAt(0)), output, input.substring(1)];
        case 'x': return [pos + 1, ptr, tape, output, input];
        case '[':
            if (tape[ptr] !== 0) return [pos + 1, ptr, tape, output, input];
            while (level > 0) {
                i++;
                if (program[i] === program[pos]) level++;
                if (instrMap[program[i]] === ']') level--;
            }
            return [i + 1, ptr, tape, output, input];
        case ']':
            if (tape[ptr] === 0) return [pos + 1, ptr, tape, output, input];
            while (level > 0) {
                i--;
                if (program[i] === program[pos]) level++;
                if (instrMap[program[i]] === '[') level--;
            }
            return [i + 1, ptr, tape, output, input];
        default: throw new Error(`${pos} ${program[pos]} ${instrMap[program[pos]]}`);
    }
};

const realRun = (program, instrMap, input) => {
    let pos = 0, ptr = 0, tape = [], output = '';

    while (pos < program.length) {
        if (ptr >= tape.length) tape.push(0);
        [pos, ptr, tape, output, input] = executeInstr(program, pos, ptr, tape, instrMap, output, input);
    }

    return output;
};

let visitedStates = [];
const stateString = (pos, ptr, tape, output, input, instrMap) =>
    `${pos} ${ptr} ${tape.join(',')} ${output} ${input} ${JSON.stringify(instrMap)}`;

const hasNopFree = instrMap => {
    return Object.values(instrMap).filter(instr => instr === 'x').length < 2
};

const tryNext = (program, pos, ptr, tape, instrMap, output, input) => {
    const state = stateString(pos, ptr, tape, output, input, instrMap);
    if (visitedStates.includes(state)) return false; // Infinite loop
    visitedStates.push(state);

    if (ptr < 0) return false;
    if (ptr >= 6) return false; // Limit memory
    if (output.length > 2) return false; // Limit output
    if (instrMap[program[pos]] === ',' && input === '') return false; // No more input to read
    if (instrMap[program[pos]] === '-' && tape[ptr] === 0) return false; // Disallow underflow: valid but unused
    if (instrMap[program[pos]] === '+' && tape[ptr] === 255) return false; // Disallow overflow: valid but unused
    if (ptr >= tape.length) tape = [...tape, 0];
    if (pos >= program.length) return output === "42" ? instrMap : false;

    if (instrMap[program[pos]]) {
        const [nextPos, nextPtr, nextTape, nextOutput, nextInput] =
            executeInstr(program, pos, ptr, tape, instrMap, output, input);
        return tryNext(program, nextPos, nextPtr, nextTape, instrMap, nextOutput, nextInput);
    }

    const results = ASSIGNABLE_INSTRUCTIONS
        .filter(instr => (instr === 'x' && hasNopFree(instrMap)) || !Object.values(instrMap).includes(instr))
        .filter(instr => instr !== ',' || input !== '')
        .map(instr => {
            const nextInstrMap = {...instrMap, [program[pos]]: instr};
            const [nextPos, nextPtr, nextTape, nextOutput, nextInput] =
                executeInstr(program, pos, ptr, tape, nextInstrMap, output, input);
            return tryNext(program, nextPos, nextPtr, nextTape, nextInstrMap, nextOutput, nextInput);
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

const tryRun = (program, input) => {
    const results = jumpCombos(program)
        .map(([left, right]) => {
            visitedStates = [];
            return tryNext(program, 0, 0, [], {[left]: '[', [right]: ']'}, "", input)
        })
        .filter(x => x);

    if (results.length > 1) console.warn("Multiple solutions found: ", results);
    return results.length === 0 ? false : results[0];
};

const doSolve = (example, real) => {
    console.group(`*** ${new Date().toLocaleTimeString()} ***`);
    console.time();

    const instrMap = tryRun(example, "1");
    console.log(instrMap);
    const solution = realRun(real, instrMap, "1987");

    console.timeEnd();
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doSolve('TCTNTNTNTTNTHETCTCTTCTNTCTU_NOCECELNHUN_NEENTETUUN_ONETNTTNIETIU',
        'TCTTCHNETCTTCTU_OEHUTNTE_OUCELHETCTUC_OEHETETNENTCUCUCU_OUNUHETETETUU' +
        'CU_OLHETU_ONLNECEH_NUCUC_ECEONUNTCTCIECENE_CIU_INUCUCUCIENECEECETCITCTTTCT' +
        'CI_C__NELC_NECTCTNTTHUN_C_C_E_NONUHUIE_OUCUCU_N_C__N_C_IECECIUCUUUCUCTI');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
