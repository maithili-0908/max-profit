'use strict';

/**
 * Makes sure the time input is something the algorithm can work with.
 * Accepts numbers and numeric strings (e.g. "13" typed on the command line).
 *
 * @param {number|string} input
 * @returns {number} the validated time as a non-negative integer
 * @throws {TypeError|RangeError} when the input is not a whole number >= 0
 */
function parseTimeUnits(input) {
  if (typeof input === 'string' && input.trim() === '') {
    throw new TypeError('Time units is required. Example: 13');
  }

  const value = typeof input === 'string' ? Number(input) : input;

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Time units must be a number, received: ${String(input)}`);
  }
  if (!Number.isInteger(value)) {
    throw new RangeError(`Time units must be a whole number, received: ${value}`);
  }
  if (value < 0) {
    throw new RangeError(`Time units cannot be negative, received: ${value}`);
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Time units is too large, received: ${value}`);
  }

  return value;
}

module.exports = { parseTimeUnits };
