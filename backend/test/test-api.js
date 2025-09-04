#!/usr/bin/env node

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TIMEOUT = 5000;

// Simple test runner
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log('🧪 Starting Backend API Tests...\n');
    
    for (const test of this.tests) {
      try {
        await test.testFn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

const runner = new TestRunner();

// Helper to GET a path and accept one or more allowed status codes
function httpGetExpect(path, allowedStatuses = [200]) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.get(url, (res) => {
      // consume body to free socket
      res.on('data', () => {});
      res.on('end', () => {
        if (Array.isArray(allowedStatuses) ? allowedStatuses.includes(res.statusCode) : res.statusCode === allowedStatuses) {
          resolve();
        } else {
          reject(new Error(`Unexpected status ${res.statusCode} for ${path}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Tests
runner.addTest('Server is running', () => httpGetExpect('/', [200, 301, 302]));
runner.addTest('Suggestion routes are accessible', () => httpGetExpect('/api/suggestions', [200, 401, 403]));
runner.addTest('Recipe routes are accessible', () => httpGetExpect('/api/recipes', [200, 401, 403]));

// Run tests
if (require.main === module) {
  runner.run();
}

module.exports = { TestRunner, BASE_URL };
