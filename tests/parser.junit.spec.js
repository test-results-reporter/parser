const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - JUnit', () => {

  const testDataPath = "tests/data/junit"

  it('single suite with single test', () => {
    // demonstrates basic parsing of a single suite with a single test case
    const result = parse({ type: 'junit', files: [`${testDataPath}/single-suite.xml`] });
    assert.equal(result.name, 'result name'); // top-level suite name
    assert.equal(result.total, 1);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 1);
    assert.equal(result.duration, 10000);
    assert.equal(result.status, 'FAIL'); // failure bubbles up to top-level
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].name, 'suite name'); // name of the suite
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 0);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].duration, 10000);
    assert.equal(result.suites[0].status, 'FAIL'); // failure bubbles up to suite level
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].name, 'Use a program name that matches the source file name');
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].failure, "PROGRAM.cbl:2 Use a program name that matches the source file name");
    assert.equal(result.suites[0].cases[0].stack_trace, 'Some Text');
    assert.equal(result.suites[0].cases[0].duration, 10000);
  });

  it('empty suite with single test', () => {
    // some test frameworks (e.g. mocha-junit-reporter) generate an empty root level suite.
    // this test demonstrates that empty suites are not included in the results
    const result = parse({ type: 'junit', files: [`${testDataPath}/empty-suite.xml`] });
    assert.equal(result.total, 1);
    assert.equal(result.passed, 1);
    assert.equal(result.suites.length, 1);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites[0].name, 'suite name');
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].status, 'PASS');
    assert.equal(result.suites[0].cases.length, 1);    
    assert.equal(result.suites[0].cases[0].status, 'PASS');
  });

  it('suite with skipped tests', () => {
    // demonstrates that skipped tests are handled correctly
    const result = parse({ type: 'junit', files: [`${testDataPath}/skipped-tests.xml`] });
    assert.equal(result.total, 0); // total excludes skipped tests
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.duration, 10000);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].name, 'suite name');
    assert.equal(result.suites[0].total, 0);
    assert.equal(result.suites[0].skipped, 1);
    assert.equal(result.suites[0].duration, 10000);
    assert.equal(result.suites[0].status, 'PASS');
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].status, 'SKIP');
  });

  it('multiple suites', () => {
    // demonstrates parsing of multiple test suites within a single file
    const result = parse({ type: 'junit', files: [`${testDataPath}/multiple-suites.xml`] });
    assert.equal(result.name, 'result name'); // top-level suite name
    assert.equal(result.total, 2);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 2);
    assert.equal(result.duration, 20000);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].name, 'suite name 1');
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 0);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].duration, 10000);
    assert.equal(result.suites[0].status, 'FAIL');
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[1].name, 'suite name 2');
    assert.equal(result.suites[1].total, 1);
    assert.equal(result.suites[1].passed, 0);
    assert.equal(result.suites[1].failed, 1);
    assert.equal(result.suites[1].duration, 10000);
    assert.equal(result.suites[1].status, 'FAIL');
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
  });

  it('multiple single suite files', () => {
    // demonstrate parsing multiple files, where each file contains a single suite
    const result = parse({ type: 'junit', files: [`${testDataPath}/single-suite.xml`, `${testDataPath}/single-suite.xml`] });
    assert.equal(result.name, 'result name'); // top-level suite name
    assert.equal(result.total, 2);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 2);
    assert.equal(result.duration, 20000);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].status, 'FAIL');
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[1].total, 1);
    assert.equal(result.suites[1].status, 'FAIL');
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
  });

  it('parse newman reporter', () => {
    // demonstrates parsing of junit generated by newman reporter
    const result = parse({ type: 'junit', files: [`${testDataPath}/newman.xml`] });
    assert.equal(result.name, 'MyCollection');
    assert.equal(result.total, 1);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.duration, 32937);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].name, '1 - Authenticate');
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].duration, 807);
    assert.equal(result.suites[0].status, 'PASS');
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].cases[0].name, 'Teste');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].duration, 807);
  });

  it('parse newman with failures', () => {
    // demonstrates parsing of junit generated by newman reporter with failed tests
    const result = parse({ type: 'junit', files: [`${testDataPath}/newman-failures.xml`] });
    assert.equal(result.name, 'MainApi');
    assert.equal(result.total, 3);
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.duration, 37506);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].name, 'Main / GetSectors');
    assert.equal(result.suites[0].total, 2);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].duration, 446);
    assert.equal(result.suites[0].status, 'FAIL');
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].name, "Sectors - Verify 'Residential' is in list");
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].duration, 446);
    assert.equal(result.suites[0].cases[1].name, 'Sectors EndPoint - returns a JSON response');
    assert.equal(result.suites[0].cases[1].status, 'PASS');
    assert.equal(result.suites[0].cases[1].duration, 446);
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].name, 'Main / Verifyresponsedata-MarketAsset');
    assert.equal(result.suites[1].total, 1);
    assert.equal(result.suites[1].passed, 1);
    assert.equal(result.suites[1].failed, 0);
    assert.equal(result.suites[1].duration, 634);
    assert.equal(result.suites[1].status, 'PASS');
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].name, 'Market Asset(id-387) response - data is as expected');
    assert.equal(result.suites[1].cases[0].status, 'PASS');
    assert.equal(result.suites[1].cases[0].duration, 634);
  });

  it('parse spekt/junit.testlogger', () => {
    // demonstrates parsing of junit generated by .net spekt/junit.testlogger
    const result = parse({ type: 'junit', files: [`${testDataPath}/junit.testlogger.xml`] });
    assert.equal(result.name, ''); // top-level suite does not have a name
    assert.equal(result.total, 3); // skipped are removed from total?
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.skipped, 1);
    assert.equal(result.errors, 0);
    // todo: timestamp
    assert.equal(result.duration.toFixed(2), 870.68);
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].name, 'JUnit.Xml.TestLogger.NetCore.Tests.dll');
    assert.equal(result.suites[0].total, 3); // skipped are removed from total?
    assert.equal(result.suites[0].passed, 2);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].skipped, 1);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].duration.toFixed(2), 870.68);
    assert.equal(result.suites[0].cases.length, 4);
    assert.equal(result.suites[0].cases[0].name, 'TestD');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    assert.equal(result.suites[0].cases[1].name, 'TestC');
    assert.equal(result.suites[0].cases[1].status, 'FAIL');
    assert.ok(result.suites[0].cases[1].failure.startsWith('TearDown : System.InvalidOperationException : Operation is not valid'));
    assert.ok(result.suites[0].cases[1].stack_trace.startsWith('--TearDown'));
    assert.equal(result.suites[0].cases[2].name, 'InconclusiveTest');
    assert.equal(result.suites[0].cases[2].status, 'PASS');
    assert.equal(result.suites[0].cases[3].name, 'Ignored');
    assert.equal(result.suites[0].cases[3].status, 'SKIP');
    // system.out / system.err at root level are ignored

    // demonstrate properties were inherited from suite to test case
    // note: similar to 'include hostname in meta-data from suite and test case' test below
    assert.deepEqual(result.suites[0].metadata, { "hostname": "REDACTED" });
    assert.deepEqual(result.suites[0].cases[0].metadata, { "hostname": "REDACTED" });
  });

  it('parse testcafe with test suite root node', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/testCafe.xml`] });

    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].cases.length, 2);
  });

  it('can detect failures with testsuite root node', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/testsuite-with-error.xml`] });

    assert.equal(result.total, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
  })

  it('can detect single suite and single test case', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/testsuite-with-singletest.xml`] });

    assert.equal(result.total, 1);
    assert.equal(result.suites[0].cases[0].status, 'PASS');
  })

  it('empty suite with no tests', () => {
    // demonstrate reading an result that only contains a single testSuites element
    const result = parse({ type: 'junit', files: [`${testDataPath}/no-suites.xml`] });
    assert.equal(result.total, 0);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.duration, 0);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 0);
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

  it('parse system.out to locate properties (testcase)', () => {
    const result = parse({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/inline-properties.xml`] });

    assert.deepEqual(result.suites[0].cases[0].metadata, {
      author: 'Adrian',
      language: 'english',
      'browser-log': 'Log line #1\nLog line #2\nLog line #3'
    });
  });

  it('parse system.out to locate properties (suite)', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/inline-properties-suite-level.xml`] });

    // verify properties were set at the suite level
    assert.deepEqual(result.suites[0].metadata, {
      author: 'Adrian',
      language: 'english',
      'browser-log': 'Log line #1\nLog line #2\nLog line #3'
    });

    // verify properties were inherited at the test case level
    assert.deepEqual(result.suites[0].cases[0].metadata, {
      author: 'Adrian',
      language: 'english',
      'browser-log': 'Log line #1\nLog line #2\nLog line #3'
    });
  });

  it('wdio - multiple files', () => {
    const result = parse({ type: 'junit', files: [`${testDataPath}/wdio/*.xml`] });
    assert.equal(result.total, 9);
    assert.equal(result.passed, 9);
    assert.equal(result.failed, 0);
    assert.equal(result.duration, 157489);
    assert.equal(result.status, 'PASS');
  });

  it('wido - should match when file paths are windows or linux', () => {
    const result1 = parse({ type: 'junit', files: [`${testDataPath}/wdio/*.xml`] });
    const result2 = parse({ type: 'junit', files: [`${testDataPath}\\wdio\\*.xml`]});
    assert.equal(result1.total, result2.total);
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
    assert.equal(result.suites[1].cases[1].status, 'FAIL');
  });

  it('can capture suite start and end time', () => {
    // demonstrates that suites that have timestamps will have startTime and endTime captured
    const result = parse({ type: 'junit', files: [`${testDataPath}/newman.xml`] });
    assert.equal(result.suites[0].startTime.toISOString(), '2022-09-20T16:49:56.147Z');
    assert.equal(result.suites[0].duration, 807);
    assert.equal(result.suites[0].endTime.toISOString(), '2022-09-20T16:49:56.954Z');
  });

  it('can capture overall start and end time for all suites', () => {
    // demonstrates that the overall result will have startTime and endTime based on the earliest and latest suite times
    const result = parse({ type: 'junit', files: [`${testDataPath}/mocha-failures-with-stack-trace.xml`] });

    assert.ok(result.startTime instanceof Date);
    assert.ok(result.endTime instanceof Date);
    assert.ok(result.endTime > result.startTime);
  });
});