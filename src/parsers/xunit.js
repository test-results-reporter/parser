const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

function getTestCase(rawCase) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_time"] * 1000;
  if(rawCase["@_result"] == "Skip")
  {
    test_case.status = 'SKIP';
  }
  else if (rawCase.failure && rawCase.failure.length > 0) {
    test_case.status = 'FAIL';
    test_case.setFailure(rawCase.failure[0]["message"]);
  }   
  else {
    test_case.status = 'PASS';
  }
  if(rawCase.traits && rawCase.traits.trait && rawCase.traits.trait.length > 0) {
    const traits = rawCase.traits.trait;
    for(let i = 0; i < traits.length; i++) {
      test_case.meta_data.set( traits[i]["@_name"], traits[i]["@_value"]);
    }
  }

  return test_case;
}

function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite["@_name"];
  suite.total = rawSuite["@_total"];
  suite.failed = rawSuite["@_failed"];
  suite.passed = rawSuite["@_passed"];
  suite.duration = rawSuite["@_time"]  * 1000;
  suite.skipped = rawSuite["@_skipped"];
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  suite.status = suite.skipped == suite.total ? 'PASS' : suite.status;
  const raw_test_cases = rawSuite.test;
  if (raw_test_cases) {
    for(let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i]));
    }
  }
  return suite;
}

function getTestResult(json) {
  const result = new TestResult();
  const rawResult = json["assemblies"][0]["assembly"][0];
  
  result.name = rawResult["@_name"];
  result.total = rawResult["@_total"];
  result.passed = rawResult["@_passed"];
  result.failed = rawResult["@_failed"];
  const errors = rawResult["@_errors"];
  if (errors) {
    result.errors = errors;
  }
  const skipped = rawResult["@_skipped"];
  if (skipped) {
    result.skipped = skipped;
  }
  result.duration = rawResult["@_time"] * 1000;
  const rawSuites = rawResult["collection"];
  
  
  for (let i = 0; i < rawSuites.length; i++) {
    result.suites.push(getTestSuite(rawSuites[i]));
  }
  result.status = (result.total - result.skipped) === result.passed ? 'PASS' : 'FAIL';
  return result;
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json);
}

module.exports = {
  parse
}