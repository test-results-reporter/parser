const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - JUnit', () => {

  const testDataPath = "tests/data/junit"

  it('single suite with single test', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/single-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 10000,
      status: 'FAIL',
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "PROGRAM.cbl:2 Use a program name that matches the source file name",
              id: "",
              name: "Use a program name that matches the source file name",
              passed: 0,
              skipped: 0,
              stack_trace: "Some Text",
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

  it('empty suite with single test', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/empty-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 10000,
      status: 'FAIL',
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Use a program name that matches the source file name",
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

  it('suite with skipped tests', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/skipped-tests.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 1,
      retried: 0,
      duration: 10000,
      status: 'PASS',
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Use a program name that matches the source file name",
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
    const result = parse({ type: 'junit', files: [`${testDataPath}/multiple-suites.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 2,
      passed: 1,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 20000,
      status: 'FAIL',
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "PROGRAM.cbl:2 Use a program name that matches the source file name",
              id: "",
              name: "Use a program name that matches the source file name",
              passed: 0,
              skipped: 0,
              stack_trace: "Some Text",
              status: "FAIL",
              tags: [],
              metadata: {},
              steps: [],
              total: 0
            }
          ]
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "PROGRAM.cbl:2 Use a program name that matches the source file name",
              id: "",
              name: "Use a program name that matches the source file name",
              passed: 0,
              skipped: 0,
              stack_trace: "Some Text",
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

  it('multiple single suite files', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/single-suite.xml`, `${testDataPath}/single-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'result name',
      total: 2,
      passed: 0,
      failed: 2,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 20000,
      status: 'FAIL',
      tags: [],
      metadata: {},
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "PROGRAM.cbl:2 Use a program name that matches the source file name",
              id: "",
              name: "Use a program name that matches the source file name",
              passed: 0,
              skipped: 0,
              stack_trace: "Some Text",
              status: "FAIL",
              tags: [],
              metadata: {},
              steps: [],
              total: 0
            }
          ]
        },
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
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 10000,
              errors: 0,
              failed: 0,
              failure: "PROGRAM.cbl:2 Use a program name that matches the source file name",
              id: "",
              name: "Use a program name that matches the source file name",
              passed: 0,
              skipped: 0,
              stack_trace: "Some Text",
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

  it('parse newman reporter', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/newman.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'MyCollection',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 32937,
      status: 'PASS',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: '1 - Authenticate',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 807,
          status: 'PASS',
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              duration: 807,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Teste",
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

  it('parse newman with failures', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/newman-failures.xml`] });
    assert.deepEqual(result, {
      id: "",
      name: "MainApi",
      total: 3,
      passed: 1,
      failed: 2,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 37506,
      status: "FAIL",
      tags: [],
      metadata: {},
      suites: [
        {
          id: "",
          name: "Main / GetSectors",
          total: 2,
          passed: 0,
          failed: 2,
          errors: 0,
          skipped: 0,
          duration: 446,
          status: "FAIL",
          tags: [],
          metadata: {},
          cases: [
            {
              id: "",
              name: "Sectors - Verify 'Residential' is in list",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 446,
              status: "FAIL",
              failure: "expected to include 'Residntial'",
              stack_trace: "",
              tags: [],
              metadata: {},
              attachments: [],
              steps: []
            },
            {
              id: "",
              name: "Sectors EndPoint - returns a JSON response",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 446,
              status: "PASS",
              failure: "",
              stack_trace: "",
              tags: [],
              metadata: {},
              attachments: [],
              steps: []
            }
          ]
        },
        {
          id: "",
          name: "Main / Verifyresponsedata-MarketAsset",
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 634,
          status: "PASS",
          tags: [],
          metadata: {},
          cases: [
            {
              id: "",
              name: "Market Asset(id-387) response - data is as expected",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 634,
              status: "PASS",
              failure: "",
              stack_trace: "",
              tags: [],
              metadata: {},
              attachments: [],
              steps: []
            }
          ]
        }
      ]
    });
  });

  it('parse spekt/junit.testlogger', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/junit.testlogger.xml`] });
    assert.deepEqual(result.suites[0].metadata, { "hostname": "REDACTED" });
    assert.deepEqual(result.suites[0].cases[0].metadata, { "hostname": "REDACTED" });
  });

  it('parse testcafe with test suite root node', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/testCafe.xml`] });

    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].cases.length, 2);
  });

  it('empty suite with no tests', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/no-suites.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'no suites',
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

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite.xml`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'junit', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'junit', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('meta-data from suite merged with test case', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/multiple-suites-properties.xml'] });
    assert.deepEqual(result.suites[0].metadata, { "key1": "value1", "key2": "value2" });
    assert.deepEqual(result.suites[0].cases[0].metadata, { "key1": "override-value1", "key2": "value2" });
  });

  it('include hostname in meta-data from suite and test case', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/playwright.xml'] });

    assert.deepEqual(result.suites[0].metadata, { "hostname": "chromium" });
    assert.deepEqual(result.suites[0].cases[0].metadata, { "hostname": "chromium" });
    assert.deepEqual(result.suites[0].cases[1].metadata, { "hostname": "chromium" });

    assert.deepEqual(result.suites[1].metadata, { "hostname": "firefox" });
    assert.deepEqual(result.suites[1].cases[0].metadata, { "hostname": "firefox" });
    assert.deepEqual(result.suites[1].cases[1].metadata, { "hostname": "firefox" });

    assert.deepEqual(result.suites[2].metadata, { "hostname": "webkit" });
    assert.deepEqual(result.suites[2].cases[0].metadata, { "hostname": "webkit" });
    assert.deepEqual(result.suites[2].cases[1].metadata, { "hostname": "webkit" });

  });

  it('parse system.out to locate attachments', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/test-case-attachments.xml'] });

    // test case with 1 attachment
    assert.equal(result.suites[0].cases[0].attachments.length, 1);
    assert.equal(result.suites[0].cases[0].attachments[0].path, '/path/to/attachment.png');

    // test case with multiple attachments
    assert.equal(result.suites[0].cases[1].attachments.length, 2);
    assert.equal(result.suites[0].cases[1].attachments[0].path, '/path/to/attachment1.png');
    assert.equal(result.suites[0].cases[1].attachments[1].path, '/path/to/attachment2.png');

    // test case with no attachments
    assert.equal(result.suites[0].cases[2].attachments.length, 0);

    // test case with empty or malformed attachment output
    assert.equal(result.suites[0].cases[3].attachments.length, 0);
  });

  it('wdio - multiple files', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/wdio/*.xml`] });
    assert.equal(result.total, 9);
    assert.equal(result.passed, 9);
    assert.equal(result.failed, 0);
    assert.equal(result.duration, 157489);
    assert.equal(result.status, 'PASS');
  });

  it('wdio - failures and errors', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/wdio-failures-errors.xml`] });
    assert.equal(result.total, 4);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 2);
    assert.equal(result.errors, 2);
    assert.equal(result.duration, 91024);
    assert.equal(result.status, 'FAIL');
  });

  it('mocha - failures with stack trace', () => {
    const result = parse({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/mocha-failures-with-stack-trace.xml`] });
    assert.equal(result.total, 51);
    assert.equal(result.passed, 49);
    assert.equal(result.failed, 2);
    assert.equal(result.errors, 0);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites[5].cases[0].failure, `HTTP status 200 !== 400`);
    assert.match(result.suites[5].cases[0].stack_trace, /at Expect._validateStatus/);
  });

  it('playwright failures', () => {
    const result = parse({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/playwright-failures.xml`] });
    assert.equal(result.total, 16);
    assert.equal(result.passed, 14);
    assert.equal(result.failed, 2);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites[1].cases[1].attachments[0].name, `test-failed-1.png`);
    assert.equal(result.suites[1].cases[1].attachments[0].path, `example-get-started-link-chromium/test-failed-1.png`);
  })

});