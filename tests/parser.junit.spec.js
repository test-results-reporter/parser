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
          meta_data: new Map(),
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
          meta_data: new Map(),
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
              meta_data: new Map(),
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
          meta_data: new Map(),
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
          meta_data: new Map(),
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
              stack_trace: "",
              status: "FAIL",
              meta_data: new Map(),
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
          meta_data: new Map(),
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
          meta_data: new Map(),
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
              stack_trace: "",
              status: "FAIL",
              meta_data: new Map(),
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
          meta_data: new Map(),
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
          meta_data: new Map(),
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
              meta_data: new Map(),
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
          meta_data: new Map(),
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
              meta_data: new Map(),
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
              meta_data: new Map(),
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
          meta_data: new Map(),
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
              meta_data: new Map(),
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
    var inheritedProperties = new Map([["hostname", "REDACTED"]]);
    assert.deepEqual(result, {
      id: "",
      name: "",
      total: 3,
      passed: 2,
      failed: 1,
      errors: 0,
      skipped: 1,
      retried: 0,
      duration: 870.6800000000001,
      status: "FAIL",
      suites: [
        {
          id: "",
          name: "JUnit.Xml.TestLogger.NetCore.Tests.dll",
          total: 3,
          passed: 2,
          failed: 1,
          errors: 0,
          skipped: 1,
          duration: 870.6800000000001,
          status: "FAIL",
          meta_data: inheritedProperties,
          cases: [
            {
              id: "",
              name: "TestD",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 2.195,
              status: "PASS",
              failure: "",
              stack_trace: "",
              meta_data: inheritedProperties,
              attachments: [],
              steps: []
            },
            {
              id: "",
              name: "TestC",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 1.109,
              status: "FAIL",
              failure: "TearDown : System.InvalidOperationException : Operation is not valid due to the current state of the object.",
              stack_trace: "",
              meta_data: inheritedProperties,
              attachments: [],
              steps: []
            },
            {
              id: "",
              name: "InconclusiveTest",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0.7200000000000001,
              status: "PASS",
              failure: "",
              stack_trace: "",
              meta_data: inheritedProperties,
              attachments: [],
              steps: []
            },
            {
              id: "",
              name: "Ignored",
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0.29500000000000004,
              status: "PASS",
              failure: "",
              stack_trace: "",
              meta_data: inheritedProperties,
              attachments: [],
              steps: []
            }
          ]
        }
      ]
    });
  });

  it('parse testcafe with testsuite root node', () => {
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

  it('meta-data from suite merged with testcase', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/multiple-suites-properties.xml'] });

    // confirm that suite level properties exist and are accurate
    assert.equal(result.suites[0].meta_data.size, 2);
    assert.equal(result.suites[0].meta_data.get("key1"), "value1");
    assert.equal(result.suites[0].meta_data.get("key2"), "value2");

    // confirm that the suite level properties were inherited into the test case and overridden if present
    assert.equal(result.suites[0].cases[0].meta_data.size, 2);
    assert.equal(result.suites[0].cases[0].meta_data.get("key1"), "override-value1"); // testcase value
    assert.equal(result.suites[0].cases[0].meta_data.get("key2"), "value2"); // suite value
  });

  it('include hostname in meta-data from suite and testcase', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/playwright.xml'] });

    assert.equal(result.suites[0].meta_data.get("hostname"), "chromium");
    assert.equal(result.suites[0].cases[0].meta_data.get("hostname"), "chromium");
    assert.equal(result.suites[0].cases[1].meta_data.get("hostname"), "chromium");

    assert.equal(result.suites[1].meta_data.get("hostname"), "firefox");
    assert.equal(result.suites[1].cases[0].meta_data.get("hostname"), "firefox");
    assert.equal(result.suites[1].cases[1].meta_data.get("hostname"), "firefox");

    assert.equal(result.suites[2].meta_data.get("hostname"), "webkit");
    assert.equal(result.suites[2].cases[0].meta_data.get("hostname"), "webkit");
    assert.equal(result.suites[2].cases[1].meta_data.get("hostname"), "webkit");

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

});