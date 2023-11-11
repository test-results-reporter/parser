const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - NUnit', () => {

  const testDataPath = "tests/data/nunit";
  var result;

  context('NUnit V2', () => {

    before( () => {
      result = parse({ type: 'nunit', files: [`${testDataPath}/nunit_v2.xml`] });
    });

    it('Should calculate totals', () => {
      // evaluate totals on the testresult
      assert.equal(result.total, 28);
      assert.equal(result.passed, 18);
      assert.equal(result.failed, 1);
      assert.equal(result.errors, 1);
      assert.equal(result.skipped, 7);
      // inconclusive is excluded from results so total is not accurate
      assert.equal(result.total - (result.passed + result.failed + result.errors + result.skipped), 1 /* not zero because inconclusive */);

      // compare sum of suite totals to testresult
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.total} ,0), result.total);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.passed} ,0), result.passed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.failed} ,0) - /*inconclusive*/ 1, result.failed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.errors} ,0), result.errors);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.skipped} ,0), result.skipped);

      // compare sum results of test cases to testresult totals
      assert.equal( sumCases(result, (testCase) => { return 1 /* count of testcase */ }), result.total);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "PASS" ? 1 : 0 }), result.passed);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "FAIL" ? 1 : 0 }) - 1 /*remove inconclusive */, result.failed);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "ERROR" }), result.errors);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "SKIP" ? 1 : 0 }), result.skipped);
    });

    it('Should express durations in milliseconds', () => {
      let totalDuration = result.duration;
      let suiteDuration = result.suites[0].duration; // sample
      let testDuration  = result.suites[0].cases[0].duration; // sample
      assert.equal(totalDuration > 100, true, `TestResult duration should be more than 100 millisecond (${totalDuration}`);
      assert.equal(suiteDuration > 100, true, `Suite duration should be more than 100 milliseconds (${suiteDuration})`);
      assert.equal(testDuration > 10, true,  `Test duration should be more than 10 milliseconds (${testDuration})`);
    });

    it('Should include names for all tests', () => {
      let count = 0;
      result.suites.forEach( s => {
        s.cases.forEach( c => {
          count++;
          assert.equal( c.name !== '' && c.name !== undefined, true);
        });
      });
      assert.equal( count > 0, true, "Should have evaluated multiple test cases.");
    });

    it('Should map results correctly', () => {
      assert.equal(result.suites[0].status, "FAIL");
      assert.equal(result.suites[0].cases[0].status, "FAIL"); // Failure
      assert.equal(result.suites[0].cases[8].status, "ERROR"); // Error
      assert.equal(result.suites[1].status, "SKIP"); 
      assert.equal(result.suites[1].cases[0].status, "SKIP"); // NotRunnable
      assert.equal(result.suites[2].status, "PASS"); 
      assert.equal(result.suites[2].cases[0].status, "PASS"); // Success
      assert.equal(result.suites[6].status, "SKIP"); 
      assert.equal(result.suites[6].cases[0].status, "SKIP"); // Ignored
    });

    it('Should get reason for inconclusive', () => {
      assert.equal(result.suites[0].cases[1].status, 'FAIL');
      assert.notEqual(result.suites[0].cases[1].failure, undefined);
    });

    it('Should get failure message and stack trace for failure', () => {
      assert.equal(result.suites[0].cases[0].status, 'FAIL');
      assert.notEqual(result.suites[0].cases[0].failure, '');
      assert.notEqual(result.suites[0].cases[0].stack_trace, '');
    });

    it('Should map suite categories to testcases', () => {
      let count = 0;
      result.suites[0].cases.forEach( c => {
        count++;
        assert.equal(c.meta_data.has("FixtureCategory"), true);
        assert.equal(c.meta_data.get("Categories").includes("FixtureCategory"), true);
      });
      assert.equal( count > 0, true);
    });

    it('Should map test-case categories and properties to testcases', () => {
      // case 3 has additional category + properties
      let testcase = result.suites[0].cases[3];
      // categories
      assert.equal(testcase.meta_data.has("MockCategory"), true);
      assert.equal(testcase.meta_data.get("Categories").includes("MockCategory"), true);
      assert.equal(testcase.meta_data.get("Categories"), "FixtureCategory,MockCategory"); // combined

      // properties
      assert.equal(testcase.meta_data.get("Severity"),"Critical");
    });

  });

  function sumCases(result, predicate) {
    return result.suites.reduce( (total, suite) => {
      return total + suite.cases.reduce( (testcaseTotal, testcase) => {
        let output = predicate(testcase);
        return testcaseTotal + output;
      }, 0);
    }, 0);
  }

});