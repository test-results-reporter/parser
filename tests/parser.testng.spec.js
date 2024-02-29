const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - TestNG', () => {
  const testDataPath = "tests/data/testng"
  it('single suite with single test', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'Default suite',
      total: 4,
      passed: 4,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
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
          status: 'PASS',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              id: '',
              name: 'c2',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              status: 'PASS',
              failure: '',
              stack_trace: '',
              meta_data: new Map(),
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c3',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 10,
              status: 'PASS',
              failure: '',
              stack_trace: '',
              meta_data: new Map(),
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c1',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              status: 'PASS',
              failure: '',
              stack_trace: '',
              meta_data: new Map(),
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c4',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              status: 'PASS',
              failure: 'expected [true] but found [false]',
              stack_trace: '',
              meta_data: new Map(),
              steps: []
            }
          ]
        }
      ]
    });
  });

  it('single suite with multiple tests', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite-multiple-tests.xml`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "Regression Tests",
      "total": 20,
      "passed": 8,
      "failed": 11,
      "errors": 0,
      "skipped": 1,
      "retried": 0,
      "duration": 1403931,
      "status": "FAIL",
      "suites": [
        {
          "id": "",
          "name": "desktop-chrome",
          "total": 5,
          "passed": 2,
          "failed": 3,
          "errors": 0,
          "skipped": 0,
          "duration": 202082,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 27168,
              "status": "FAIL",
              "failure": "expected [A] but found [948474]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 28313,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 15381,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP_WA",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 57111,
              "status": "FAIL",
              "failure": "Expected condition failed: : <95ddbda01ea4b3dbcb049e681a6>",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 13221,
              "status": "FAIL",
              "failure": "element click intercepted:",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        },
        {
          "id": "",
          "name": "mobile-ios",
          "total": 5,
          "passed": 2,
          "failed": 2,
          "errors": 0,
          "skipped": 1,
          "duration": 545598,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 69776,
              "status": "FAIL",
              "failure": "expected [A] but found [948474]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 103463,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 66833,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP_WA",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 250674,
              "status": "FAIL",
              "failure": "Appium error: An unknown sr='Search...']}",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "SKIP",
              "failure": "A script did not complete ",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        }
      ]
    });
  });

  it('multiple suites with single test', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-single-test.xml`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "Default suite",
      "total": 4,
      "passed": 4,
      "failed": 0,
      "errors": 0,
      "skipped": 0,
      "retried": 0,
      "duration": 2000,
      "status": "PASS",
      "suites": [
        {
          "id": "",
          "name": "Default test",
          "total": 4,
          "passed": 4,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 2000,
          "status": "PASS",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "c2",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c3",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 10,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c1",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c4",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "expected [true] but found [false]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        }
      ]
    });
  });

  it('multiple suites with multiple tests', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-multiple-tests.xml`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "Default suite 1",
      "total": 8,
      "passed": 8,
      "failed": 0,
      "errors": 0,
      "skipped": 0,
      "retried": 0,
      "duration": 4000,
      "status": "PASS",
      "suites": [
        {
          "id": "",
          "name": "Default suite 1",
          "total": 4,
          "passed": 4,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 2000,
          "status": "PASS",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "c2",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c3",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 10,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c1",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c4",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "expected [true] but found [false]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        },
        {
          "id": "",
          "name": "Default suite",
          "total": 4,
          "passed": 4,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 2000,
          "status": "PASS",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "c2",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c3",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 10,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c1",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c4",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "expected [true] but found [false]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        }
      ]
    });
  });

  it('multiple suites with retries', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-retries.xml`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "Staging - UI Smoke Test Run",
      "total": 6,
      "passed": 4,
      "failed": 2,
      "errors": 0,
      "skipped": 0,
      "retried": 2,
      "duration": 1883597,
      "status": "FAIL",
      "suites": [
        {
          "id": "",
          "name": "desktop-chrome",
          "total": 3,
          "passed": 2,
          "failed": 1,
          "errors": 0,
          "skipped": 0,
          "duration": 1164451,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 243789,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "PC",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 129368,
              "status": "RETRY",
              "failure": "failed",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "PC",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 123183,
              "status": "FAIL",
              "failure": "failed",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 194645,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        },
        {
          "id": "",
          "name": "mobile-andoid",
          "total": 3,
          "passed": 2,
          "failed": 1,
          "errors": 0,
          "skipped": 0,
          "duration": 714100,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 156900,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "PC",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 134774,
              "status": "RETRY",
              "failure": "failed",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "PC",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 126578,
              "status": "FAIL",
              "failure": "failed",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 242525,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        }
      ]
    });
  });

  it('results using glob', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-*.xml`] });
    assert.deepEqual(result, {
      "id": "",
      "name": "Regression Tests",
      "total": 24,
      "passed": 12,
      "failed": 11,
      "errors": 0,
      "skipped": 1,
      "retried": 0,
      "duration": 1405931,
      "status": "FAIL",
      "suites": [
        {
          "id": "",
          "name": "desktop-chrome",
          "total": 5,
          "passed": 2,
          "failed": 3,
          "errors": 0,
          "skipped": 0,
          "duration": 202082,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 27168,
              "status": "FAIL",
              "failure": "expected [A] but found [948474]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 28313,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 15381,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP_WA",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 57111,
              "status": "FAIL",
              "failure": "Expected condition failed: : <95ddbda01ea4b3dbcb049e681a6>",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 13221,
              "status": "FAIL",
              "failure": "element click intercepted:",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        },
        {
          "id": "",
          "name": "mobile-ios",
          "total": 5,
          "passed": 2,
          "failed": 2,
          "errors": 0,
          "skipped": 1,
          "duration": 545598,
          "status": "FAIL",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "GU",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 69776,
              "status": "FAIL",
              "failure": "expected [A] but found [948474]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 103463,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 66833,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "SBP_WA",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 250674,
              "status": "FAIL",
              "failure": "Appium error: An unknown sr='Search...']}",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "CB",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "SKIP",
              "failure": "A script did not complete ",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        },
        {
          "id": "",
          "name": "Default test",
          "total": 4,
          "passed": 4,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "duration": 2000,
          "status": "PASS",
          "meta_data": new Map(),
          "cases": [
            {
              "attachments": [],
              "id": "",
              "name": "c2",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c3",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 10,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c1",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            },
            {
              "attachments": [],
              "id": "",
              "name": "c4",
              "total": 0,
              "passed": 0,
              "failed": 0,
              "errors": 0,
              "skipped": 0,
              "duration": 0,
              "status": "PASS",
              "failure": "expected [true] but found [false]",
              "stack_trace": "",
              "meta_data": new Map(),
              "steps": []
            }
          ]
        }
      ]
    });
  });

  it('single suite with no test', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/empty-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'Empty Suite',
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

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite.xml`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'testng', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'testng', files: [relativePath]});
    assert.notEqual(null, result2);
  });

  it('assign groups to testcases in single suite', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/groups.xml'] });
    assert.equal(result.suites[0].cases[0].meta_data.get("groups"), "group1");
    assert.equal(result.suites[0].cases[0].meta_data.has("group1"), true);
    // 2nd testcase has multiple groups
    assert.equal(result.suites[0].cases[1].meta_data.get("groups"), "group1,group2");
    assert.equal(result.suites[0].cases[1].meta_data.has("group1"), true);
    assert.equal(result.suites[0].cases[1].meta_data.has("group2"), true);
  });
});