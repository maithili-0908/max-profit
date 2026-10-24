'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { findMaxProfit } = require('../src/maxProfit');
const { formatResult } = require('../src/formatter');
const { BUILDINGS } = require('../src/config/buildings');

// ---------- The three test cases from the assignment PDF --------------------

test('Test Case 1: n = 7 -> $3000, two tied solutions', () => {
  const result = findMaxProfit(7);
  assert.equal(result.earnings, 3000);
  assert.deepEqual(result.solutions, [
    { T: 1, P: 0, C: 0 },
    { T: 0, P: 1, C: 0 },
  ]);
});

test('Test Case 2: n = 8 -> $4500, one Theatre', () => {
  const result = findMaxProfit(8);
  assert.equal(result.earnings, 4500);
  assert.deepEqual(result.solutions, [{ T: 1, P: 0, C: 0 }]);
});

test('Test Case 3: n = 13 -> $16500, two Theatres', () => {
  const result = findMaxProfit(13);
  assert.equal(result.earnings, 16500);
  assert.deepEqual(result.solutions, [{ T: 2, P: 0, C: 0 }]);
});

// ---------- Output format ---------------------------------------------------

test('formats output exactly like the assignment', () => {
  assert.equal(
    formatResult(findMaxProfit(7)),
    ['Earnings: $3000', '', 'Solutions', '1. T: 1 P: 0 C: 0', '2. T: 0 P: 1 C: 0'].join('\n'),
  );
});

// ---------- Edge cases ------------------------------------------------------

test('n = 0 earns nothing and builds nothing', () => {
  assert.deepEqual(findMaxProfit(0), { earnings: 0, solutions: [{ T: 0, P: 0, C: 0 }] });
});

test('not enough time for any building (n = 4) earns nothing', () => {
  // A Pub needs 4 units, so it finishes exactly at the deadline -> earns 0.
  assert.deepEqual(findMaxProfit(4), { earnings: 0, solutions: [{ T: 0, P: 0, C: 0 }] });
});

test('n = 5 -> one Pub (finishes at 4, earns 1 unit)', () => {
  assert.deepEqual(findMaxProfit(5), { earnings: 1000, solutions: [{ T: 0, P: 1, C: 0 }] });
});

test('accepts numeric strings (command line input)', () => {
  assert.equal(findMaxProfit('13').earnings, 16500);
});

test('rejects invalid input', () => {
  assert.throws(() => findMaxProfit(-1), RangeError);
  assert.throws(() => findMaxProfit(2.5), RangeError);
  assert.throws(() => findMaxProfit('abc'), TypeError);
  assert.throws(() => findMaxProfit(''), TypeError);
  assert.throws(() => findMaxProfit(undefined), TypeError);
  assert.throws(() => findMaxProfit(NaN), TypeError);
  assert.throws(() => findMaxProfit(Infinity), TypeError);
});

test('rejects a broken building configuration', () => {
  assert.throws(() => findMaxProfit(10, []), TypeError);
  assert.throws(() => findMaxProfit(10, [{ code: 'X', buildTime: 0, earningsRate: 5 }]), RangeError);
  assert.throws(() => findMaxProfit(10, [{ code: 'X', buildTime: 2, earningsRate: -5 }]), RangeError);
});

test('works with a different building catalogue (open for extension)', () => {
  const custom = [{ code: 'S', name: 'Shop', buildTime: 2, earningsRate: 10 }];
  // n = 6: shops finish at 2, 4 -> (6-2)*10 + (6-4)*10 = 60
  assert.deepEqual(findMaxProfit(6, custom), { earnings: 60, solutions: [{ S: 2 }] });
});

test('handles a large input quickly', () => {
  const started = Date.now();
  const result = findMaxProfit(5000);
  assert.ok(result.earnings > 0);
  assert.ok(Date.now() - started < 2000, 'should finish well under 2 seconds');
});

// ---------- Cross-check against an independent brute force ------------------

/**
 * Tries EVERY possible sequence of builds (slow but obviously correct) and
 * returns the max earnings plus the set of distinct count-mixes reaching it.
 */
function bruteForce(n) {
  let bestEarnings = 0;
  let bestMixes = new Set(['0,0,0']);

  function explore(timeUsed, earnings, counts) {
    if (earnings > bestEarnings) {
      bestEarnings = earnings;
      bestMixes = new Set([counts.join(',')]);
    } else if (earnings === bestEarnings) {
      bestMixes.add(counts.join(','));
    }
    BUILDINGS.forEach((b, i) => {
      const finish = timeUsed + b.buildTime;
      if (finish < n) {
        counts[i]++;
        explore(finish, earnings + (n - finish) * b.earningsRate, counts);
        counts[i]--;
      }
    });
  }

  explore(0, 0, [0, 0, 0]);
  return { earnings: bestEarnings, mixes: bestMixes };
}

test('matches the brute force solver for every n from 0 to 45', () => {
  for (let n = 0; n <= 45; n++) {
    const expected = bruteForce(n);
    const actual = findMaxProfit(n);
    const actualMixes = new Set(actual.solutions.map((s) => `${s.T},${s.P},${s.C}`));

    assert.equal(actual.earnings, expected.earnings, `earnings differ for n=${n}`);
    assert.deepEqual(actualMixes, expected.mixes, `solutions differ for n=${n}`);
  }
});
