const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

const RESULT_MAP = {
  Passed: "PASS",
  Failed: "FAIL",
  NotExecuted: "SKIP",
}

function populateMetaData(rawElement, map) {
  if (rawElement.TestCategory && rawElement.TestCategory.TestCategoryItem) {
    let rawCategories = rawElement.TestCategory.TestCategoryItem;
    for (let i = 0; i < rawCategories.length; i++) {
      let categoryName = rawCategories[i]["@_TestCategory"];
      map.set(categoryName, "");

      // create comma-delimited list of categories
      if (map.has("Categories")) {
        map.set("Categories", map.get("Categories").concat(",", categoryName));
      } else {
        map.set("Categories", categoryName);
      }
    }
  }

  // as per https://github.com/microsoft/vstest/issues/2480:
  // - properties are supported by the XSD but are not included in TRX Visual Studio output
  // - including support for properties because third-party extensions might generate this data
  if (rawElement.Properties) {
    let rawProperties = rawElement.Properties.Property;
    for (let i = 0; i < rawProperties.length; i++) {
      let key = rawProperties[i].Key ?? "not-set";
      let val = rawProperties[i].Value ?? "";
      map.set(key, val);
    }
  }
}

function getTestResultDuration(rawTestResult) {
  // durations are represented in a timeformat with 7 digit microsecond precision
  // TODO: introduce d3-time-format after https://github.com/test-results-reporter/parser/issues/42 is fixed.
  return 0;
}

function getTestCaseName(rawDefinition) {
  if (rawDefinition.TestMethod) {
    let className = rawDefinition.TestMethod["@_className"];
    let name = rawDefinition.TestMethod["@_name"];

    // attempt to produce fully-qualified name
    if (className) {
      className = className.split(",")[0]; // handle strong-name scenario (typeName, assembly, culture, version)
      return className.concat(".", name);
    } else {
      return name;
    }
  } else {
    throw new Error("Unrecognized TestDefinition");
  }
}

function getTestSuiteName(testCase) {
  // assume testCase.name is full-qualified namespace.classname.methodname
  let index = testCase.name.lastIndexOf(".");
  return testCase.name.substring(0, index);
}

function getTestCase(rawTestResult, definitionMap) {
  let id = rawTestResult["@_testId"];

  if (definitionMap.has(id)) {
    var rawDefinition = definitionMap.get(id);

    var testCase = new TestCase();
    testCase.id = id;
    testCase.name = getTestCaseName(rawDefinition);
    testCase.status = RESULT_MAP[rawTestResult["@_outcome"]];
    testCase.duration = getTestResultDuration(rawTestResult);

    // collect error messages
    if (rawTestResult.Output && rawTestResult.Output.ErrorInfo) {
      testCase.setFailure(rawTestResult.Output.ErrorInfo.Message);
      testCase.stack_trace = rawTestResult.Output.ErrorInfo.StackTrace ?? '';
    }
    // populate meta
    populateMetaData(rawDefinition, testCase.meta_data);

    return testCase;
  } else {
    throw new Error(`Unrecognized testId ${id ?? ''}`);
  }
}

function getTestDefinitionsMap(rawTestDefinitions) {
  let map = new Map();

  // assume all definitions are 'UnitTest' elements
  if (rawTestDefinitions.UnitTest) {
    let rawUnitTests = rawTestDefinitions.UnitTest;
    for (let i = 0; i < rawUnitTests.length; i++) {
      let rawUnitTest = rawUnitTests[i];
      let id = rawUnitTest["@_id"];
      if (id) {
        map.set(id, rawUnitTest);
      }
    }
  }

  return map;
}

function getTestResults(rawTestResults) {
  let results = [];

  // assume all results are UnitTestResult elements
  if (rawTestResults.UnitTestResult) {
    let unitTests = rawTestResults.UnitTestResult;
    for (let i = 0; i < unitTests.length; i++) {
      results.push(unitTests[i]);
    }
  }
  return results;
}

function getTestSuites(rawTestRun) {
  // outcomes + durations are stored in /TestRun/TestResults/*
  const testResults = getTestResults(rawTestRun.Results);
  // test names and details are stored in /TestRun/TestDefinitions/*
  const testDefinitions = getTestDefinitionsMap(rawTestRun.TestDefinitions);

  // trx does not include suites, so we'll reverse engineer them by
  // grouping results from the same className
  let suiteMap = new Map();

  for (let i = 0; i < testResults.length; i++) {
    let rawTestResult = testResults[i];
    let testCase = getTestCase(rawTestResult, testDefinitions);
    let suiteName = getTestSuiteName(testCase);

    if (!suiteMap.has(suiteName)) {
      let suite = new TestSuite();
      suite.name = suiteName;
      suiteMap.set(suiteName, suite);
    }
    suiteMap.get(suiteName).cases.push(testCase);
  }

  var result = [];
  for (let suite of suiteMap.values()) {
    suite.total = suite.cases.length;
    suite.passed = suite.cases.filter(i => i.status == "PASS").length;
    suite.failed = suite.cases.filter(i => i.status == "FAIL").length;
    suite.skipped = suite.cases.filter(i => i.status == "SKIP").length;
    suite.errors = suite.cases.filter(i => i.status == "ERROR").length;
    suite.duration = suite.cases.reduce((total, test) => { return total + test.duration }, 0);
    result.push(suite);
  }

  return result;
}

function getTestResult(json) {
  const rawTestRun = json.TestRun;

  let result = new TestResult();
  result.id = rawTestRun["@_id"];
  result.suites.push(...getTestSuites(rawTestRun));

  // calculate totals
  result.total = result.suites.reduce((total, suite) => { return total + suite.total }, 0);
  result.passed = result.suites.reduce((total, suite) => { return total + suite.passed }, 0);
  result.failed = result.suites.reduce((total, suite) => { return total + suite.failed }, 0);
  result.skipped = result.suites.reduce((total, suite) => { return total + suite.skipped }, 0);
  result.errors = result.suites.reduce((total, suite) => { return total + suite.errors }, 0);
  result.duration = result.suites.reduce((total, suite) => { return total + suite.duration }, 0);

  return result;
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json);
}

module.exports = {
  parse
}