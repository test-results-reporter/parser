const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - XUnit', () => {

  const testDataPath = "tests/data/xunit";

  it('single suite with single test', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/single-suite.xml`] });
    assert.equal(result.name, 'single suite test');
    assert.equal(result.total, 1);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 1);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].name, 'Example test collection 1');
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 0);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].skipped, 0);
    assert.equal(result.suites[0].cases[0].name, 'Example test case 1');
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].failure, 'Example of a failure message');
    assert.match(result.suites[0].cases[0].stack_trace, /Long string with failure/);
    assert.equal(result.suites[0].cases[0].duration, 86006.5);
    assert.equal(result.suites[0].cases[0].metadata.TestID, 'ID');
    assert.equal(result.suites[0].cases[0].metadata.TestLevel, 'Regression');
    assert.equal(result.suites[0].cases[0].metadata.TestProduct, 'TestProductExample');
    assert.equal(result.suites[0].cases[0].metadata.TestSuite, 'TestSuiteExample');
  });

  it('suite with single skipped test', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/skipped-suite.xml`] });
    assert.equal(result.name, 'Skipped test');
    assert.equal(result.total, 1);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 1);
    assert.equal(result.suites[0].cases.length, 1);
    assert.equal(result.suites[0].name, 'Test collection skipped');
    assert.equal(result.suites[0].total, 1);
    assert.equal(result.suites[0].passed, 0);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].skipped, 1);
    assert.equal(result.suites[0].cases[0].name, 'SkippedTest');
    assert.equal(result.suites[0].cases[0].status, 'SKIP');
  });

  it('multiple suites', () => {
    // demonstrate that multiple test suites in a single file are supported
    const result = parse({ type: 'xunit', files: [`${testDataPath}/multiple-suites.xml`] });
    assert.equal(result.name, 'Multiple suites');
    assert.equal(result.total, 6);
    assert.equal(result.passed, 3);
    assert.equal(result.failed, 3);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 4);
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].total, 2);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].name, 'Test suite number 1');
    assert.equal(result.suites[0].cases[0].name, 'ExampleTestCase 1');
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[1].name, 'ExampleTestCase 2');
    assert.equal(result.suites[0].cases[1].status, 'PASS');
    assert.equal(result.suites[1].name, 'Test suite number 2');
    assert.equal(result.suites[1].cases.length, 2);
    assert.equal(result.suites[1].cases[0].name, 'ExampleTestCase 3');
    assert.equal(result.suites[1].cases[0].status, 'FAIL');
    assert.equal(result.suites[1].cases[1].name, 'ExampleTestCase 4');
    assert.equal(result.suites[1].cases[1].status, 'PASS');
    assert.equal(result.suites[2].cases.length, 1);
    assert.equal(result.suites[2].name, 'Test suite number 3');
    assert.equal(result.suites[2].cases[0].name, 'ExampleTestCase 5');
    assert.equal(result.suites[2].cases[0].status, 'PASS');
    assert.equal(result.suites[3].name, 'Test suite number 4');
    assert.equal(result.suites[3].cases.length, 1);
    assert.equal(result.suites[3].cases[0].name, 'ExampleTestCase 6');
    assert.equal(result.suites[3].cases[0].status, 'FAIL');
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite.xml`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'xunit', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'xunit', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('meta-data from traits', () => {
    const result = parse({ type: 'xunit', files: ['tests/data/xunit/single-suite.xml'] });
    assert.deepEqual(result.suites[0].cases[0].metadata, {
      TestID: 'ID',
      TestLevel: 'Regression',
      TestProduct: 'TestProductExample',
      TestSuite: 'TestSuiteExample'
    });
  });

  it('no meta-data from empty traits', () => {
    const result = parse({ type: 'xunit', files: ['tests/data/xunit/no-traits-suite.xml'] });
    assert.deepEqual(result.suites[0].cases[0].metadata, {});
  });

  it('Should hanlde test results with no test cases', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/empty-results.xml`] });
    assert.equal(result.total, 0);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.suites.length, 0);
    assert.equal(result.status, "PASS");
  });

  it('Should compute started and completed timestamps on overall result', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/single-suite.xml`] });

    // timestamp represented in this file are expressed in local presentational format without timezone info
    // so it assumes the timezone of the local machine running the test
    assert.ok(result.startTime instanceof Date);
    assert.ok(result.endTime instanceof Date);
    let milliseconds = result.endTime - result.startTime;
    assert.equal(milliseconds, 86006);
    assert.equal(result.duration, 86006.5);
  });

  context('V3 schema', () => {
    it('should include fullname for test cases', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });
      assert.equal(result.suites[0].cases[0].name, 'XUnit3Example.UnitTest1.Test1');
    });

    it('should express durations in milliseconds', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });
      assert.equal(result.suites[0].cases[0].duration, 12.5588);
    });

    it('should map passed tests correctly', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });
      assert.equal(result.total, 1);
      assert.equal(result.passed, 1);
      assert.equal(result.status, "PASS");
      assert.equal(result.suites[0].cases[0].status, "PASS");
    });

    it('should map failed tests correctly', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3_fail.xml`] });
      assert.equal(result.total, 1);
      assert.equal(result.failed, 1);
      assert.equal(result.status, "FAIL");
      assert.equal(result.suites[0].cases[0].status, "FAIL");
      assert.match(result.suites[0].cases[0].failure, /Assert\.True\(\) Failure/);
      assert.match(result.suites[0].cases[0].stack_trace, /at XUnit3Example2\.UnitTest2\.FailingTest/);
    });

    it('should map skipped tests correctly', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3_skipped.xml`] });
      assert.equal(result.total, 2);
      assert.equal(result.skipped, 2);
      assert.equal(result.status, "PASS");
      assert.equal(result.suites[0].cases[0].status, "SKIP");
      assert.equal(result.suites[0].cases[1].status, "SKIP");
    });

    it('should include started and completed timestamps on overall result', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });

      assert.equal(result.startTime.toISOString(), '2025-11-29T00:10:25.822Z');
      assert.equal(result.endTime.toISOString(), '2025-11-29T00:10:25.903Z');
    });

    it('should include started and completed timestamps on suites', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });
      assert.equal(result.suites[0].startTime.toISOString(), '2025-11-29T00:10:25.883Z');
      assert.equal(result.suites[0].endTime.toISOString(), '2025-11-29T00:10:25.903Z');
    });

    it('should include started and completed timestamps on tests', () => {
      const result = parse({ type: 'xunit', files: [`${testDataPath}/xunit3.xml`] });
      assert.equal(result.suites[0].cases[0].startTime.toISOString(), '2025-11-29T00:10:25.883Z');
      assert.equal(result.suites[0].cases[0].endTime.toISOString(), '2025-11-29T00:10:25.903Z');
    });
  })

});