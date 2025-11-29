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
    assert.equal(result.suites[1].cases[0].stack_trace.startsWith('AssertionError [ERR_ASSERTION]: Dummy reason'), true);
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

  it('captures startTime and endTime for overall result', () => {
    // demonstrates how overall startTime and endTime is extracted from 'stats'
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });

    assert.equal(result.startTime.toISOString(), '2022-06-11T05:24:09.223Z');
    assert.equal(result.endTime.toISOString(), '2022-06-11T05:24:09.226Z');
  });
});

describe('Parser - Mocha Awesome Json', () => {
  const testDataPath = "tests/data/mocha/awesome";

  it('single suite with single test', () => {
    // demonstrate reading single suite/test in mocha awesome format
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });

    assert.equal(result.total, 1);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.duration, 3);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].name, 'Simple Suite');
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
    // mocha/awesome format with no tests
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

  it('suite with pending tests', () => {
    // mocha/awesome format with pending tests are treated as 'skipped'
    const result = parse({ type: 'mocha', files: [`${testDataPath}/pending-tests.json`] });
    assert.equal(result.total, 2);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].total, 2);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].skipped, 1);
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].name, 'first sample test');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[1].name, 'second sample test');
    assert.equal(result.suites[0].cases[1].status, 'SKIP');
  });

  it('multiple suites', () => {
    // demonstrates processing multiple suites in mocha/awesome format
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].name, 'Example Suite 1');
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].name, 'sample test case');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[1].name, 'sample test case 2');
    assert.equal(result.suites[0].cases[1].status, 'PASS');
    assert.equal(result.suites[1].name, 'Example Suite 2');
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].name, 'sample test case');
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
  });

  it('nested suites', () => {
    // demonstrates processing nested suites in mocha/awesome format
    const result = parse({ type: 'mocha', files: [`${testDataPath}/nested-suites.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].name, 'Example Suite 1');
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[1].name, 'Example Suite 2');
    assert.equal(result.suites[1].cases.length, 1);
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
    // mocha/awesome supports pending and skipped tests
    const result = parse({ type: 'mocha', files: [`${testDataPath}/skipped-tests.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].name, 'first skipped test');
    assert.equal(result.suites[0].cases[0].status, 'SKIP');
    assert.equal(result.suites[1].cases[0].name, 'first passed test');
    assert.equal(result.suites[1].cases[0].status, 'PASS');
    assert.equal(result.suites[1].cases[1].name, 'second passed test');
    assert.equal(result.suites[1].cases[1].status, 'PASS');
  });

  it('suite with failures', () => {
    // demonstrates capturing failed tests in mocha/awesome format
    const result = parse({ type: 'mocha', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });

    assert.equal(result.total, 3);
    assert.equal(result.failed, 1);
    assert.equal(result.suites[1].cases[0].name, 'sample test case');
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
    assert.equal(result.suites[1].cases[0].failure, 'Dummy reason');
    assert.ok(result.suites[1].cases[0].stack_trace.startsWith('AssertionError [ERR_ASSERTION]: Dummy reason'));
  });

  it('captures startTime and endTime for overall result', () => {
    // demonstrates how overall startTime and endTime is extracted from 'stats'
    const result = parse({ type: 'mocha', files: [`${testDataPath}/single-suite-single-test.json`] });

    assert.equal(result.startTime.toISOString(), '2022-06-11T05:24:09.223Z');
    assert.equal(result.endTime.toISOString(), '2022-06-11T05:24:09.226Z');
  });
});