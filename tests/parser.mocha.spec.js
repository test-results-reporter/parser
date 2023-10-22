const { parse } = require('../src');
const assert = require('assert');

describe('Parser - Mocha Json', () => {
  const testDataPath = "tests/data/mocha/json"
  it('single suite with single test', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 3,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Simple Suite',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 1,
          status: 'PASS',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Simple suite test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('empty suite report', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/empty-suite.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 0,
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 0,
      status: 'PASS',
      suites: []
    });
  });
  it('suite with skipped tests', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/skipped-tests.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 2,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 1,
      retried: 0,
      duration: 3,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Example Suite',
          total: 2,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 1,
          duration: 1,
          status: 'PASS',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "first sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              duration: 0,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "second sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "SKIP",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('multiple suites', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 7,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Example Suite 1',
          total: 2,
          passed: 2,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 4,
          status: 'PASS',
          cases: [
            {
              duration: 3,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Example Suite 2',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 1,
          status: 'FAIL',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "Dummy reason",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
});

describe('Parser - Mocha Awesmome Json', () => {
  const testDataPath = "tests/data/mocha/awesome"
  it('single suite with single test', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 3,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Simple Suite',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 1,
          status: 'PASS',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Simple suite test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('empty suite report', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/empty-suite.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 0,
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 0,
      status: 'PASS',
      suites: []
    });
  });
  it('suite with skipped tests', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/skipped-tests.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 2,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 1,
      retried: 0,
      duration: 3,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Example Suite',
          total: 2,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 1,
          duration: 1,
          status: 'PASS',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "first sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              duration: 0,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "second sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "SKIP",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('multiple suites', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 7,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Example Suite 1',
          total: 2,
          passed: 2,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 4,
          status: 'PASS',
          cases: [
            {
              duration: 3,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Example Suite 2',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 1,
          status: 'FAIL',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "Dummy reason",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('nested suites', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/nested-suites.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 7,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Example Suite 1',
          total: 2,
          passed: 2,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 4,
          status: 'PASS',
          cases: [
            {
              duration: 3,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Example Suite 2',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 1,
          status: 'FAIL',
          cases: [
            {
              duration: 1,
              errors: 0,
              failed: 0,
              failure: "Dummy reason",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });
});