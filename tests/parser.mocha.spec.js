const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - Mocha Json', () => {

  const testDataPath = "tests/data/mocha/json"

  it('single suite with single test', () => {
    // demonstrate capture suites and test cases
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });
    
    assert.equal(result.total, 1);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.duration, 3);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].skipped, 0);
    assert.equal(result.suites[0].duration, 1);
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].name, 'Simple suite test');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].duration, 1);
  });

  it('empty suite report', () => {
    // demonstrate handling of empty suite
    const result = parse({ type: 'mocha', files: [`${testDataPath}/empty-suite.json`] });

    assert.equal(result.total, 0);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.duration, 0);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 0);
  });

  it('suite with skipped tests', () => {
    // demonstrate handling of 'pending' tests as 'skipped'
    const result = parse({ type: 'mocha', files: [`${testDataPath}/skipped-tests.json`] });

    assert.equal(result.total, 2);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites[0].name, 'Example Suite');
    assert.equal(result.suites[0].cases[0].name, 'first sample test');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[1].name, 'second sample test');
    assert.equal(result.suites[0].cases[1].status, 'SKIP');
  });

  it('multiple suites', () => {
    // demonstrate processing tests into suites
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].name, 'Example Suite 1');
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].name, 'sample test case');
    assert.equal(result.suites[0].cases[1].name, 'sample test case 2');
    assert.equal(result.suites[1].name, 'Example Suite 2');
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].name, 'Suite2 test case');
  });

  it('suite with failures', () => {
    // demonstrate capturing failed tests
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.failed, 1);
    assert.equal(result.suites[1].cases[0].name, 'Suite2 test case');
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
    assert.equal(result.suites[1].cases[0].failure, 'Dummy reason');
    // TODO: fix stack trace capture
    //assert.equal(result.suites[1].cases[0].stack_trace.startsWith('AssertionError [ERR_ASSERTION]: Dummy reason'), true);
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite-single-test.json`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'mocha', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'mocha', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('has multiple tags', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });

    let test_suite = result.suites[0];
    let test_case = result.suites[0].cases[0];

    assert.deepEqual(test_suite.metadata, { type: 'api' });
    assert.deepEqual(test_case.tags, ['@fast', '#1255']);
  });

  it('has single tag', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });
    let test_case = result.suites[1].cases[0];

    assert.deepEqual(test_case.tags, ['#1234']);
  });

  it('does not include tags meta if no tags are present', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests-tags.json`] });
    let test_case = result.suites[0].cases[1];
    assert.deepEqual(test_case.tags, []);
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
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 1,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Simple suite test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
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
      tags: [],
      metadata: {},
      suites: []
    });
  });

  it('suite with pending tests', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/pending-tests.json`] });
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
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 1,
              startTime: undefined, 
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "first sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
              steps: [],
              total: 0
            },
            {
              attachments: [],
              duration: 0,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "second sample test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "SKIP",
              tags: [],
              metadata: {},
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
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 3,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
              steps: [],
              total: 0
            },
            {
              attachments: [],
              duration: 1,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 1,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "Dummy reason",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              tags: [],
              metadata: {},
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
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 3,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
              steps: [],
              total: 0
            },
            {
              attachments: [],
              duration: 1,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "sample test case 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: [],
              metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 1,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "Dummy reason",
              id: "",
              name: "sample test case",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              tags: [],
              metadata: {},
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
    const result2 = parse({ type: 'mocha', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('supports skipped tests', () => {
    const result = parse({ type: 'mocha', files: [`${testDataPath}/skipped-tests.json`] });
    assert.deepEqual(result, {
      duration: 13998,
      errors: 0,
      failed: 0,
      id: "",
      name: "",
      passed: 2,
      retried: 0,
      skipped: 1,
      status: "PASS",
      total: 3,
      tags: [],
      metadata: {},
      suites: [
        {
          cases: [
            {
              attachments: [],
              duration: 0,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              tags: [],
              metadata: {},
              name: "first skipped test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "SKIP",
              steps: [],
              total: 0
            }
          ],
          duration: 0,
          errors: 0,
          failed: 0,
          id: "",
          tags: [],
          metadata: {},
          name: "Example Suite",
          passed: 0,
          skipped: 0,
          status: "FAIL",
          total: 1
        },
        {
          cases: [
            {
              attachments: [],
              duration: 8912,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              tags: [],
              metadata: {},
              name: "first passed test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            },
            {
              attachments: [],
              duration: 4734,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              tags: [],
              metadata: {},
              name: "second passed test",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              total: 0
            }
          ],
          duration: 13646,
          errors: 0,
          failed: 0,
          id: "",
          tags: [],
          metadata: {},
          name: "Second Example Suite",
          passed: 2,
          skipped: 0,
          status: "PASS",
          total: 2
        }
      ],
    });
  });
});