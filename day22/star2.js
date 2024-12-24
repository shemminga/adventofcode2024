import {readFileSync} from 'node:fs';

let test;

const PRUNER = 16777216;
const cache = new Array(PRUNER).fill(-1);
const priceCache = new Array(PRUNER).fill(null);

const calcNext = cur => {
    cur = (((cur * 64) ^ cur) >>> 0) % PRUNER;
    cur = ((Math.floor(cur / 32) ^ cur) >>> 0) % PRUNER;
    cur = (((cur * 2048) ^ cur) >>> 0) % PRUNER;
    return cur;
};

const getNext = cur => {
    if (cache[cur] < 0) cache[cur] = calcNext(cur);
    return cache[cur];
};

const getPrices = nr => {
    if (priceCache[nr]) return priceCache[nr];
    throw new Error(`Missing prices for ${nr}`);
};

const calcPrices = (nr, seqProfits) => {
    let cur = nr;
    const prices = [];
    const foundSets = new Set();
    for (let i = 0; i < 2000; i++) {
        cur = getNext(cur);
        const price = cur % 10;
        prices.push(price);

        if (i >= 4) {
            const seq = [
                prices[i - 3] - prices[i - 4],
                prices[i - 2] - prices[i - 3],
                prices[i - 1] - prices[i - 2],
                prices[i    ] - prices[i - 1]
            ].join(',');

            if (!foundSets.has(seq)) {
                foundSets.add(seq);
                const oldProfits = seqProfits.has(seq) ? seqProfits.get(seq) : 0;
                seqProfits.set(seq, oldProfits + price);
            }
        }
    }

    priceCache[nr] = prices;
    return prices;
};

const priceForSeq = (nr, seq) => {
    const prices = getPrices(nr);

    let runSeq = [];
    for (let i = 1; i < 2000; i++) {
        runSeq.push(prices[i] - prices[i - 1]);
        if (runSeq.length > 4) runSeq.shift();
        if (runSeq.length === 4 &&
            seq[0] === runSeq[0] &&
            seq[1] === runSeq[1] &&
            seq[2] === runSeq[2] &&
            seq[3] === runSeq[3]) return prices[i];
    }

    // No sale
    return 0;
};

const solve = numbers => {
    const seqProfits = new Map();
    numbers.forEach(nr => calcPrices(nr, seqProfits));

    let maxProfits = 0, maxSeq = null;
    for (const [seq, profits] of seqProfits) {
        if (profits > maxProfits) {
            maxProfits = profits;
            maxSeq = seq;
        }
    }

    if (test) {
        // Show details
        const seq = maxSeq.split(',').map(nr => +nr);
        numbers.forEach(nr => console.log(`${nr}: ${maxSeq} => ${priceForSeq(nr, seq)}`));
    }

    console.log(`Best seq => ${maxSeq} for profits ${maxProfits}`);

    return maxProfits;
};

const doFile = filename => {
    console.group(`*** ${new Date().toLocaleTimeString()} *** input file: ${filename} ***`);
    console.time(filename);
    test = filename.includes('test');

    const numbers = readFileSync(filename, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l)
        .map(l => +l);

    const solution = solve(numbers);

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
