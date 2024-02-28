const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - MSTest', () => {

    const testDataPath = "tests/data/mstest";
    var result;

    before(() => {
        result = parse({ type: 'mstest', files: [`${testDataPath}/testresults.trx`] });
    });

    it('Should calculate totals', () => {
        assert.equal(result.total, 12);
        assert.equal(result.passed, 7);
        assert.equal(result.failed, 3);
        assert.equal(result.skipped, 2);

        assert.equal(result.suites.length, 3);
        //assert.equal(result.duration > 0, true); // TODO: Fix
    })

    it('Should express durations in milliseconds', () => {
        //trx represents timestamps with microseconds
        //assert.equal(result.suites[0].cases[0].duration, 259.239); // TODO: Fix
    })

    it('Should map results correctly', () => {
        assert.equal(result.suites[0].cases[0].status, "FAIL");
        assert.equal(result.suites[0].cases[1].status, "SKIP"); // inconclusive
        assert.equal(result.suites[0].cases[2].status, "PASS");
        assert.equal(result.suites[0].cases[3].status, "PASS");
        assert.equal(result.suites[0].cases[4].status, "PASS");
        assert.equal(result.suites[0].cases[5].status, "SKIP"); // ignore
        assert.equal(result.suites[0].cases[6].status, "FAIL"); // not runnable
        assert.equal(result.suites[0].cases[7].status, "FAIL"); // exception
        assert.equal(result.suites[0].cases[8].status, "PASS");

        assert.equal(result.suites[1].cases[0].status, "PASS"); // datarow
    });

    it('Should include fullnames for testsuites and testcases', () => {
        assert.equal(result.suites[0].name, "MSTestSample.MockTestFixture");
        assert.equal(result.suites[0].cases[0].name, "MSTestSample.MockTestFixture.FailingTest");
    });

    it('Should include failure and stack trace for failed test', () => {
        assert.equal(result.suites[0].cases[0].failure, 'Assert.Fail failed.')
        assert.equal(result.suites[0].cases[0].stack_trace, 'at MSTestSample.MockTestFixture.FailingTest() in C:\\dev\\code\\_Experiments\\MSTestSample\\UnitTest1.cs:line 12&#xD;');
    });

    it('Should include categories from suite', () => {
        const testCaseInheritedCategories = result.suites[0].cases[0];
        assert.equal(testCaseInheritedCategories.meta_data.has("FixtureCategory"), true);
        assert.equal(testCaseInheritedCategories.meta_data.get("Categories"), "FixtureCategory");
    })

    it('Should combine categories from suite and case', () => {
        const testCaseWithCategories = result.suites[0].cases[3];
        assert.equal(testCaseWithCategories.meta_data.has("FixtureCategory"), true);
        assert.equal(testCaseWithCategories.meta_data.has("MockCategory"), true);
        assert.equal(testCaseWithCategories.meta_data.get("Categories"), "FixtureCategory,MockCategory");
    });

    it('Should include ResultFiles as test case attachments', () => {
        const testSuiteWithAttachments = result.suites[2];
        let expectedPath1 = resolveExpectedResultFilePath("238c26aa-9963-4623-aeda-95ef9a6799d0", "dummy1.txt");
        let expectedPath2 = resolveExpectedResultFilePath("2b2b0f58-3d88-432c-9955-1040315f96e9", "dummy2.txt");
        let expectedPath3 = resolveExpectedResultFilePath("2b2b0f58-3d88-432c-9955-1040315f96e9", "dummy3.txt");

        assert.equal(testSuiteWithAttachments.cases[0].attachments.length, 1);
        assert.equal(testSuiteWithAttachments.cases[0].attachments[0].path, expectedPath1);

        assert.equal(testSuiteWithAttachments.cases[1].attachments.length, 2);
        assert.equal(testSuiteWithAttachments.cases[1].attachments[0].path, expectedPath2)
        assert.equal(testSuiteWithAttachments.cases[1].attachments[1].path, expectedPath3)
    });

    function resolveExpectedResultFilePath(executionId, filePath) {
        return path.join(
            "bryan.b.cook_MYCOMPUTER_2023-11-12_19_21_51", 
            "In", 
            executionId, 
            "MYCOMPUTER",
            filePath);
    }

});