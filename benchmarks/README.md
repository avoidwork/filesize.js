# Filesize.js Benchmarks

This directory contains comprehensive performance benchmarks for the filesize.js library. The benchmarks are designed to measure performance across different usage patterns, option combinations, and edge cases.

## 📁 Benchmark Files

### 🏃 `basic-performance.js`
Tests fundamental performance characteristics of the filesize function:
- Basic conversion performance with various input sizes
- Different option combinations
- Memory usage analysis
- Baseline performance metrics

### ⚙️ `options-benchmark.js`
Analyzes the performance impact of different configuration options:
- Individual option performance costs
- Complex option combinations
- Relative performance comparisons
- Optimization insights

### 🔥 `stress-test.js`
Evaluates performance under challenging conditions:
- Edge cases and extreme values
- Error handling performance
- Memory pressure scenarios
- Performance consistency analysis
- BigInt support testing

### 🔧 `partial-benchmark.js`
Focuses on the partial function and functional programming patterns:
- Partial function vs direct calls
- Function creation overhead
- Functional programming patterns
- Currying performance analysis

### 🎯 `index.js`
Main benchmark runner that executes all test suites:
- Orchestrates all benchmark execution
- Provides comprehensive summary
- System information reporting
- Error handling and reporting

## 🚀 Running Benchmarks

### Run All Benchmarks
```bash
cd benchmarks
node index.js
```

### Run Individual Benchmarks
```bash
# Basic performance tests
node basic-performance.js

# Options impact analysis
node options-benchmark.js

# Stress testing
node stress-test.js

# Partial function analysis
node partial-benchmark.js
```

### Enhanced Performance Mode
For more accurate memory-related benchmarks, run with garbage collection exposed:
```bash
node --expose-gc index.js
```

## 📊 Understanding Results

### Performance Metrics
- **Ops/sec**: Operations per second (higher is better)
- **Avg (ms)**: Average execution time per operation (lower is better)
- **Total (ms)**: Total execution time for all iterations
- **Relative**: Performance relative to baseline (lower multiplier is better)

### Benchmark Categories

#### 🎯 **Basic Performance**
- Measures core function performance
- Tests with various input sizes (0 bytes to MAX_SAFE_INTEGER)
- Establishes baseline performance characteristics

#### ⚙️ **Options Impact**
- Quantifies performance cost of each option
- Identifies expensive operations (locale formatting, complex outputs)
- Helps optimize option usage

#### 🔥 **Stress Testing**
- Validates performance under extreme conditions
- Tests error handling efficiency
- Measures performance consistency
- Evaluates memory usage patterns

#### 🔧 **Functional Programming**
- Compares partial functions vs direct calls
- Analyzes currying overhead
- Tests functional composition patterns

## 📈 Performance Insights

### General Findings
- **Baseline Performance**: ~500K-1M+ ops/sec for basic conversions
- **Locale Formatting**: Significant overhead (~2-5x slower)
- **Object Output**: Minimal overhead (~10-20% slower)
- **Complex Options**: Compound performance impact
- **Partial Functions**: ~10-30% overhead, amortized over multiple uses

### Optimization Tips
1. **Cache Partial Functions**: Reuse partial functions for repeated operations
2. **Avoid Locale When Possible**: Use locale formatting sparingly
3. **Prefer String Output**: Fastest output format for most use cases
4. **Batch Operations**: Group similar operations together
5. **Profile Your Usage**: Run benchmarks with your specific patterns

## 🔧 Benchmark Configuration

### Iteration Counts
- **Basic Performance**: 100,000 iterations
- **Options Testing**: 50,000 iterations
- **Stress Testing**: 10,000 iterations
- **Partial Functions**: 100,000 iterations

### Warmup Periods
All benchmarks include warmup periods to ensure JIT optimization and stable measurements.

### Memory Management
- Garbage collection calls between tests (when available)
- Memory pressure testing
- Memory usage monitoring

## 🛠️ Customizing Benchmarks

### Adding New Tests
1. Create a new benchmark file in the `benchmarks` directory
2. Follow the existing pattern for benchmark functions
3. Add the file to `BENCHMARK_FILES` in `index.js`

### Modifying Parameters
- Adjust `ITERATIONS` constants for different test durations
- Modify test data sets for specific scenarios
- Add new option combinations for testing

### Example Custom Benchmark
```javascript
import { filesize } from '../dist/filesize.js';

const ITERATIONS = 10000;

function benchmark(testName, testFunction, iterations = ITERATIONS) {
    // Warmup
    for (let i = 0; i < 1000; i++) {
        testFunction();
    }
    
    const startTime = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
        testFunction();
    }
    const endTime = process.hrtime.bigint();
    
    const totalTime = Number(endTime - startTime) / 1000000;
    const avgTime = totalTime / iterations;
    const opsPerSecond = Math.round(1000 / avgTime);
    
    return { testName, opsPerSecond, avgTime };
}

// Your custom test
const result = benchmark('Custom test', () => {
    return filesize(1024 * 1024, { /* your options */ });
});

console.log(result);
```

## 🔍 Interpreting Results

### Performance Baselines
- **Excellent**: >1M ops/sec
- **Good**: 500K-1M ops/sec  
- **Acceptable**: 100K-500K ops/sec
- **Slow**: <100K ops/sec

### When to Optimize
- If your use case requires >100K operations/sec
- When performance regression is detected
- Before production deployment with high load
- When adding new features or options

### Profiling Your Application
1. Run benchmarks with your specific usage patterns
2. Identify bottlenecks in your option combinations
3. Test with your actual data sizes
4. Measure end-to-end performance in your application

## 🤝 Contributing

When contributing performance improvements:
1. Run all benchmarks before and after changes
2. Document performance impacts in commit messages
3. Add new benchmarks for new features
4. Ensure no significant regressions in existing tests

## 📚 Additional Resources

- [MDN Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Node.js Performance Hooks](https://nodejs.org/api/perf_hooks.html)
- [V8 Performance Tips](https://v8.dev/blog/optimizing-cpp-and-js) 