## Automated Tests

All tests are in /tests/auditEngine.test.ts
Run with: npm test

## Test Coverage

### Test 1
File: tests/auditEngine.test.ts
What it covers: Detects team plan used by single 
user and recommends individual plan instead
How to run: npm test

### Test 2
File: tests/auditEngine.test.ts
What it covers: Detects when user is paying more 
than the listed plan price and calculates savings
How to run: npm test

### Test 3
File: tests/auditEngine.test.ts
What it covers: Returns optimal severity and zero 
savings when user is already on the correct plan
How to run: npm test

### Test 4
File: tests/auditEngine.test.ts
What it covers: Suggests Windsurf as cheaper 
alternative for coding use case on expensive 
Cursor Teams plan
How to run: npm test

### Test 5
File: tests/auditEngine.test.ts
What it covers: getTotalSavings correctly sums 
monthly savings across multiple tools and 
annual savings equals monthly times 12
How to run: npm test

## How to run all tests locally:
npm test

## How CI runs tests:
GitHub Actions runs npm test on every push to main.
See .github/workflows/ci.yml
CI must show green before any PR is merged.
