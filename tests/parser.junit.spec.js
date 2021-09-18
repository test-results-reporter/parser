const { parse } = require('../src');
const assert = require('assert');

describe('Parser - JUnit', () => {

  it('single suite with single test', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/single-suite.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      duration: 10000,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'suite name',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 10000,
          status: 'FAIL',
          cases: []
        }
      ]
    });
  });

  it('empty suite with single test', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/empty-suite.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      duration: 10000,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'suite name',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 10000,
          status: 'FAIL',
          cases: []
        }
      ]
    });
  });

  it('suite with skipped tests', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/skipped-tests.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 1,
      duration: 10000,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'suite name',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 10000,
          status: 'PASS',
          cases: []
        }
      ]
    });
  });

  it('multiple suites', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/multiple-suites.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 2,
      passed: 1,
      failed: 1,
      errors: 0,
      skipped: 0,
      duration: 20000,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'suite name 1',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 10000,
          status: 'FAIL',
          cases: []
        },
        {
          id: '',
          name: 'suite name 2',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 10000,
          status: 'PASS',
          cases: []
        }
      ]
    });
  });

});