# How to Run the Max Profit Project

## 1. What you need

- **Node.js 18 or newer** (download from https://nodejs.org if you don't have it).
- Nothing else. There is no `npm install` step because the project has no dependencies.

Check Node is installed:

```
node --version
```

## 2. Open a terminal in the project folder

```
cd C:\backend\max-profit
```

(In VS Code: open the folder, then press Ctrl + ` to open the terminal.)

## 3. Run the program

Give the time units as a number:

```
node src/index.js 7
```

Output:

```
Earnings: $3000

Solutions
1. T: 1 P: 0 C: 0
2. T: 0 P: 1 C: 0
```

Other examples from the assignment:

| Command                  | Earnings | Solutions                         |
|--------------------------|----------|-----------------------------------|
| `node src/index.js 7`    | $3000    | T:1 P:0 C:0  and  T:0 P:1 C:0     |
| `node src/index.js 8`    | $4500    | T:1 P:0 C:0                       |
| `node src/index.js 13`   | $16500   | T:2 P:0 C:0                       |

Or run it with no number and type it when asked:

```
node src/index.js
Time Unit: 13
```

`npm start` does the same as `node src/index.js` (it asks for the number).

## 4. Windows shortcut

Double-click **run.bat** in this folder. It asks for the time unit, shows the
result, and keeps the window open.

## 5. Run the tests

```
npm test
```

You should see all 13 tests pass.

## 6. Common problems

| Problem | Fix |
|---|---|
| `'node' is not recognized` | Install Node.js, then close and reopen the terminal. |
| `Cannot find module ...` | You are in the wrong folder. Run `cd C:\backend\max-profit` first. |
| `Error: Time units must be a number...` | Type a whole number such as `13` (not letters, decimals or negatives). |

## 7. Changing the rules

All building data (build time and earnings) lives in `src/config/buildings.js`.
Edit a number there, run the program again, and see how the answers change.
