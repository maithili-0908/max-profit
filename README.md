# Max Profit Problem (JavaScript)

Given `n` units of time, find the maximum money Mr. X can earn by building
Theatres (T), Pubs (P) and Commercial Parks (C) one after another, and list
every mix of buildings that reaches that maximum.

## Rule that makes the examples work

A building that finishes at time `f` earns `(n - f) * earningsRate`.
A building that finishes exactly at `n` earns nothing, so it is never built.

## Run

```bash
node src/index.js 7      # pass n as an argument
node src/index.js        # or type it when asked
npm test                 # run the unit tests (Node 18+, no dependencies)
```

Example:

```
$ node src/index.js 7
Earnings: $3000

Solutions
1. T: 1 P: 0 C: 0
2. T: 0 P: 1 C: 0
```

## Project layout

```
src/
  config/buildings.js   building data (build time, earnings) - the only place to edit rules
  validation.js         checks the input is a whole number >= 0
  maxProfit.js          the algorithm (dynamic programming) - pure function, no I/O
  formatter.js          turns a result into the required text format
  index.js              command line entry point
test/
  maxProfit.test.js     assignment test cases, edge cases, brute-force cross-check
```

## Approach (short version)

`best[r]` = most money earnable when `r` time units are left.
Starting a building with build time `d` and rate `rate` earns `(r - d) * rate`
and leaves `r - d` time, so

```
best[r] = max(0, max over buildings with d < r of (r - d) * rate + best[r - d])
```

The table is filled from `r = 0` up to `n`. Alongside each value we keep every
distinct building mix that reaches it, which gives all tied solutions.

Complexity: O(n * k) time for the values (k = number of building types), plus a
small constant for the tied mixes. n = 100,000 runs in well under a second.
