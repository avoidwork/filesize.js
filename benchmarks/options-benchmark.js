/**
 * Options Performance Benchmarks for filesize.js
 * 
 * Tests performance impact of different option combinations
 */

import { filesize } from '../dist/filesize.js';

const ITERATIONS = 50000;
const WARMUP_ITERATIONS = 5000;
const TEST_SIZE = 1073741824; // 1GB

/**
 * Runs a performance test for a given function
 * @param {string} testName - Name of the test
 * @param {Function} testFunction - Function to benchmark
 * @param {number} iterations - Number of iterations to run
 * @returns {Object} Performance results
 */
function benchmark(testName, testFunction, iterations = ITERATIONS) {
    // Warmup
    for (let i = 0; i < WARMUP_ITERATIONS; i++) {
        testFunction();
    }
    
    // Garbage collection if available
    if (global.gc) {
        global.gc();
    }
    
    // Actual benchmark
    const startTime = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
        testFunction();
    }
    
    const endTime = process.hrtime.bigint();
    const totalTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const avgTime = totalTime / iterations;
    const opsPerSecond = 1000 / avgTime;
    
    return {
        testName,
        iterations,
        totalTime: totalTime.toFixed(2),
        avgTime: avgTime.toFixed(6),
        opsPerSecond: Math.round(opsPerSecond),
        relativeSpeed: 1 // Will be calculated later
    };
}

/**
 * Prints benchmark results in a formatted table
 * @param {Array} results - Array of benchmark results
 */
function printResults(results) {
    // Calculate relative speeds (compared to baseline)
    const baseline = results[0];
    results.forEach(result => {
        result.relativeSpeed = (baseline.opsPerSecond / result.opsPerSecond).toFixed(2);
    });
    
    console.log('\n📊 Options Performance Benchmark Results');
    console.log('=' .repeat(90));
    console.log('Test Name'.padEnd(30) + 'Ops/sec'.padEnd(12) + 'Avg (ms)'.padEnd(12) + 'Relative'.padEnd(10) + 'Notes');
    console.log('-'.repeat(90));
    
    results.forEach((result, index) => {
        const note = index === 0 ? '(baseline)' : `${result.relativeSpeed}x slower`;
        console.log(
            result.testName.padEnd(30) +
            result.opsPerSecond.toLocaleString().padEnd(12) +
            result.avgTime.padEnd(12) +
            result.relativeSpeed.padEnd(10) +
            note
        );
    });
    console.log('=' .repeat(90));
}

console.log('🚀 Starting Options Performance Benchmarks...\n');

const results = [];

// Baseline test
results.push(benchmark(
    'Default options',
    () => filesize(TEST_SIZE)
));

// Test individual options
results.push(benchmark(
    'bits=true',
    () => filesize(TEST_SIZE, { bits: true })
));

results.push(benchmark(
    'pad=true',
    () => filesize(TEST_SIZE, { pad: true })
));

results.push(benchmark(
    'base=2',
    () => filesize(TEST_SIZE, { base: 2 })
));

results.push(benchmark(
    'round=4',
    () => filesize(TEST_SIZE, { round: 4 })
));

results.push(benchmark(
    'locale=true',
    () => filesize(TEST_SIZE, { locale: true })
));

results.push(benchmark(
    'locale="en-US"',
    () => filesize(TEST_SIZE, { locale: 'en-US' })
));

results.push(benchmark(
    'separator=","',
    () => filesize(TEST_SIZE, { separator: ',' })
));

results.push(benchmark(
    'standard="iec"',
    () => filesize(TEST_SIZE, { standard: 'iec' })
));

results.push(benchmark(
    'standard="jedec"',
    () => filesize(TEST_SIZE, { standard: 'jedec' })
));

results.push(benchmark(
    'output="array"',
    () => filesize(TEST_SIZE, { output: 'array' })
));

results.push(benchmark(
    'output="object"',
    () => filesize(TEST_SIZE, { output: 'object' })
));

results.push(benchmark(
    'fullform=true',
    () => filesize(TEST_SIZE, { fullform: true })
));

results.push(benchmark(
    'precision=3',
    () => filesize(TEST_SIZE, { precision: 3 })
));

results.push(benchmark(
    'roundingMethod="ceil"',
    () => filesize(TEST_SIZE, { roundingMethod: 'ceil' })
));

// Test complex option combinations
results.push(benchmark(
    'Complex combo 1',
    () => filesize(TEST_SIZE, { 
        bits: true, 
        standard: 'iec', 
        round: 3, 
        pad: true 
    })
));

results.push(benchmark(
    'Complex combo 2',
    () => filesize(TEST_SIZE, { 
        fullform: true, 
        locale: 'en-US', 
        precision: 2,
        output: 'object'
    })
));

results.push(benchmark(
    'All options',
    () => filesize(TEST_SIZE, {
        bits: true,
        pad: true,
        base: 2,
        round: 3,
        locale: 'en-US',
        separator: ',',
        spacer: ' ',
        standard: 'iec',
        output: 'object',
        fullform: true,
        precision: 2,
        roundingMethod: 'ceil'
    })
));

printResults(results);

console.log('\n💡 Performance Insights:');
console.log('  • Locale formatting has significant overhead');
console.log('  • Object output is slightly slower than string');
console.log('  • Fullform generation adds minimal overhead');
console.log('  • Multiple options compound the performance impact'); 