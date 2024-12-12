import {readFileSync} from 'node:fs';

let test;

const calcPrice = (grid, visited, iStart, jStart) => {
    const type = grid[iStart][jStart];
    const q = [{i: iStart, j: jStart}];
    let area = 0;

    const hasTopBorder = createBoolGrid(grid);
    const hasBottomBorder = createBoolGrid(grid);
    const hasLeftBorder = createBoolGrid(grid);
    const hasRightBorder = createBoolGrid(grid);

    while (q.length > 0) {
        const {i, j} = q.pop();

        // console.log(i, j, grid[i][j], visited[i][j]);

        if (grid[i][j] !== type) continue;
        if (visited[i][j]) continue;

        visited[i][j] = true;
        area++;

        if (i > 0) {
            if (grid[i - 1][j] !== type) hasTopBorder[i][j] = true;
            else if (!visited[i - 1][j]) q.push({i: i - 1, j});
        } else hasTopBorder[i][j] = true;

        if (i < grid.length - 1) {
            if (grid[i + 1][j] !== type) hasBottomBorder[i][j] = true;
            else if (!visited[i + 1][j]) q.push({i: i + 1, j});
        } else hasBottomBorder[i][j] = true;

        if (j > 0) {
            if (grid[i][j - 1] !== type) hasLeftBorder[i][j] = true;
            else if (!visited[i][j - 1]) q.push({i, j: j - 1});
        } else hasLeftBorder[i][j] = true;

        if (j < grid[i].length - 1) {
            if (grid[i][j + 1] !== type) hasRightBorder[i][j] = true;
            else if (!visited[i][j + 1]) q.push({i, j: j + 1});
        } else hasRightBorder[i][j] = true;
    }

    let sides = 0;

    for (let i = 0; i < grid.length; i++) {
        let top = false, bottom = false;
        for (let j = 0; j < grid[i].length; j++) {
            if (!top && hasTopBorder[i][j]) sides++;
            if (!bottom && hasBottomBorder[i][j]) sides++;

            top = hasTopBorder[i][j];
            bottom = hasBottomBorder[i][j];
        }
    }

    for (let j = 0; j < grid[0].length; j++) {
        let left = false, right = false;
        for (let i = 0; i < grid.length; i++) {
            if (!left && hasLeftBorder[i][j]) sides++;
            if (!right && hasRightBorder[i][j]) sides++;

            left = hasLeftBorder[i][j];
            right = hasRightBorder[i][j];
        }
    }

    if (test)
        console.log(iStart, jStart, type, area, sides, area * sides);
    // console.groupEnd();

    return area * sides;
};

const createBoolGrid = grid => {
    return Array.from(Array(grid.length),
        (_, i) => Array(grid[i].length).fill(false));
};

const solve = grid => {
    const visited = createBoolGrid(grid);

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
    doFile('input-test4.txt');
    doFile('input-test5.txt');
    doFile('input.txt');
    console.log(`*** ${new Date().toLocaleTimeString()} *** DONE`);
})();
