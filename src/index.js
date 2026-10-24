#!/usr/bin/env node
'use strict';

const readline = require('node:readline');
const { findMaxProfit } = require('./maxProfit');
const { formatResult } = require('./formatter');

/**
 * Command line entry point.
 *
 *   node src/index.js 13          -> uses the argument
 *   node src/index.js             -> asks you to type the time unit
 */
function run(rawInput) {
  try {
    console.log(formatResult(findMaxProfit(rawInput)));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

function main() {
  const [argument] = process.argv.slice(2);
  if (argument !== undefined) {
    run(argument);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Time Unit: ', (answer) => {
    rl.close();
    run(answer);
  });
}

main();
