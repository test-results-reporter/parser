const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - TestNG', () => {
  const testDataPath = "tests/data/testng"
  it('single suite with single test', () => {
    // TODO: verify timestamp differences between suites + tests
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'Default suite',
      total: 4,
      passed: 4,
      failed: 0,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 2000,
      startTime: new Date('2015-03-10T06:11:58.000Z'),
      endTime: new Date('2015-03-10T06:11:58.000Z'),
      status: 'PASS',
      tags: [],
      metadata: {},
      suites: [
        {
          id: '',
          name: 'Default test',
          total: 4,
          passed: 4,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 2000,
          startTime: new Date('2015-03-10T06:11:58.000Z'),
          endTime: new Date('2015-03-10T06:11:58.000Z'),
          status: 'PASS',
          tags: [],
          metadata: {},
          cases: [
            {
              attachments: [],
              id: '',
              name: 'c2',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              startTime: new Date('2015-03-10T11:41:58.000Z'),
              endTime: new Date('2015-03-10T11:41:58.000Z'),
              status: 'PASS',
              failure: '',
              stack_trace: '',
              tags: [],
              metadata: {},
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c3',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 10,
              startTime: new Date('2015-03-10T11:41:58.000Z'),
              endTime: new Date('2015-03-10T11:41:58.000Z'),
              status: 'PASS',
              failure: '',
              stack_trace: '',
              tags: [],
              metadata: {},
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c1',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              startTime: new Date('2015-03-10T11:41:58.000Z'),
              endTime: new Date('2015-03-10T11:41:58.000Z'),
              status: 'PASS',
              failure: '',
              stack_trace: '',
              tags: [],
              metadata: {},
              steps: []
            },
            {
              attachments: [],
              id: '',
              name: 'c4',
              total: 0,
              passed: 0,
              failed: 0,
              errors: 0,
              skipped: 0,
              duration: 0,
              startTime: new Date('2015-03-10T11:41:58.000Z'),
              endTime: new Date('2015-03-10T11:41:58.000Z'),
              status: 'PASS',
              failure: 'expected [true] but found [false]',
              stack_trace: '',
              tags: [],
              metadata: {},
              steps: []
            }
          ]
        }
      ]
    });
  });

  it('single suite with multiple tests', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite-multiple-tests.xml`] });

    assert.equal(result.name, "Regression Tests");
    assert.equal(result.total, 20); // todo: review how totals are calculated. shouldn't this be 10 (5+5)?
    assert.equal(result.passed, 8); // todo: review how totals are calculated. shouldn't this be 4 (2+2)?
    assert.equal(result.failed, 11); // todo: review how totals are calculated. shouldn't this be 6 (3+2)?
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.retried, 0);
    assert.equal(result.status, "FAIL");

    assert.equal(result.suites.length, 2); // 1 from single-suite + 2 from single-suite-multiple-tests
    assert.equal(result.suites[0].name, "desktop-chrome");   
    assert.ok(result.suites[0].duration > 0);
    assert.equal(result.suites[0].cases.length, 5);
    assert.equal(result.suites[0].cases[0].status, "FAIL");
    assert.equal(result.suites[0].cases[1].status, "PASS");
    assert.equal(result.suites[0].cases[2].status, "PASS");
    assert.equal(result.suites[0].cases[3].status, "FAIL");
    assert.equal(result.suites[0].cases[4].status, "FAIL");
    
    assert.equal(result.suites[1].name, "mobile-ios");
    assert.ok(result.suites[1].duration > 0);
    assert.equal(result.suites[1].cases.length, 5);
    assert.equal(result.suites[1].cases[0].status, "FAIL");
    assert.equal(result.suites[1].cases[1].status, "PASS");
    assert.equal(result.suites[1].cases[2].status, "PASS");
    assert.equal(result.suites[1].cases[3].status, "FAIL");
    assert.equal(result.suites[1].cases[4].status, "SKIP");
  });

  it('capture test started and completed timestamps (standard ISO-8601 format)', () => {
    // assume dateformat is default: yyyy-MM-dd’T’HH:mm:ss’Z' (ISO-8601/RFC-3339)
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite.xml`] });
    const testCase = result.suites[0].cases[1];
    assert.notEqual(testCase.startTime, undefined);
    assert.notEqual(testCase.endTime, undefined);
    assert.ok(testCase.startTime instanceof Date);
    assert.ok(testCase.endTime instanceof Date);
    assert.equal(testCase.endTime >= testCase.startTime, true);
  });

  it('capture test started and completed timestamps (treat Java format with abmigious timezone as local)', () => {
    // dateformat with "2021-10-21T15:00:41 IST" is not ISO-8601 compliant and creates ambigious timezones
    // eg: IST could be India Standard Time (UTC+5:30) or Irish Standard Time (UTC+1)
    //     EST could be Eastern Standard Time (UTC-5) or Australia Eastern Standard Time (UTC+10)
    // best to assume these are local times and strip off the timezone designator
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite-multiple-tests.xml`] });
    const testCase = result.suites[0].cases[1];
    assert.notEqual(testCase.startTime, undefined);
    assert.notEqual(testCase.endTime, undefined);
    assert.ok(testCase.startTime instanceof Date);
    assert.ok(testCase.endTime instanceof Date);
    assert.equal(testCase.endTime >= testCase.startTime, true);
  });

  it('captures suite started and complete timestamps', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite.xml`] });
    const suite = result.suites[0];
    assert.notEqual(suite.startTime, undefined);
    assert.notEqual(suite.endTime, undefined);
    assert.ok(suite.startTime instanceof Date);
    assert.ok(suite.endTime instanceof Date);
    assert.equal(suite.endTime >= suite.startTime, true);
  });

  it('captures overall test run started and complete timestamps', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-suite.xml`] });
    assert.notEqual(result.startTime, undefined);
    assert.notEqual(result.endTime, undefined);
    assert.ok(result.startTime instanceof Date);
    assert.ok(result.endTime instanceof Date);
    assert.equal(result.endTime >= result.startTime, true);
  });

  it('captures started and completed across multiple suites', () => {
    // TODO: verify timestamp differences between suites + tests
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-multiple-tests.xml`] });
    // inspect result
    assert.ok(result.startTime instanceof Date);
    assert.ok(result.endTime instanceof Date);
    assert.equal(result.endTime >= result.startTime, true);

    assert.ok(result.suites.length > 1);
    result.suites.forEach(suite => {
      assert.ok(suite.startTime instanceof Date);
      assert.ok(suite.endTime instanceof Date);
      assert.equal(suite.endTime >= suite.startTime, true);
    });
  });

  // todo: review totals when there are failures in setup or teardown
  // it('failures before test', () => {
  //   const result = parse({ type: 'testng', files: [`${testDataPath}/failures-setup.teardown.xml`] });
  //   // it looks like suite setup, test before/after methods are included in the totals, but not in the testcases
  //   // though failures before the test result in skipped test cases?
  // });

  it('multiple suites with single test', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-single-test.xml`] });

    assert.equal(result.total, 4);
    assert.equal(result.passed, 4);
    assert.equal(result.failed, 0);
    assert.equal(result.status, "PASS");
    assert.equal(result.duration, 2000);
    assert.equal(result.suites.length, 1); // empty suites are stripped out of results
    
    assert.equal(result.suites[0].name, "Default test");
    assert.equal(result.suites[0].cases.length, 4);
    assert.equal(result.suites[0].duration, 2000);
    assert.equal(result.suites[0].cases[0].name, "c2");
    assert.equal(result.suites[0].cases[0].status, "PASS");
    assert.equal(result.suites[0].cases[1].name, "c3");
    assert.equal(result.suites[0].cases[1].status, "PASS");
    assert.equal(result.suites[0].cases[2].name, "c1");
    assert.equal(result.suites[0].cases[2].status, "PASS");
    assert.equal(result.suites[0].cases[3].name, "c4");
    assert.equal(result.suites[0].cases[3].status, "PASS");
  });

  it('multiple suites with multiple tests', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-multiple-tests.xml`] });

    assert.equal(result.total, 8);
    assert.equal(result.passed, 8);
    assert.equal(result.failed, 0);
    assert.equal(result.status, "PASS");
    assert.equal(result.duration, 4000);

    assert.equal(result.suites.length, 2); // empty suites are stripped out of results
    
    assert.equal(result.suites[0].name, "Default suite 1");
    assert.equal(result.suites[0].cases.length, 4);
    assert.equal(result.suites[0].duration, 2000);
    assert.equal(result.suites[0].cases[0].name, "c2");
    assert.equal(result.suites[0].cases[0].status, "PASS");
    assert.equal(result.suites[0].cases[1].name, "c3");
    assert.equal(result.suites[0].cases[1].status, "PASS");
    assert.equal(result.suites[0].cases[2].name, "c1");
    assert.equal(result.suites[0].cases[2].status, "PASS");
    assert.equal(result.suites[0].cases[3].name, "c4");
    assert.equal(result.suites[0].cases[3].status, "PASS");
    
    assert.equal(result.suites[1].name, "Default suite");
    assert.equal(result.suites[1].cases.length, 4);
    assert.equal(result.suites[1].duration, 2000);
    assert.equal(result.suites[1].cases[0].name, "c2");
    assert.equal(result.suites[1].cases[0].status, "PASS");
    assert.equal(result.suites[1].cases[1].name, "c3");
    assert.equal(result.suites[1].cases[1].status, "PASS");
    assert.equal(result.suites[1].cases[2].name, "c1");
    assert.equal(result.suites[1].cases[2].status, "PASS");
    assert.equal(result.suites[1].cases[3].name, "c4");
    assert.equal(result.suites[1].cases[3].status, "PASS");
  });

  it('multiple suites with retries', () => {
    // demonstrate that retries are handled correctly across multiple suites
    const result = parse({ type: 'testng', files: [`${testDataPath}/multiple-suites-retries.xml`] });
    assert.equal(result.name, "Staging - UI Smoke Test Run");
    assert.equal(result.total, 6); // retries are removed from total
    assert.equal(result.passed, 4);
    assert.equal(result.failed, 2);
    assert.equal(result.retried, 2);
    assert.equal(result.status, "FAIL");
    assert.equal(result.suites.length, 2);
    assert.equal(result.suites[0].cases.length, 4);
    assert.equal(result.suites[0].status, "FAIL");
    assert.equal(result.suites[0].cases[1].name, "PC");
    assert.equal(result.suites[0].cases[1].status, "RETRY");
    assert.equal(result.suites[0].cases[1].failure, "failed");
    assert.equal(result.suites[1].cases.length, 4);
    assert.equal(result.suites[1].status, "FAIL");
    assert.equal(result.suites[1].cases[1].name, "PC");
    assert.equal(result.suites[1].cases[1].status, "RETRY");
    assert.equal(result.suites[1].cases[1].failure, "failed");
  });

  it('results using glob', () => {
    // demonstrate that wildcard works picks up single-suite.xml + single-suite-mutliple-tests.xml
    // aggregates and merges results
    const result = parse({ type: 'testng', files: [`${testDataPath}/single-*.xml`] });
    assert.equal(result.name, "Regression Tests"); // take the name of first suite parsed
    assert.equal(result.total, 24);
    assert.equal(result.passed, 12);
    assert.equal(result.failed, 11);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 1);
    assert.equal(result.retried, 0);
    assert.equal(result.status, "FAIL");

    assert.equal(result.suites.length, 3); // 1 from single-suite + 2 from single-suite-multiple-tests
    assert.equal(result.suites[0].name, "desktop-chrome");   
    assert.equal(result.suites[0].cases.length, 5);
    assert.equal(result.suites[1].name, "mobile-ios");
    assert.equal(result.suites[1].cases.length, 5);
    assert.equal(result.suites[2].name, "Default test");
    assert.equal(result.suites[2].cases.length, 4);
  });

  it('single suite with no test', () => {
    const result = parse({ type: 'testng', files: [`${testDataPath}/empty-suite.xml`] });
    assert.equal(result.total, 0);
    assert.equal(result.passed, 0);
    assert.equal(result.failed, 0);
    assert.equal(result.errors, 0);
    assert.equal(result.skipped, 0);
    assert.equal(result.retried, 0);
    assert.equal(result.duration, 0);
    assert.equal(result.status, 'PASS');
    assert.equal(result.suites.length, 0);
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite.xml`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'testng', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'testng', files: [relativePath] });
    assert.notEqual(null, result2);
  });

  it('assign groups to testcases in single suite', () => {
    const result = parse({ type: 'testng', files: ['tests/data/testng/groups.xml'] });
    assert.deepEqual(result.suites[0].cases[0].tags, ['group1']);
    assert.deepEqual(result.suites[0].cases[1].tags, ['group1', 'group2']);
  });
});