const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - Cucumber Json', () => {

  const testDataPath = "tests/data/cucumber"

  it('single suite with single test', () => {
    // lightweight regression
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/single-suite-single-test.json`] });
    assert.deepEqual(result, {
      id: '',
      name: '',
      total: 1,
      passed: 1,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 1.59,
      startTime: undefined,
      endTime: undefined,
      status: 'PASS',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: 'Addition',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 1.59,
          startTime: undefined,
          endTime: undefined,
          status: 'PASS',
          tags: ["@blue", "@slow"],
          metadata: { suite: "1234" },
          cases: [
            {
              attachments: [],
              duration: 1.59,
              startTime: undefined,
              endTime: undefined,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "Addition of two numbers",
              passed: 3,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              tags: ["@green", "@fast", "@blue", "@slow"],
              metadata: { "suite": "1234", testCase: "1234" },
              steps: [
                {
                  "id": "",
                  "name": "Given I have number 6 in calculator",
                  "duration": 1.21,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "When I entered number 7",
                  "duration": 0.14,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                },
                {
                  "id": "",
                  "name": "Then I should see result 13",
                  "duration": 0.24,
                  "status": "PASS",
                  "failure": "",
                  "stack_trace": ""
                }
              ],
              total: 3
            }
          ]
        }
      ]
    });
  });

  it('captures feature, scenario and step details', () => {
    // demonstrate reading a file with one suite and one test case
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/single-suite-single-test.json`] });
    assert.equal(result.total, 1);
    assert.equal(result.passed, 1);
    assert.equal(result.suites.length, 1);
    // feature details are captured as suite
    assert.equal(result.suites[0].name, 'Addition');
    assert.equal(result.suites[0].status, 'PASS');
    assert.equal(result.suites[0].cases.length, 1);
    // scenario details are captured as test case
    assert.equal(result.suites[0].cases[0].name, 'Addition of two numbers');
    assert.equal(result.suites[0].cases[0].status, 'PASS');
    // steps within the scenario are captured as testcase steps
    assert.equal(result.suites[0].cases[0].total, 3);
    assert.equal(result.suites[0].cases[0].passed, 3);
    assert.equal(result.suites[0].cases[0].steps.length, 3);
    assert.equal(result.suites[0].cases[0].steps[0].name, 'Given I have number 6 in calculator');
    assert.equal(result.suites[0].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[1].name, 'When I entered number 7');
    assert.equal(result.suites[0].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[2].name, 'Then I should see result 13');
    assert.equal(result.suites[0].cases[0].steps[2].status, 'PASS');
  });

  it('aggregates status totals across multiple suites', () => {
    // demonstrate reading a file with multiple suites
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    // top level totals roll up from suites
    assert.equal(result.total, 3);
    assert.equal(result.passed, 2);
    assert.equal(result.failed, 1);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    // suite level totals are calculated from test cases
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].total, 2);
    assert.equal(result.suites[0].passed, 1);
    assert.equal(result.suites[0].failed, 1);
    assert.equal(result.suites[0].errors, 0);
    assert.equal(result.suites[0].skipped, 0);
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].steps.length, 3);
    assert.equal(result.suites[0].cases[1].total, 3);
    assert.equal(result.suites[0].cases[1].passed, 3);
    assert.equal(result.suites[0].cases[1].failed, 0);
    assert.equal(result.suites[0].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[2].status, 'FAIL');
    assert.equal(result.suites[0].cases[1].status, 'PASS');
    assert.equal(result.suites[1].total, 1);
    assert.equal(result.suites[1].passed, 1);
    assert.equal(result.suites[1].failed, 0);
    assert.equal(result.suites[1].cases[0].status, 'PASS');
    assert.equal(result.suites[1].cases[0].steps.length, 3);
    assert.equal(result.suites[1].cases[0].total, 3);
    assert.equal(result.suites[1].cases[0].passed, 3);
    assert.equal(result.suites[1].cases[0].failed, 0);
    assert.equal(result.suites[1].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[1].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[1].cases[0].steps[2].status, 'PASS');
  });

  it('aggregates duration across multiple suites', () => {
    // demonstrate that durations are summed from step executions
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });

    // total duration is sum of suite durations
    assert.equal(result.duration, 3.37); // 2.85 + 0.52
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].duration, 2.85);
    assert.equal(result.suites[1].duration, 0.52);
    // suite duration is sum of test case durations
    // suite 0 = 2.85 = 2.56 + 0.29
    assert.equal(result.suites[0].cases.length, 2);
    assert.equal(result.suites[0].cases[0].duration, 2.56); // 1.1 + 0.13 + 1.33
    assert.equal(result.suites[0].cases[0].steps[0].duration, 1.1);
    assert.equal(result.suites[0].cases[0].steps[1].duration, 0.13);
    assert.equal(result.suites[0].cases[0].steps[2].duration, 1.33);
    
    // suite 1 = 0.52 = 0.08 + 0.13 + 0.31
    assert.equal(result.suites[1].cases.length, 1);
    assert.equal(result.suites[1].cases[0].duration, 0.52);
    assert.equal(result.suites[1].cases[0].steps[0].duration, 0.08);
    assert.equal(result.suites[1].cases[0].steps[1].duration, 0.13);
    assert.equal(result.suites[1].cases[0].steps[2].duration, 0.31);
  });

  it('handles empty suite report', () => {
    // demonstrate reading a file with one empty suite
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/empty-suite.json`] });
    assert.equal(result.total, 0);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.duration, 0);
    assert.equal(result.status, 'PASS'); 
    assert.equal(result.suites.length, 0);
  });

  it('captures failing step details', () => {
    // demonstrate step failure details are captured
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/multiple-suites-multiple-tests.json`] });
    // failure status is reflected at all levels
    assert.equal(result.failed, 1);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].name, 'Addition');
    assert.equal(result.suites[0].failed, 1);
    // failure is captured at test case level
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].failure, "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n");
    assert.equal(result.suites[0].cases[0].stack_trace, "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)");
    // failure is captured at step level
    assert.equal(result.suites[0].cases[0].steps.length, 3);
    assert.equal(result.suites[0].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[2].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].steps[2].failure, "AssertionError [ERR_ASSERTION]: 13 == 14\n    + expected - actual\n\n    -13\n    +14\n\n");
    assert.equal(result.suites[0].cases[0].steps[2].stack_trace, "    at CustomWorld.<anonymous> (D:\\workspace\\nodejs\\cc-tests\\features\\support\\steps.js:18:12)");
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/multiple-suites-multiple-tests.json`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'cucumber', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'cucumber', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('test with before and after', () => {
    // demonstrates before/after steps are captured as steps within the test case
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-before-and-after.json`] });

    assert.equal(result.suites[0].cases[0].steps.length, 5);
    assert.equal(result.suites[0].cases[0].total, 5);
    assert.equal(result.suites[0].cases[0].passed, 5);
    assert.equal(result.suites[0].cases[0].steps[0].name, 'Before ');
    assert.equal(result.suites[0].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[1].name, 'Given I have number 6 in calculator');
    assert.equal(result.suites[0].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[2].name, 'When I entered number 7');
    assert.equal(result.suites[0].cases[0].steps[2].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[3].name, 'Then I should see result 13');
    assert.equal(result.suites[0].cases[0].steps[3].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[4].name, 'After ');
    assert.equal(result.suites[0].cases[0].steps[4].status, 'PASS');
  });

  it('test with skipped steps after failure', () => {
    // demonstrates that steps that are skipped due to prior failures are captured correctly
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-skipped-steps.json`] });

    assert.equal(result.failed, 1);
    assert.equal(result.skipped, 0);
    assert.equal(result.suites[0].cases[0].steps.length, 4);
    assert.equal(result.suites[0].cases[0].passed, 2);
    assert.equal(result.suites[0].cases[0].failed, 1);
    assert.equal(result.suites[0].cases[0].skipped, 1);
    assert.equal(result.suites[0].cases[0].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].steps[0].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[1].status, 'PASS');
    assert.equal(result.suites[0].cases[0].steps[2].status, 'FAIL');
    assert.equal(result.suites[0].cases[0].steps[3].status, 'SKIP'); // skipped due to prior failure
  });

  it('handles skipped scenarios', () => {
    // demonstrates that skipped scenarios are handled correctly
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/skipped-scenario.json`] });
    assert.equal(result.total, 1);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.suites[0].failed, 0);
    assert.equal(result.suites[0].skipped, 1);
    assert.equal(result.suites[0].cases[0].status, 'SKIP');
  });

  it('test with metadata', () => {
    // demonstrates that metadata at suite and case level is captured correctly
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/suites-with-metadata.json`] });

    // suite-level tags are captured
    assert.equal(result.suites[0].tags.length, 2);
    assert.equal(result.suites[0].tags[0], '@blue');
    assert.equal(result.suites[0].tags[1], '@slow');

    // suite-level metadata is captured
    assert.equal(result.suites[0].metadata.suite, '1234');
    assert.equal(result.suites[0].metadata.device, 'Desktop');
    assert.equal(result.suites[0].metadata.platform.name, 'Windows');
    assert.equal(result.suites[0].metadata.platform.version, '11');
    assert.equal(result.suites[0].metadata.browser.name, 'firefox');

    // test-case-level tags are captured, including inherited tags from suite
    assert.equal(result.suites[0].cases[0].tags.length, 4);
    assert.equal(result.suites[0].cases[0].tags[0], '@green');
    assert.equal(result.suites[0].cases[0].tags[1], '@fast');
    assert.equal(result.suites[0].cases[0].tags[2], '@blue'); // inherited
    assert.equal(result.suites[0].cases[0].tags[3], '@slow'); // inherited

    // test-case-level metadata is captured, including inherited metadata from suite
    assert.equal(result.suites[0].cases[0].metadata.testCase, '1234');
    assert.equal(result.suites[0].cases[0].metadata.suite, '1234');
  });

  it('test with attachments', () => {
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-attachments.json`] });
    assert.equal(result.suites[0].cases[0].attachments.length, 3);
    assert.equal(result.suites[0].cases[0].attachments[0].name, 'screenshot.png');
    assert.equal(result.suites[0].cases[0].attachments[0].path, 'tests/data/attachments/screenshot.png');
    assert.match(result.suites[0].cases[0].attachments[1].name, /I_should_see_result_13-\d+.png/);
    assert.match(result.suites[0].cases[0].attachments[1].path, /.*testbeats.*attachments.+I_should_see_result_13-\d+.png/);
    assert.match(result.suites[0].cases[0].attachments[2].name, /I_should_see_result_13-\d+.json/);
    assert.match(result.suites[0].cases[0].attachments[2].path, /.*testbeats.*attachments.*I_should_see_result_13-\d+.json/);
  });

  it('test with invalid attachments', () => {
    // demonstrates ignoring invalid attachment entries
    const result = parse({ type: 'cucumber', files: [`${testDataPath}/test-with-invalid-attachments.json`] });

    // two illegal attachments are ignored
    assert.equal(result.suites[0].cases[0].attachments.length, 1);
    assert.equal(result.suites[0].cases[0].attachments[0].name, 'screenshot.png');
    assert.equal(result.suites[0].cases[0].attachments[0].path, 'tests/data/attachments/screenshot.png');
  });

});
