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
      metadata: {},
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
          metadata: { suite: "1234" },
          cases: [
            {
              attachments: [],
              duration: 1.59,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Addition of two numbers",
              passed: 3,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: ["@green", "@fast", "@blue", "@slow"],
              metadata: { "suite": "1234", testCase: "1234" },
              steps: [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 0.24,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                }
              ],
              total: 3
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
      metadata: {},
      suites: []
    });
  });

  it('multiple suites', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    assert.deepEqual(result, {
      id: "",
      name: "",
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 3.37,
      status: "FAIL",
      tags: [],
      metadata: {},
      suites: [
        {
          id: "",
          name: "Addition",
          total: 2,
          passed: 1,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 2.85,
          status: "FAIL",
          tags: [],
          metadata: {},
          cases: [
            {
              id: "",
              name: "Addition of two numbers",
              total: 3,
              passed: 2,
              failed: 1,
              errors: 0,
              skipped: 0,
              duration: 2.56,
              status: "FAIL",
              failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
              stack_trace: "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)",
              tags: [],
              metadata: {},
              steps: [
                {
                  id: "",
                  name: "Given I have number 6 in calculator",
                  duration: 1.1,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "When I add number 7",
                  duration: 0.13,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "Then I should see result 14",
                  duration: 1.33,
                  status: "FAIL",
                  failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
                  stack_trace: "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)"
                }
              ],
              attachments: []
            },
            {
              id: "",
              name: "Addition of two numbers v2",
              total: 3,
              passed: 3,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0.29,
              status: "PASS",
              failure: "",
              stack_trace: "",
              tags: [],
              metadata: {},
              steps: [
                {
                  id: "",
                  name: "Given I have number 6 in calculator",
                  duration: 0.11,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "When I add number 7",
                  duration: 0.1,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "Then I should see result 13",
                  duration: 0.08,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                }
              ],
              attachments: []
            }
          ]
        },
        {
          id: "",
          name: "Subtraction",
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 0.52,
          status: "PASS",
          tags: [],
          metadata: {},
          cases: [
            {
              id: "",
              name: "Subtraction of two numbers",
              total: 3,
              passed: 3,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0.52,
              status: "PASS",
              failure: "",
              stack_trace: "",
              tags: [],
              metadata: {},
              steps: [
                {
                  id: "",
                  name: "Given I have number 10 in calculator",
                  duration: 0.08,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "When I subtract number 7",
                  duration: 0.13,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                },
                {
                  id: "",
                  name: "Then I should see result 3",
                  duration: 0.31,
                  status: "PASS",
                  failure: "",
                  stack_trace: ""
                }
              ],
              attachments: []
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

  it('test with before and after', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-before-and-after.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 1.75,
      status: 'PASS',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 1.75,
          status: 'PASS',
          tags: ["@blue", "@slow"],
          metadata: { suite: "1234" },
          cases: [
            {
              attachments: [],
              duration: 1.75,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Addition of two numbers",
              passed: 5,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: ["@green", "@fast", "@blue", "@slow"],
              metadata: { "suite": "1234", testCase: "1234" },
              steps: [
                {
                  "id": "",
                  "name": "Before ",
                  "duration": 0.06,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 0.24,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "After ",
                  "duration": 0.1,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
              ],
              total: 5
            }
          ]
        }
      ]
    });
  });

  it('test with skipped steps', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-skipped-steps.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 2.68,
      status: 'FAIL',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 2.68,
          status: 'FAIL',
          tags: ["@blue", "@slow"],
          metadata: { suite: "1234" },
          cases: [
            {
              attachments: [],
              duration: 2.68,
              errors: 0,
              failed: 1,
              failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
              id: "",
              name: "Addition of two numbers",
              passed: 2,
              skipped: 1,
              stack_trace: "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)",
              status: "FAIL",
              tags: ["@green", "@fast", "@blue", "@slow"],
              metadata: { "suite": "1234", testCase: "1234" },
              steps: [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 1.33,
                  "status": "FAIL",
                  "failure": "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
                  "stack_trace": "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)"
                },
                {
                  "duration": 0,
                  "failure": "",
                  "id": "",
                  "name": "And I close the test",
                  "stack_trace": "",
                  "status": "SKIP"
                }
              ],
              total: 4
            }
          ]
        }
      ]
    });
  });

  it('test with metadata', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/suites-with-metadata.json`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "",
      "total": 2,
      "passed": 2,
      "failed": 0,
      "errors": 0,
      "skipped": 0,
      "retried": 0,
      "duration": 3.18,
      "status": "PASS",
      "tags": [],
      "metadata": {},
      "suites": [
        {
          "id": "",
          "name": "Addition",
          "total": 1,
          "passed": 1,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 1.59,
          "status": "PASS",
          "tags": [
            "@blue",
            "@slow"
          ],
          "metadata": {
            "suite": "1234",
            "browser": {
              "name": "firefox",
              "version": "129.0"
            },
            "device": "Desktop",
            "platform": {
              "name": "Windows",
              "version": "11"
            }
          },
          "cases": [
            {
              "id": "",
              "name": "Addition of two numbers",
              "total": 3,
              "passed": 3,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 1.59,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "tags": [
                "@green",
                "@fast",
                "@blue",
                "@slow"
              ],
              "metadata": {
                "testCase": "1234",
                "suite": "1234",
                "browser": {
                  "name": "firefox",
                  "version": "129.0"
                },
                "device": "Desktop",
                "platform": {
                  "name": "Windows",
                  "version": "11"
                }
              },
              "steps": [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 0.24,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                }
              ],
              "attachments": []
            }
          ]
        },
        {
          "id": "",
          "name": "Addition",
          "total": 1,
          "passed": 1,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 1.59,
          "status": "PASS",
          "tags": [
            "@blue",
            "@slow"
          ],
          "metadata": {
            "suite": "1234",
            "browser": {
              "name": "chrome",
              "version": "129.0"
            },
            "device": "Desktop",
            "platform": {
              "name": "Windows",
              "version": "11"
            }
          },
          "cases": [
            {
              "id": "",
              "name": "Addition of two numbers",
              "total": 3,
              "passed": 3,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 1.59,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "tags": [
                "@green",
                "@fast",
                "@blue",
                "@slow"
              ],
              "metadata": {
                "testCase": "1234",
                "suite": "1234",
                "browser": {
                  "name": "chrome",
                  "version": "129.0"
                },
                "device": "Desktop",
                "platform": {
                  "name": "Windows",
                  "version": "11"
                }
              },
              "steps": [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 0.24,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                }
              ],
              "attachments": []
            }
          ]
        }
      ]
    });
  });

  it('test with attachments', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-attachments.json`] });
    assert.equal(result.suites[0].cases[0].attachments.length, 3);
    assert.equal(result.suites[0].cases[0].attachments[0].name, 'screenshot.png');
    assert.equal(result.suites[0].cases[0].attachments[0].path, 'tests/data/attachments/screenshot.png');
    assert.match(result.suites[0].cases[0].attachments[1].name, /I_should_see_result_13-\d+.png/);
    assert.match(result.suites[0].cases[0].attachments[1].path, /\.testbeats\/attachments\/I_should_see_result_13-\d+.png/);
    assert.match(result.suites[0].cases[0].attachments[2].name, /I_should_see_result_13-\d+.json/);
    assert.match(result.suites[0].cases[0].attachments[2].path, /\.testbeats\/attachments\/I_should_see_result_13-\d+.json/);
  });

  it('test with invalid attachments', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-invalid-attachments.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 2.68,
      status: 'FAIL',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 2.68,
          status: 'FAIL',
          tags: ["@blue", "@slow"],
          metadata: { suite: "1234" },
          cases: [
            {
              attachments: [
                {
                  name: 'screenshot.png',
                  path: 'tests/data/attachments/screenshot.png'
                }
              ],
              duration: 2.68,
              errors: 0,
              failed: 1,
              failure: "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
              id: "",
              name: "Addition of two numbers",
              passed: 2,
              skipped: 1,
              stack_trace: "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)",
              status: "FAIL",
              tags: ["@green", "@fast", "@blue", "@slow"],
              metadata: { "suite": "1234", testCase: "1234" },
              steps: [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 1.33,
                  "status": "FAIL",
                  "failure": "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n",
                  "stack_trace": "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)"
                },
                {
                  "duration": 0,
                  "failure": "",
                  "id": "",
                  "name": "And I close the test",
                  "stack_trace": "",
                  "status": "SKIP"
                }
              ],
              total: 4
            }
          ]
        }
      ]
    });
  });

});
