const { parse } = require('../src');
const assert = require('assert');

describe('Parser - TestNG', () => {

  it('single suite with single test', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/single-suite.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'Default suite',
      total: 4,
      passed: 4,
      failed: 0,
      errors: 0,
      skipped: 0,
      duration: 2000,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Default test',
          total: 4,
          passed: 4,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 2000,
          status: 'NA',
          cases: []
        }
      ]
    })
  });

  it('single suite with multiple tests', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/single-suite-multiple-tests.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'Regression Tests',
      total: 20,
      passed: 8,
      failed: 11,
      errors: 0,
      skipped: 0,
      duration: 1403931,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'desktop-chrome',
          total: 5,
          passed: 2,
          failed: 3,
          errors: 0,
          skipped: 0,
          duration: 202082,
          status: 'NA',
          cases: []
        },
        {
          id: '',
          name: 'mobile-ios',
          total: 5,
          passed: 2,
          failed: 2,
          errors: 0,
          skipped: 0,
          duration: 545598,
          status: 'NA',
          cases: []
        }
      ]
    })
  });

  it('multiple suites with single test', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/multiple-suites-single-test.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'Default suite',
      total: 4,
      passed: 4,
      failed: 0,
      errors: 0,
      skipped: 0,
      duration: 2000,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Default test',
          total: 4,
          passed: 4,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 2000,
          status: 'NA',
          cases: []
        }
      ]
    })
  });

  it('multiple suites with multiple tests', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/multiple-suites-multiple-tests.xml'] });
    assert.deepEqual(result, {
      id: '',
      name: 'Default suite 1',
      total: 8,
      passed: 8,
      failed: 0,
      errors: 0,
      skipped: 0,
      duration: 4000,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Default suite 1',
          total: 4,
          passed: 4,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 2000,
          status: 'NA',
          cases: []
        },
        {
          id: '',
          name: 'Default suite',
          total: 4,
          passed: 4,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 2000,
          status: 'NA',
          cases: []
        }
      ]
    })
  });

});