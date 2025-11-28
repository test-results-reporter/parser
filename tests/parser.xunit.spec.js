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

});