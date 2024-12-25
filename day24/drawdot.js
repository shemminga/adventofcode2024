import {readFileSync, writeFileSync} from 'node:fs';

let test;

const draw = (instrs, filePostfix) => {
    instrs.forEach(instr => instr.key = `${instr.op}_${instr.in1}_${instr.in2}_${instr.out}`);

    const wires = [...new Set(instrs
        .flatMap(instr => [instr.in1, instr.in2, instr.out]))]
        .toSorted((a, b) => a.localeCompare(b));

    const outLines = [];

    outLines.push('digraph {');

    outLines.push('  subgraph {');
    wires.filter(w => w.startsWith('x'))
        .forEach(w => outLines.push(`  ${w} [shape = rectangle, style = filled, fillcolor = aqua]`));

    outLines.push('  }');

    outLines.push('  subgraph {');
    wires.filter(w => w.startsWith('y'))
        .forEach(w => outLines.push(`  ${w} [shape = rectangle, style = filled, fillcolor = chartreuse]`));

    outLines.push('  }');

    outLines.push('  subgraph {');
    wires.filter(w => w.startsWith('z'))
        .forEach(w => outLines.push(`  ${w} [shape = rectangle, style = filled, fillcolor = gold]`));

    outLines.push('  }');

    wires.filter(w => !w.startsWith('x'))
        .filter(w => !w.startsWith('y'))
        .filter(w => !w.startsWith('z'))
        .forEach(w => outLines.push(`  ${w} [shape = plain]`));

    instrs.forEach(instr => outLines.push(`  ${instr.key} [shape = oval, label = ${instr.op}]`));

    instrs.forEach(instr => {
        outLines.push(`  ${instr.in1} -> { ${instr.key} }`);
        outLines.push(`  ${instr.in2} -> { ${instr.key} }`);
        outLines.push(`  ${instr.key} -> { ${instr.out} }`);
    });

    outLines.push('}');

    writeFileSync(`graph-${filePostfix}.dot`, outLines.join('\n'), 'utf8');

    return 0;
};

const swap = (out1, out2, instrs) => {
    instrs.forEach(instr => {
        if (instr.out === out1) instr.out = out2;
        else if (instr.out === out2) instr.out = out1;
    });
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

    draw(instrs, 'input');

    swap('fkb', 'z16', instrs);
    swap('nnr', 'rqf', instrs);
    swap('rdn', 'z31', instrs);
    swap('rrn', 'z37', instrs);

    draw(instrs, 'fixed');

    console.timeEnd(filename);
    console.groupEnd();
};

(() => {
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
