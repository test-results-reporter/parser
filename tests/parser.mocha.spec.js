const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite-single-test.json`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'mocha', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'mocha', files: [relativePath]});
    assert.notEqual(null, result2);
  });

  it('has multiple tags', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });
    let test_suite = result.suites[0];
    let test_case = result.suites[0].cases[0];
    assert.equal(test_suite.meta_data.has("tags"), true);
    assert.equal(test_suite.meta_data.get("tags"), "");
    assert.equal(test_suite.meta_data.get("tagsRaw"), "");
    assert.equal(test_suite.meta_data.get("type"), "api");
    assert.equal(test_case.meta_data.has("tags"), true);
    assert.equal(test_case.meta_data.get("tags"), "fast,1255");
    assert.equal(test_case.meta_data.get("tagsRaw"), "@fast,#1255");
  });

  it('has single tag', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });
    let test_case = result.suites[1].cases[0];
    assert.equal(test_case.meta_data.has("tags"), true);
    assert.equal(test_case.meta_data.get("tags"), "1234");
    assert.equal(test_case.meta_data.get("tagsRaw"), "#1234");
  });

  it('does not include tags meta if no tags are present', () =>{
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });
    let testcase = result.suites[0].cases[1];
    assert.equal(testcase.meta_data.has("tags"), false);
  });
});

describe('Parser - Mocha Awesome Json', () => {
  const testDataPath = "tests/data/mocha/awesome";

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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            },
            {
              attachments: [],
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
              meta_data: new Map(),
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
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
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
              meta_data: new Map(),
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite-single-test.json`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'mocha', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'mocha', files: [relativePath]});
    assert.notEqual(null, result2);
  });

});