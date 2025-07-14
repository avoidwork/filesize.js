#!/usr/bin/env node

/**
 * Benchmark Runner for filesize.js
 * 
 * Runs all benchmark suites and provides comprehensive performance analysis
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cpus, totalmem, freemem } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BENCHMARK_FILES = [
    'basic-performance.js',
    'options-benchmark.js',
    'stress-test.js',
    'partial-benchmark.js'
];

/**
 * Runs a single benchmark file
 * @param {string} filename - Name of the benchmark file
 * @returns {Promise<Object>} Benchmark execution results
 */
function runBenchmark(filename) {
    return new Promise((resolve, reject) => {
        const filepath = join(__dirname, filename);
        const startTime = Date.now();
        
        console.log(`\n🏃 Running ${filename}...`);
        console.log('='.repeat(60));
        
        const child = spawn('node', [filepath], {
            stdio: 'inherit',
            cwd: __dirname
        });
        
        child.on('close', (code) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (code === 0) {
                resolve({
                    filename,
                    success: true,
                    duration,
                    code
                });
            } else {
                reject({
                    filename,
                    success: false,
                    duration,
                    code,
                    error: `Process exited with code ${code}`
                });
            }
        });
        
        child.on('error', (error) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            reject({
                filename,
                success: false,
                duration,
                error: error.message
            });
        });
    });
}

/**
 * Prints a summary of all benchmark results
 * @param {Array} results - Array of benchmark results
 */
function printSummary(results) {
    const totalDuration = results.reduce((sum, result) => sum + result.duration, 0);
    const successCount = results.filter(result => result.success).length;
    
    console.log('\n' + '='.repeat(80));
    console.log('📋 BENCHMARK SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`Total benchmarks: ${results.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${results.length - successCount}`);
    console.log(`Total execution time: ${(totalDuration / 1000).toFixed(2)}s`);
    
    console.log('\nIndividual Results:');
    console.log('-'.repeat(50));
    
    results.forEach(result => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        const duration = `${(result.duration / 1000).toFixed(2)}s`;
        
        console.log(`${status} ${result.filename.padEnd(25)} ${duration}`);
        
        if (!result.success) {
            console.log(`     Error: ${result.error}`);
        }
    });
    
    if (successCount === results.length) {
        console.log('\n🎉 All benchmarks completed successfully!');
    } else {
        console.log(`\n⚠️  ${results.length - successCount} benchmark(s) failed.`);
    }
    
    console.log('='.repeat(80));
}

/**
 * Prints system information relevant to benchmarks
 */
function printSystemInfo() {
    console.log('🔧 SYSTEM INFORMATION');
    console.log('='.repeat(50));
    console.log(`Node.js version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Architecture: ${process.arch}`);
    console.log(`CPU cores: ${cpus().length}`);
    console.log(`Total memory: ${(totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`Free memory: ${(freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    
    // Check if garbage collection is available
    const gcAvailable = typeof global.gc === 'function';
    console.log(`GC available: ${gcAvailable ? 'Yes' : 'No'}`);
    
    if (!gcAvailable) {
        console.log('💡 Tip: Run with --expose-gc for more accurate memory benchmarks');
    }
    
    console.log('='.repeat(50));
}

/**
 * Main execution function
 */
async function main() {
    console.log('🚀 FILESIZE.JS BENCHMARK SUITE');
    console.log('Starting comprehensive performance analysis...\n');
    
    printSystemInfo();
    
    const results = [];
    const overallStartTime = Date.now();
    
    for (const filename of BENCHMARK_FILES) {
        try {
            const result = await runBenchmark(filename);
            results.push(result);
        } catch (error) {
            results.push(error);
            console.error(`\n❌ Failed to run ${filename}: ${error.error}`);
        }
        
        // Small delay between benchmarks to let system stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const overallEndTime = Date.now();
    const overallDuration = overallEndTime - overallStartTime;
    
    printSummary(results);
    
    console.log(`\n⏱️  Total benchmark suite execution time: ${(overallDuration / 1000).toFixed(2)}s`);
    
    // Exit with appropriate code
    const hasFailures = results.some(result => !result.success);
    process.exit(hasFailures ? 1 : 0);
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Run the main function
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
}); 