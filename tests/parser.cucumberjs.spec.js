const { parse } = require('../src');
const assert = require('assert');

describe('Parser - CucumberJS Json', () => {
  const testDataPath = "tests/data/cucumberjs"
  it('single suite with single test', () => {
    const result = parse({ type: 'cucumberjs', files: [`${testDataPath}/single-suite-single-test.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 1.59,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 1.59,
          status: 'PASS',
          cases: [
            {
              duration: 1.59,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Addition of two numbers",
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
    const result = parse({ type: 'cucumberjs', files: [`${testDataPath}/empty-suite.json`] });
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

  it('multiple suites', () => {
    const result = parse({ type: 'cucumberjs', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 3.36,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 2,
          passed: 1,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 2.84,
          status: 'FAIL',
          cases: [
            {
              duration: 2.56,
              errors: 0,
              failed: 0,
              failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)",
              id: "",
              name: "Addition of two numbers",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              total: 0
            },
            {
              duration: 0.28,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Addition of two numbers v2",
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
          name: 'Subtraction',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 0.52,
          status: 'PASS',
          cases: [
            {
              duration: 0.52,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Subtraction of two numbers",
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
});
