/**
 * Partial Function Benchmarks for filesize.js
 * 
 * Tests performance of the partial function and compares it with direct calls
 */

import { filesize, partial } from '../dist/filesize.js';

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
    
    if (global.gc) {
        global.gc();
    }
    
    const startTime = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
        testFunction();
    }
    
    const endTime = process.hrtime.bigint();
    const totalTime = Number(endTime - startTime) / 1000000;
    const avgTime = totalTime / iterations;
    const opsPerSecond = Math.round(1000 / avgTime);
    
    return {
        testName,
        iterations,
        totalTime: totalTime.toFixed(2),
        avgTime: avgTime.toFixed(6),
        opsPerSecond,
        relativeSpeed: 1
    };
}

/**
 * Prints benchmark results with comparison analysis
 * @param {Array} results - Array of benchmark results
 */
function printResults(results) {
    console.log('\n📊 Partial Function Benchmark Results');
    console.log('=' .repeat(85));
    console.log('Test Name'.padEnd(30) + 'Ops/sec'.padEnd(15) + 'Avg (ms)'.padEnd(12) + 'vs Direct'.padEnd(12) + 'Notes');
    console.log('-'.repeat(85));
    
    // Find direct call baseline for comparison
    const directBaseline = results.find(r => r.testName.includes('Direct call'));
    
    results.forEach(result => {
        let comparison = '';
        let note = '';
        
        if (directBaseline && result !== directBaseline) {
            const ratio = directBaseline.opsPerSecond / result.opsPerSecond;
            if (ratio > 1) {
                comparison = `${ratio.toFixed(2)}x slower`;
                note = ratio > 2 ? '⚠️  Significant overhead' : '✓ Acceptable overhead';
            } else {
                comparison = `${(1/ratio).toFixed(2)}x faster`;
                note = '🚀 Faster than direct';
            }
        } else if (result === directBaseline) {
            comparison = 'baseline';
            note = '📊 Reference';
        }
        
        console.log(
            result.testName.padEnd(30) +
            result.opsPerSecond.toLocaleString().padEnd(15) +
            result.avgTime.padEnd(12) +
            comparison.padEnd(12) +
            note
        );
    });
    console.log('=' .repeat(85));
}

console.log('🚀 Starting Partial Function Benchmarks...\n');

const testValue = 1073741824; // 1GB
const results = [];

// Baseline: Direct filesize calls
results.push(benchmark(
    'Direct call (baseline)',
    () => filesize(testValue)
));

results.push(benchmark(
    'Direct call w/ options',
    () => filesize(testValue, { round: 2, standard: 'iec' })
));

// Test basic partial functions
const simplePartial = partial();
results.push(benchmark(
    'Simple partial()',
    () => simplePartial(testValue)
));

const partialWithOptions = partial({ round: 2, standard: 'iec' });
results.push(benchmark(
    'Partial w/ options',
    () => partialWithOptions(testValue)
));

// Test various partial configurations
const bitsPartial = partial({ bits: true });
results.push(benchmark(
    'Partial bits=true',
    () => bitsPartial(testValue)
));

const iecPartial = partial({ standard: 'iec', round: 3 });
results.push(benchmark(
    'Partial IEC standard',
    () => iecPartial(testValue)
));

const objectPartial = partial({ output: 'object' });
results.push(benchmark(
    'Partial object output',
    () => objectPartial(testValue)
));

const fullformPartial = partial({ fullform: true, spacer: '_' });
results.push(benchmark(
    'Partial fullform',
    () => fullformPartial(testValue)
));

const localePartial = partial({ locale: 'en-US', round: 1 });
results.push(benchmark(
    'Partial w/ locale',
    () => localePartial(testValue)
));

// Test complex partial configurations
const complexPartial = partial({
    bits: true,
    standard: 'iec',
    round: 3,
    pad: true,
    output: 'object'
});
results.push(benchmark(
    'Complex partial',
    () => complexPartial(testValue)
));

// Test partial creation overhead
results.push(benchmark(
    'Partial creation',
    () => {
        const newPartial = partial({ round: 2 });
        return newPartial(testValue);
    }
));

// Test multiple partial instances
const partials = [
    partial({ round: 0 }),
    partial({ round: 1 }),
    partial({ round: 2 }),
    partial({ round: 3 }),
    partial({ round: 4 })
];

let partialIndex = 0;
results.push(benchmark(
    'Multiple partials',
    () => {
        const p = partials[partialIndex % partials.length];
        partialIndex++;
        return p(testValue);
    }
));

printResults(results);

// Functional programming patterns test
console.log('\n🔧 Functional Programming Patterns:');

const sizes = [1024, 1048576, 1073741824, 1099511627776];
const formatters = [
    partial({ standard: 'iec', round: 1 }),
    partial({ bits: true, round: 2 }),
    partial({ fullform: true }),
    partial({ output: 'object' })
];

console.log('\nTesting map operations:');
const mapStart = process.hrtime.bigint();

// Using partial with map
const formattedSizes = sizes.map(formatters[0]);

const mapEnd = process.hrtime.bigint();
const mapTime = Number(mapEnd - mapStart) / 1000000;

console.log(`  Map with partial: ${mapTime.toFixed(3)}ms`);
console.log(`  Results: ${formattedSizes.join(', ')}`);

// Chain operations test
console.log('\nTesting function chaining:');
const chainStart = process.hrtime.bigint();

const chainResult = sizes
    .filter(size => size > 1024)
    .map(formatters[1])
    .slice(0, 2);

const chainEnd = process.hrtime.bigint();
const chainTime = Number(chainEnd - chainStart) / 1000000;

console.log(`  Chain operations: ${chainTime.toFixed(3)}ms`);
console.log(`  Results: ${chainResult.join(', ')}`);

// Currying comparison
console.log('\nCurrying vs Direct Calls (1000 operations):');

const curryStart = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
    formatters[0](testValue);
}
const curryEnd = process.hrtime.bigint();
const curryTime = Number(curryEnd - curryStart) / 1000000;

const directStart = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
    filesize(testValue, { standard: 'iec', round: 1 });
}
const directEnd = process.hrtime.bigint();
const directTime = Number(directEnd - directStart) / 1000000;

console.log(`  Curried calls: ${curryTime.toFixed(3)}ms`);
console.log(`  Direct calls: ${directTime.toFixed(3)}ms`);
console.log(`  Overhead: ${((curryTime / directTime - 1) * 100).toFixed(1)}%`);

console.log('\n💡 Partial Function Insights:');
console.log('  • Partial functions add minimal overhead for reused configurations');
console.log('  • Creation cost is amortized over multiple uses');
console.log('  • Excellent for functional programming patterns');
console.log('  • Best suited for repeated operations with same options'); 