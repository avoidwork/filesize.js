/**
 * Basic Performance Benchmarks for filesize.js
 * 
 * Tests basic conversion performance with various input sizes
 */

import { filesize } from '../dist/filesize.js';

const ITERATIONS = 100000;
const WARMUP_ITERATIONS = 10000;

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
        opsPerSecond: Math.round(opsPerSecond)
    };
}

/**
 * Prints benchmark results in a formatted table
 * @param {Array} results - Array of benchmark results
 */
function printResults(results) {
    console.log('\n📊 Basic Performance Benchmark Results');
    console.log('=' .repeat(80));
    console.log('Test Name'.padEnd(25) + 'Iterations'.padEnd(12) + 'Total (ms)'.padEnd(12) + 'Avg (ms)'.padEnd(12) + 'Ops/sec');
    console.log('-'.repeat(80));
    
    results.forEach(result => {
        console.log(
            result.testName.padEnd(25) +
            result.iterations.toString().padEnd(12) +
            result.totalTime.padEnd(12) +
            result.avgTime.padEnd(12) +
            result.opsPerSecond.toLocaleString()
        );
    });
    console.log('=' .repeat(80));
}

// Test data sets
const testSizes = [
    0,
    512,
    1024,
    1048576,
    1073741824,
    1099511627776,
    Number.MAX_SAFE_INTEGER
];

const results = [];

// Basic filesize conversion tests
console.log('🚀 Starting Basic Performance Benchmarks...\n');

testSizes.forEach(size => {
    const result = benchmark(
        `filesize(${size})`,
        () => filesize(size)
    );
    results.push(result);
});

// Test with different options
results.push(benchmark(
    'filesize w/ bits=true',
    () => filesize(1048576, { bits: true })
));

results.push(benchmark(
    'filesize w/ standard=IEC',
    () => filesize(1048576, { standard: 'iec' })
));

results.push(benchmark(
    'filesize w/ round=4',
    () => filesize(1048576, { round: 4 })
));

results.push(benchmark(
    'filesize w/ fullform=true',
    () => filesize(1048576, { fullform: true })
));

results.push(benchmark(
    'filesize w/ output=object',
    () => filesize(1048576, { output: 'object' })
));

printResults(results);

// Memory usage estimation
const memUsage = process.memoryUsage();
console.log('\n💾 Memory Usage:');
console.log(`  RSS: ${filesize(memUsage.rss)}`);
console.log(`  Heap Used: ${filesize(memUsage.heapUsed)}`);
console.log(`  Heap Total: ${filesize(memUsage.heapTotal)}`);
console.log(`  External: ${filesize(memUsage.external)}`); 