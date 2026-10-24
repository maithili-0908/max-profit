'use strict';

/**
 * The catalogue of buildings Mr. X is allowed to construct.
 *
 * This is the ONLY place where business data lives. To support a new kind of
 * building, add one more entry here - no algorithm code needs to change.
 *
 *  - code:         letter used in the program output (T, P, C)
 *  - name:         human readable name
 *  - buildTime:    units of time needed to construct one building
 *  - earningsRate: money earned per unit of time once the building is finished
 *
 * Land size (2x1, 1x1, 3x1) and "rooms" (8 auditoriums, ...) are deliberately
 * NOT modelled: land is infinite and earnings are per building, so they never
 * influence the answer.
 */
const BUILDINGS = Object.freeze([
  Object.freeze({ code: 'T', name: 'Theatre', buildTime: 5, earningsRate: 1500 }),
  Object.freeze({ code: 'P', name: 'Pub', buildTime: 4, earningsRate: 1000 }),
  Object.freeze({ code: 'C', name: 'Commercial Park', buildTime: 10, earningsRate: 2000 }),
]);

module.exports = { BUILDINGS };
