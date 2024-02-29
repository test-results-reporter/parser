const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

// assemble a fully qualified test name (class.name)
function getFullTestName(raw) {
  return "".concat(raw["@_class"], ".", raw["@_name"]);
}

// create a mapping between fully qualified test name and and group
function getSuiteGroups(rawSuite) {
  let testCaseToGroupMap = new Map();

  if (rawSuite.groups && rawSuite.groups.group.length > 0) {
    let raw_groups = rawSuite.groups.group;
    for (let i = 0; i < raw_groups.length; i++) {
      let group_methods = raw_groups[i].method;
      let groupName = raw_groups[i]["@_name"];
      for (let j = 0; j < group_methods.length; j++) {
        let method = group_methods[j];
        let key = getFullTestName(method);
        if (!testCaseToGroupMap.has(key)) {
          testCaseToGroupMap.set(key, []);
        }
        testCaseToGroupMap.get(key).push(groupName);
      }
    }
  }
  return testCaseToGroupMap;
}

function getTestCase(rawCase, testCaseToGroupMap) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_duration-ms"];
  test_case.status = rawCase["@_status"];
  const key = getFullTestName(rawCase);
  if (testCaseToGroupMap.has(key)) {
    let groups = testCaseToGroupMap.get(key);
    test_case.meta_data.set("groups", groups.join(","));
    groups.forEach(group => {
      test_case.meta_data.set(group, "");
    })
  }
  if (rawCase.exception) {
    test_case.setFailure(rawCase.exception[0].message);
  }
  if (rawCase['@_retried'] === true) {
    test_case.status = 'RETRY';
  }
  return test_case;
}

function getTestSuiteFromTest(rawTest, testCaseToGroupMap) {
  const suite = new TestSuite();
  suite.name = rawTest['@_name'];
  suite.duration = rawTest['@_duration-ms'];
  const rawTestMethods = [];
  const rawClasses = rawTest.class;
  for (let i = 0; i < rawClasses.length; i++) {
    let testMethods = rawClasses[i]['test-method'].filter(raw => !raw['@_is-config']);
    testMethods.forEach(testMethod => {
      testMethod["@_class"] = rawClasses[i]["@_name"]; // push className onto test-method
    });
    rawTestMethods.push(...testMethods);
  }
  suite.total = rawTestMethods.length;
  suite.passed = rawTestMethods.filter(test => test['@_status'] === 'PASS').length;
  suite.failed = rawTestMethods.filter(test => test['@_status'] === 'FAIL').length;
  suite.skipped = rawTestMethods.filter(test => test['@_status'] === 'SKIP').length;
  const retried = rawTestMethods.filter(test => test['@_retried'] === true).length;
  if (retried) {
    suite.total = suite.total - retried;
    suite.skipped = suite.skipped - retried;
  }
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  for (let i = 0; i < rawTestMethods.length; i++) {
    suite.cases.push(getTestCase(rawTestMethods[i], testCaseToGroupMap));
  }
  return suite;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite['@_name'];
  suite.duration = rawSuite['@_duration-ms'];
  const rawTests = rawSuite.test;
  const rawTestMethods = [];
  const testCaseToGroupMap = getSuiteGroups(rawSuite);
  for (let i = 0; i < rawTests.length; i++) {
    const rawTest = rawTests[i];
    const rawClasses = rawTest.class;
    for (let j = 0; j < rawClasses.length; j++) {
      let testMethods = rawClasses[j]['test-method'].filter(raw => !raw['@_is-config']);
      testMethods.forEach(testMethod => {
        testMethod["@_class"] = rawClasses[j]["@_name"]; // push className onto test-method
      });
      rawTestMethods.push(...testMethods);
    }
  }
  suite.total = rawTestMethods.length;
  suite.passed = rawTestMethods.filter(test => test['@_status'] === 'PASS').length;
  suite.failed = rawTestMethods.filter(test => test['@_status'] === 'FAIL').length;
  suite.skipped = rawTestMethods.filter(test => test['@_status'] === 'SKIP').length;
  const retried = rawTestMethods.filter(test => test['@_retried'] === true).length;
  if (retried) {
    suite.total = suite.total - retried;
    suite.skipped = suite.skipped - retried;
  }
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  for (let i = 0; i < rawTestMethods.length; i++) {
    suite.cases.push(getTestCase(rawTestMethods[i], testCaseToGroupMap));
  }
  return suite;
}

function parse(file) {
  // TODO - loop through files
  const json = getJsonFromXMLFile(file);
  const result = new TestResult();
  const results = json['testng-results'][0];
  result.failed = results['@_failed'];
  result.passed = results['@_passed'];
  result.total = results['@_total'];
  if (results['@_retried']) {
    result.retried = results['@_retried'];
    result.total = result.total - result.retried;
  }
  if (results['@_skipped']) {
    result.skipped = results['@_skipped'];
    // result.total = result.total - result.skipped;
  }
  const ignored = results['@_ignored'];
  if (ignored) {
    result.total = result.total - ignored;
  }

  const suites = results.suite;
  const suitesWithTests = suites.filter(suite => suite.test && suite['@_duration-ms'] > 0);

  if (suitesWithTests.length > 1) {
    for (let i = 0; i < suitesWithTests.length; i++) {
      const _suite = getTestSuite(suitesWithTests[i]);
      result.suites.push(_suite);
      result.duration += _suite.duration;
      if (!result.name) {
        result.name = _suite.name;
      }
    }
  } else if (suitesWithTests.length === 1) {
    const suite = suitesWithTests[0];
    const testCaseToGroupMap = getSuiteGroups(suite);
    result.name = suite['@_name'];
    result.duration = suite['@_duration-ms'];
    const rawTests = suite.test;
    const rawTestsWithClasses = rawTests.filter(_rawTest => _rawTest.class);
    for (let i = 0; i < rawTestsWithClasses.length; i++) {
      result.suites.push(getTestSuiteFromTest(rawTestsWithClasses[i], testCaseToGroupMap));
    }
  } else if (suitesWithTests.length === 0){
    const suite = suites[0];
    result.name = suite['@_name'];
    result.duration = suite['@_duration-ms'];
    console.log("No suites with tests found");
  }
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}


module.exports = {
  parse
}
