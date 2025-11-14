const { parse } = require('../src');
const assert = require('assert');

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
      assert.equal(result.failed, 2); // include inconclusive as a failure
      assert.equal(result.errors, 1);
      assert.equal(result.skipped, 7);
      assert.equal(result.total - (result.passed + result.failed + result.errors + result.skipped), 0);

      // compare sum of suite totals to testresult
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.total} ,0), result.total);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.passed} ,0), result.passed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.failed} ,0), result.failed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.errors} ,0), result.errors);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.skipped} ,0), result.skipped);

      // compare sum results of test cases to testresult totals
      assert.equal( sumCases(result, (testCase) => { return 1 /* count of testcase */ }), result.total);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "PASS" ? 1 : 0 }), result.passed);
      assert.equal( sumCases(result, (testCase) => { return testCase.status == "FAIL" ? 1 : 0 }), result.failed);
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

    it('Should map suite categories to test cases', () => {
      let count = 0;
      result.suites[0].cases.forEach( c => {
        count++;
        assert.equal(c.metadata["Categories"].includes("FixtureCategory"), true);
      });
      assert.equal( count > 0, true);
    });

    it('Should map test-case categories and properties to test cases', () => {
      // case 3 has additional category + properties
      let test_case = result.suites[0].cases[3];
      assert.deepEqual(test_case, {
        id: '',
        name: 'NUnit.Tests.Assemblies.MockTestFixture.MockTest2',
        total: 0,
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        duration: 0,
        status: 'PASS',
        failure: '',
        stack_trace: '',
        tags: [ 'MockCategory' ],
        metadata: { Categories: 'FixtureCategory,MockCategory', Severity: 'Critical' },
        steps: [],
        attachments: []
      });
    });

  });

  context('NUnit V3', () => {
    before( () => {
      result = parse({ type: 'nunit', files: [`${testDataPath}/nunit_v3.xml`] });
    });

    it('Should calculate totals', () => {
      // totals on the testresult
      assert.equal(result.total, 19);
      assert.equal(result.passed, 13);
      assert.equal(result.failed, 2);
      assert.equal(result.errors, 1);
      assert.equal(result.skipped, 3);

      // compare sum of suite totals to testresult
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.total},0), result.total);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.passed},0), result.passed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.failed},0), result.failed);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.errors},0), result.errors);
      assert.equal( result.suites.reduce( (total, suite) => { return total + suite.skipped},0), result.skipped);
    });

    it('Should express durations in milliseconds', () => {
      let totalDuration = result.duration;
      let suiteDuration = result.suites[0].duration; // sample
      let testDuration  = result.suites[0].cases[0].duration; // sample
      assert.equal(totalDuration > 100, true, `TestResult duration should be more than 100 millisecond (${totalDuration}`);
      assert.equal(suiteDuration > 100, true, `Suite duration should be more than 100 milliseconds (${suiteDuration})`);
      assert.equal(testDuration > 10, true,  `Test duration should be more than 10 milliseconds (${testDuration})`);
    });

    it('Should include fullnames for testsuites and testcases', () => {
      assert.equal(result.suites[0].name, "NUnit.Tests.Assemblies.MockTestFixture");
      assert.equal(result.suites[0].cases[0].name, "NUnit.Tests.Assemblies.MockTestFixture.FailingTest")
    });

    it('Should map results correctly', () => {
      assert.equal(result.suites.length, 9);

      // assemblies.mocktestfixture
      assert.equal(result.suites[0].status, "FAIL");
      assert.equal(result.suites[0].cases[0].status, "FAIL");
      assert.equal(result.suites[0].cases[1].status, "FAIL"); // inconclusive
      assert.equal(result.suites[0].cases[2].status, "PASS");
      assert.equal(result.suites[0].cases[3].status, "PASS");
      assert.equal(result.suites[0].cases[4].status, "PASS");
      assert.equal(result.suites[0].cases[5].status, "SKIP"); // ignored
      assert.equal(result.suites[0].cases[6].status, "SKIP"); // invalid
      assert.equal(result.suites[0].cases[7].status, "SKIP"); // invalid
      assert.equal(result.suites[0].cases[8].status, "ERROR"); // error
      assert.equal(result.suites[0].cases[9].status, "PASS");

      // badfixture
      assert.equal(result.suites[1].cases.length, 0); // invalid test cases
      assert.equal(result.suites[1].status, "SKIP"); // v3 treats these as skipped

      // fixturewithTestCases
      assert.equal(result.suites[2].status, "PASS");
      assert.equal(result.suites[4].cases[0].status, "PASS");
      assert.equal(result.suites[4].cases[1].status, "PASS");

      // ignoredfixture
      assert.equal(result.suites[3].cases.length, 0); // invalid test cases
      assert.equal(result.suites[3].status, "SKIP"); // v3 treats these as skipped

      // parameterizedfixture(42)
      assert.equal(result.suites[4].status, "PASS");
      assert.equal(result.suites[4].cases[0].name, "NUnit.Tests.ParameterizedFixture(42).Test1");
      assert.equal(result.suites[4].cases[0].status, "PASS");
      assert.equal(result.suites[4].cases[1].status, "PASS");

      // parameterizedfixture(5)
      assert.equal(result.suites[5].status, "PASS");
      assert.equal(result.suites[5].cases[0].name, "NUnit.Tests.ParameterizedFixture(5).Test1");
      assert.equal(result.suites[5].cases[0].status, "PASS");
      assert.equal(result.suites[5].cases[1].status, "PASS");

      // onetestcase
      assert.equal(result.suites[6].status, "PASS");
      assert.equal(result.suites[6].cases[0].status, "PASS");

      // testassembly.mocktestfixture
      assert.equal(result.suites[7].status, "PASS");
      assert.equal(result.suites[7].cases[0].status, "PASS");
    });

    it('Should include reason for invalid tests', () => {
      // test-case 1009 has a reason for being invalid.
      const testcase = result.suites[0].cases[7];
      assert.equal(testcase.failure, "No arguments were provided");
    });

    it('Should include stack trace for failed tests.', () => {
      const testcase = result.suites[0].cases[8];
      assert.equal(testcase.failure, "System.ApplicationException : Intentional Exception");
      assert.notEqual(testcase.stack_trace, '');
    });

    it('Should support properties defined at the Assembly level', () => {
      const test_case = testCaseWithNoProperties = result.suites[2].cases[0];
      assert.deepEqual(test_case, {
        id: 1027,
        name: 'NUnit.Tests.FixtureWithTestCases.MethodWithParameters(2,2)',
        total: 0,
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        duration: 6,
        status: 'PASS',
        failure: '',
        stack_trace: '',
        tags: [],
        metadata: {
          _APPDOMAIN: 'test-domain-mock-assembly.dll',
          _PID: 11928
        },
        steps: [],
        attachments: []
      });
    });

    it('Should include both suite and assembly level properties', () => {
      const test_case = result.suites[0].cases[0];
      assert.deepEqual(test_case, {
        id: 1005,
        name: 'NUnit.Tests.Assemblies.MockTestFixture.FailingTest',
        total: 0,
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        duration: 23,
        status: 'FAIL',
        failure: 'Intentional failure',
        stack_trace: "   at NUnit.Framework.Assert.Fail(String message, Object[] args) in D:\\Dev\\NUnit\\nunit-3.0\\work\\NUnitFramework\\src\\framework\\Assert.cs:line 142\n   at NUnit.Framework.Assert.Fail(String message) in D:\\Dev\\NUnit\\nunit-3.0\\work\\NUnitFramework\\src\\framework\\Assert.cs:line 152\n   at NUnit.Tests.Assemblies.MockTestFixture.FailingTest() in D:\\Dev\\NUnit\\nunit-3.0\\work\\NUnitFramework\\src\\mock-assembly\\MockAssembly.cs:line 121",
        tags: [],
        metadata: {
          Categories: "FixtureCategory",
          _APPDOMAIN: 'test-domain-mock-assembly.dll',
          _PID: 11928,
          Description: 'Fake Test Fixture'
        },
        steps: [],
        attachments: []
      });
    });

    it('Should include properties from assembly, suite and test case', () => {
      const test_case = result.suites[0].cases[2];
      assert.deepEqual(test_case, {
        id: 1001,
        name: 'NUnit.Tests.Assemblies.MockTestFixture.MockTest1',
        total: 0,
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        duration: 0,
        status: 'PASS',
        failure: '',
        stack_trace: '',
        tags: [],
        metadata: {
          _PID: 11928,
          _APPDOMAIN: 'test-domain-mock-assembly.dll',
          Categories: 'FixtureCategory',
          Description: 'Mock Test #1'
        },
        steps: [],
        attachments: []
      });
    });

    it('Should allow multiple categories to be specified', () => {
      const test_case = result.suites[0].cases[3];
      assert.deepEqual(test_case, {
        id: 1002,
        name: 'NUnit.Tests.Assemblies.MockTestFixture.MockTest2',
        total: 0,
        passed: 0,
        failed: 0,
        errors: 0,
        skipped: 0,
        duration: 0,
        status: 'PASS',
        failure: '',
        stack_trace: '',
        tags: [],
        metadata: {
          _PID: 11928,
          _APPDOMAIN: 'test-domain-mock-assembly.dll',
          Categories: 'FixtureCategory,MockCategory',
          Description: 'This is a really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really long description',
          Severity: 'Critical'
        },
        steps: [],
        attachments: []
      });
    });

    it('Should include attachments associated to test-case', () => {
      const testCaseWithAttachments = result.suites[8].cases[0];
      assert.equal(testCaseWithAttachments.attachments.length, 1);
      assert.equal(testCaseWithAttachments.attachments[0].path, "c:\\absolute\\filepath\\dummy.txt")
      assert.equal(testCaseWithAttachments.attachments[0].name, "my description")
    });

    it('Should report overall status as PASS if all tests pass', () => {
      const result = parse({ type: 'nunit', files: [`${testDataPath}/nunit_v3_pass.xml`] });
      assert.equal(result.status, "PASS");
    });

    it('Should report overall status as FAIL if any tests fail', () => {
      const result = parse({ type: 'nunit', files: [`${testDataPath}/nunit_v3_fail.xml`] });
      assert.equal(result.status, "FAIL");
    });

    it('Should handle test results with no test cases', () => {
      const result = parse({ type: 'nunit', files: [`${testDataPath}/empty-results.xml`] });
      assert.equal(result.total, 0);
      assert.equal(result.passed, 0);
      assert.equal(result.failed, 0);
      assert.equal(result.skipped, 0);
      assert.equal(result.suites.length, 0);
      assert.equal(result.status, "PASS");
    });

  });

  function sumCases(result, predicate) {
    return flattenTestCases(result).reduce( (total, testcase) => { return total + predicate(testcase)}, 0);
  }

  function findTestCases(result, predicate) {
    return flattenTestCases(result).filter( testCase => {return predicate() == true});
  }

  function flattenTestCases(result) {
    let items = [];
    result.suites.forEach( s => {
      s.cases.forEach( c => {
          items.push(c);
      });
    });
    return items;
  }

});