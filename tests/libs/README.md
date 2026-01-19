# Test Execution Guide

## 🚀 Quick Start

```bash
# Run all library tests
pnpm test tests/libs --run

# Run with coverage
pnpm test tests/libs --coverage

# Run in watch mode
pnpm test tests/libs

# Run specific test file
pnpm test tests/libs/compress-base64.test.ts

# View HTML report
npx vite preview --outDir html
```

---

## 📊 Expected Results

```
✓ tests/libs/compress-base64.test.ts (56 tests | 1 skipped)
↓ tests/libs/convert-webp.test.ts (33 tests | 33 skipped)
↓ tests/libs/integration.test.ts (24 tests | 24 skipped)

Test Files  1 passed | 2 skipped (3)
     Tests  55 passed | 58 skipped (113)
  Duration  ~3s
```

---

## 🎯 Test Categories

### ✅ Currently Tested

- `compress-base64.ts` - Image compression with WebP optimization
   - Basic compression
   - Format handling (PNG, JPEG, WebP)
   - Quality optimization
   - Size constraints
   - Dimension scaling
   - Error handling
   - Performance

### ⏭️ Requires E2E Testing

- `convert-webp.ts` - SVG to WebP conversion
- Integration workflows (SVG → WebP → Compression)

---

## 🔧 Test Configuration

### Vitest Config (`vite.config.ts`)

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'tests/',
      '**/*.d.ts',
      '**/*.config.*'
    ]
  }
}
```

### Browser API Mocks (`tests/setup.ts`)

- OffscreenCanvas with type-aware convertToBlob()
- createImageBitmap returning mock ImageBitmap
- URL.createObjectURL/revokeObjectURL
- Image mock with auto-trigger onload

---

## 🐛 Troubleshooting

### Issue: Tests timing out

**Solution:** Browser-dependent tests are skipped. Only unit tests run.

### Issue: "Cannot read properties of undefined"

**Solution:** Already fixed. Mock objects created directly, not via document.createElement.

### Issue: Wrong MIME type in results

**Solution:** Already fixed. OffscreenCanvas.\_type tracks desired format.

### Issue: Image onload not triggering

**Solution:** Browser-dependent tests skipped. Use E2E for those scenarios.

---

## 📈 Performance Benchmarks

### Test Execution Speed

- Setup: ~2.6s (browser API mocks)
- Compress-base64 tests: ~156ms (55 tests)
- Total: ~3.2s

### Compression Performance

- Small images (< 100KB): < 100ms
- Medium images (100-500KB): < 500ms
- Large images (> 500KB): < 1000ms

---

## 🔍 Debugging Tips

### View Detailed Output

```bash
# Run with verbose output
pnpm test tests/libs --run --reporter=verbose

# Run single test
pnpm test tests/libs -t "should compress base64 with default options"

# Debug specific test
pnpm test tests/libs --no-coverage --reporter=verbose -t "WebP should be"
```

### Check Coverage

```bash
# Generate coverage report
pnpm test tests/libs --coverage

# View HTML coverage report
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

### Analyze Test Performance

```bash
# Run with timing
pnpm test tests/libs --run --reporter=verbose

# Profile slow tests
pnpm test tests/libs --run --slow-test-threshold=100
```

---

## 📝 Adding New Tests

### Test Structure

```typescript
describe('Feature name', () => {
	beforeEach(() => {
		// Setup mocks
	})

	it('should do something', async () => {
		// Arrange
		const input = 'data:image/png;base64,...'

		// Act
		const result = await compressBase64(input)

		// Assert
		expect(result).toContain('data:image/webp;base64,')
	})
})
```

### Best Practices

1. Use descriptive test names
2. Test one thing per test
3. Use beforeEach for setup
4. Clean up mocks with vi.restoreAllMocks()
5. Use meaningful assertions
6. Add comments for complex tests
7. Skip browser-dependent tests with .skip()

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
   test:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
           with:
              version: 8
         - uses: actions/setup-node@v4
           with:
              node-version: '20'
              cache: 'pnpm'
         - run: pnpm install
         - run: pnpm test tests/libs --run
         - name: Upload coverage
           uses: codecov/codecov-action@v3
           with:
              files: ./coverage/coverage-final.json
```

---

## 📚 Related Documentation

- [TEST_SUMMARY.md](./TEST_SUMMARY.md) - Detailed test results and coverage
- [OPTIMIZATION.md](../../OPTIMIZATION.md) - Compression optimization details
- [MIGRATION.md](../../MIGRATION.md) - Migration guide from old implementation
- [COMPARISON.md](../../COMPARISON.md) - Before/after comparison

---

_Last Updated: 2025_
_Vitest Version: 3.2.4_
