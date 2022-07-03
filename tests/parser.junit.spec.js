const { parse } = require('../src');
const assert = require('assert');

describe('Parser - JUnit', () => {

  it('single suite with single test', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/single-suite.xml'] });
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
          cases: [
            {
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
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('empty suite with single test', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/empty-suite.xml'] });
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
          cases: [
            {
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
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('suite with skipped tests', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/skipped-tests.xml'] });
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
          cases: [
            {
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
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('multiple suites', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/multiple-suites.xml'] });
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
          cases: [
            {
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
          cases: [
            {
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
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

  it('multiple single suite files', () => {
    const result = parse({ type: 'junit', files: ['tests/data/junit/single-suite.xml', 'tests/data/junit/single-suite.xml'] });
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
          cases: [
            {
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
          cases: [
            {
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
              steps: [],
              total: 0
            }
          ]
        }
      ]
    });
  });

});