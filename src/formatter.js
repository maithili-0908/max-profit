'use strict';

const { BUILDINGS } = require('./config/buildings');

/**
 * Renders a result in the exact format required by the assignment:
 *
 *   Earnings: $3000
 *
 *   Solutions
 *   1. T: 1 P: 0 C: 0
 *   2. T: 0 P: 1 C: 0
 *
 * @param {{earnings: number, solutions: Object<string, number>[]}} result
 * @param {ReadonlyArray<{code: string}>} [buildings=BUILDINGS]
 * @returns {string}
 */
function formatResult(result, buildings = BUILDINGS) {
  const lines = result.solutions.map((solution, index) => {
    const parts = buildings.map(({ code }) => `${code}: ${solution[code]}`);
    return `${index + 1}. ${parts.join(' ')}`;
  });

  return [`Earnings: $${result.earnings}`, '', 'Solutions', ...lines].join('\n');
}

module.exports = { formatResult };
