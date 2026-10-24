'use strict';

const { BUILDINGS } = require('./config/buildings');
const { parseTimeUnits } = require('./validation');

/**
 * @typedef {Object} Building
 * @property {string} code
 * @property {string} name
 * @property {number} buildTime
 * @property {number} earningsRate
 */

/**
 * @typedef {Object} Solution
 * @property {Object<string, number>} counts  e.g. { T: 2, P: 0, C: 0 }
 */

/**
 * @typedef {Object} Result
 * @property {number} earnings   the maximum money that can be earned
 * @property {Object<string, number>[]} solutions  every mix of buildings that
 *           reaches that maximum (each one is a map: building code -> count)
 */

/**
 * Finds the maximum earnings for `timeUnits` units of time and EVERY mix of
 * buildings that achieves it.
 *
 * ---- The idea --------------------------------------------------------------
 * Buildings are built one after another (never in parallel). Look at the time
 * that is still LEFT before the deadline `n`:
 *
 *   remaining = how many time units are left when we start the next building.
 *
 * If we start a building that needs `d` units and earns `rate` per unit, it is
 * finished when `remaining - d` units are left, so it earns
 *
 *        (remaining - d) * rate
 *
 * and afterwards we face the exact same question with `remaining - d` time.
 * This gives the recurrence (dynamic programming):
 *
 *   best[r] = max( 0,  max over buildings with d < r of
 *                         (r - d) * rate + best[r - d] )
 *
 * Only `d < r` is allowed: a building that finishes exactly at the deadline
 * earns nothing, so it is never worth building.
 *
 * We fill best[0], best[1], ... best[n] bottom-up, so every sub-answer is
 * computed exactly once. Along the way we remember, for each `r`, all the
 * building-count mixes that reach best[r] (this is what lets us print ties,
 * like "1 Theatre OR 1 Pub" for n = 7).
 *
 * Time complexity : O(n * k * s)  (k = building types, s = ties per step, tiny)
 * Space complexity: O(n * s)
 *
 * @param {number|string} timeUnits  non-negative whole number
 * @param {ReadonlyArray<Building>} [buildings=BUILDINGS]
 * @returns {Result}
 */
function findMaxProfit(timeUnits, buildings = BUILDINGS) {
  const n = parseTimeUnits(timeUnits);
  assertValidBuildings(buildings);

  const emptyMix = () => new Array(buildings.length).fill(0);

  // best[r]      -> max earnings when `r` time units are left
  // mixes[r]     -> every distinct count-vector reaching best[r]
  const best = new Array(n + 1).fill(0);
  const mixes = new Array(n + 1);
  mixes[0] = [emptyMix()];

  for (let remaining = 1; remaining <= n; remaining++) {
    let bestHere = 0;
    let mixesHere = new Map([[emptyMix().join(','), emptyMix()]]); // "build nothing"

    buildings.forEach((building, index) => {
      const left = remaining - building.buildTime;
      if (left <= 0) return; // does not fit, or finishes with zero time to earn

      const profit = left * building.earningsRate + best[left];

      if (profit > bestHere) {
        bestHere = profit;
        mixesHere = new Map();
      }
      if (profit === bestHere) {
        for (const previous of mixes[left]) {
          const next = previous.slice();
          next[index] += 1;
          mixesHere.set(next.join(','), next);
        }
      }
    });

    best[remaining] = bestHere;
    mixes[remaining] = [...mixesHere.values()];
  }

  return {
    earnings: best[n],
    solutions: mixes[n]
      .map((counts) => toCountMap(counts, buildings))
      .sort(compareSolutions(buildings)),
  };
}

/** Turns [2, 0, 0] into { T: 2, P: 0, C: 0 }. */
function toCountMap(counts, buildings) {
  const map = {};
  buildings.forEach((building, index) => {
    map[building.code] = counts[index];
  });
  return map;
}

/** Stable, readable ordering: more Theatres first, then more Pubs, ... */
function compareSolutions(buildings) {
  return (a, b) => {
    for (const { code } of buildings) {
      if (a[code] !== b[code]) return b[code] - a[code];
    }
    return 0;
  };
}

/** Defensive check so a bad config fails loudly instead of looping/NaN-ing. */
function assertValidBuildings(buildings) {
  if (!Array.isArray(buildings) || buildings.length === 0) {
    throw new TypeError('buildings must be a non-empty array');
  }
  const codes = new Set();
  for (const b of buildings) {
    if (!Number.isInteger(b.buildTime) || b.buildTime <= 0) {
      throw new RangeError(`buildTime for "${b.code}" must be a positive integer`);
    }
    if (typeof b.earningsRate !== 'number' || b.earningsRate <= 0) {
      throw new RangeError(`earningsRate for "${b.code}" must be a positive number`);
    }
    if (codes.has(b.code)) {
      throw new RangeError(`duplicate building code "${b.code}"`);
    }
    codes.add(b.code);
  }
}

module.exports = { findMaxProfit };
