const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - Cucumber Json', () => {

  const testDataPath = "tests/data/cucumber"

  it('single suite with single test', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/single-suite-single-test.json`] });
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
      tags: [],
      meta_data: {},
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
          tags: ["@blue", "@slow"],
          meta_data: { suite: "1234" },
          cases: [
            {
              attachments: [],
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
              tags: ["@green", "@fast"],
              meta_data: { testCase: "1234" },
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('empty suite report', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/empty-suite.json`] });
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
      tags: [],
      meta_data: {},
      suites: []
    });
  });

  it('multiple suites', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
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
      tags: [],
      meta_data: {},
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
          tags: [],
          meta_data: {},
          cases: [
            {
              attachments: [],
              duration: 2.56,
              errors: 0,
              failed: 0,
              failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
              id: "",
              name: "Addition of two numbers",
              passed: 0,
              skipped: 0,
              stack_trace: "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)",
              status: "FAIL",
              tags: [],
              meta_data: {},
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              tags: [],
              meta_data: {},
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
          tags: [],
          meta_data: {},
          cases: [
            {
              attachments: [],
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
              tags: [],
              meta_data: {},
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/multiple-suites-multiple-tests.json`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'cucumber', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'cucumber', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  function newMap(obj) {
    let map = new Map();
    for (const property in obj) {
      map.set(property, obj[property]);
    }
    return map;
  }
});

