import {readFileSync} from 'node:fs';

let test;

const calcPrice = (grid, visited, iStart, jStart) => {
    const type = grid[iStart][jStart];
    const q = [{i: iStart, j: jStart}];
    let area = 0, perimeter = 0;

    // console.group(type);
    // console.log(iStart, jStart, type);

    while (q.length > 0) {
        const {i, j} = q.pop();

        // console.log(i, j, grid[i][j], visited[i][j]);

        if (grid[i][j] !== type) continue;
        if (visited[i][j]) continue;

        visited[i][j] = true;
        area++;

        if (i > 0) {
            if (grid[i - 1][j] !== type) perimeter++;
            else if (!visited[i - 1][j]) q.push({i: i - 1, j});
        } else perimeter++;

        if (i < grid.length - 1) {
            if (grid[i + 1][j] !== type) perimeter++;
            else if (!visited[i + 1][j]) q.push({i: i + 1, j});
        } else perimeter++;

        if (j > 0) {
            if (grid[i][j - 1] !== type) perimeter++;
            else if (!visited[i][j - 1]) q.push({i, j: j - 1});
        } else perimeter++;

        if (j < grid[i].length - 1) {
            if (grid[i][j + 1] !== type) perimeter++;
            else if (!visited[i][j + 1]) q.push({i, j: j + 1});
        } else perimeter++;
    }

    if (test)
        console.log(iStart, jStart, type, area, perimeter, area * perimeter);
    // console.groupEnd();

    return area * perimeter;
};

const solve = grid => {
    const visited = Array.from(Array(grid.length),
        (_, i) => Array(grid[i].length).fill(false));

    let total = 0;
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (!visited[i][j])
                total += calcPrice(grid, visited, i, j);

    return total;
};

const doFile = (filename) => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const grid = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => l.split(''));


    const solution = solve(grid);

    console.timeEnd(filename);
    console.groupEnd();
    console.log(`* Solution: ${solution}\n`);
};

(() => {
    doFile('input-test1.txt');
    doFile('input-test2.txt');
    doFile('input-test3.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
