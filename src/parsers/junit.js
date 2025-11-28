const path = require('path');
const { getStartAndEndTime, getDate } = require('./base.helpers');
const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const TestAttachment = require('../models/TestAttachment');

function getTestCase(rawCase, suite_meta) {
  const test_case = new TestCase();
  test_case.name = rawCase["@_name"];
  test_case.duration = rawCase["@_time"] * 1000;
  test_case.metadata = Object.assign({}, suite_meta);
  setAttachments(rawCase, test_case);
  setMetaData(rawCase, test_case);
  if (rawCase.failure && rawCase.failure.length > 0) {
    test_case.status = 'FAIL';
    setErrorAndStackTrace(test_case, rawCase);
  } else if (rawCase.skipped != undefined) {
    test_case.status = 'SKIP';
  } else {
    test_case.status = 'PASS';
  }
  return test_case;
}

function setErrorAndStackTrace(test_case, raw_case) {
  test_case.setFailure(raw_case.failure[0]["@_message"]);
  // wdio junit reporter
  if (!test_case.failure && raw_case.error && raw_case.error.length > 0) {
    test_case.setFailure(raw_case.error[0]["@_message"]);
  }
  if (raw_case['system-err'] && raw_case['system-err'].length > 0) {
    test_case.stack_trace = raw_case['system-err'][0];
  }
  if (!test_case.stack_trace) {
    if (raw_case.failure[0]["#text"]) {
      test_case.stack_trace = raw_case.failure[0]["#text"];
    }
  }
}

/**
 *
 * @param {object} rawSuite
 * @param {import('..').ParseOptions} options
 * @returns
 */
function getTestSuite(rawSuite) {
  const suite = new TestSuite();
  suite.name = rawSuite["@_name"];
  suite.total = rawSuite["@_tests"];
  suite.failed = rawSuite["@_failures"];
  const errors = rawSuite["@_errors"];
  if (errors) {
    suite.errors = errors;
  }
  const skipped = rawSuite["@_skipped"];
  if (skipped) {
    suite.skipped = skipped;
  }
  suite.total = suite.total - suite.skipped;
  suite.passed = suite.total - suite.failed - suite.errors;
  suite.duration = rawSuite["@_time"] * 1000;
  suite.startTime = getDate(rawSuite["@_timestamp"]);
  if (suite.startTime && suite.duration) {
    suite.endTime = new Date(suite.startTime.getTime() + suite.duration);
  }
  suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
  setMetaData(rawSuite, suite);
  const raw_test_cases = rawSuite.testcase;
  if (raw_test_cases) {
    for (let i = 0; i < raw_test_cases.length; i++) {
      suite.cases.push(getTestCase(raw_test_cases[i], suite.metadata));
    }
  }
  return suite;
}

/**
 * @param {import('./junit.result').JUnitTestSuite | import('./junit.result').JUnitTestCase} rawElement
 * @param {TestCase | TestSuite} test_element
 */
function setMetaData(rawElement, test_element) {

  // Read properties from test suite or test case
  if (rawElement.properties && rawElement.properties.property.length > 0) {
    const raw_properties = rawElement.properties.property;
    for (const raw_property of raw_properties) {
      test_element.metadata[raw_property["@_name"]] = raw_property["@_value"];
    }
  }

  // Read inline properties from system.out
  setInlineMetadata(rawElement, test_element);

  // Handle testsuite specific attributes
  if (test_element instanceof TestSuite) {
    if (rawElement["@_hostname"]) {
      test_element.metadata["hostname"] = rawElement["@_hostname"];
    }
  }
}

function setInlineMetadata(rawElement, test_element) {
  // Scan system.out for PROPERTY attributes
  if (rawElement['system.out'] || rawElement['system-out']) {
    const systemOut = rawElement['system.out'] || rawElement['system-out'];

    // Regex for single-line properties: [[PROPERTY|key=value]]
    const singleLineRegex = /\[\[PROPERTY\|([^=]+)=([^\]]+)\]\]/g;
    let match;
    while ((match = singleLineRegex.exec(systemOut)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      test_element.metadata[key] = value;
    }

    // Regex for multi-line properties: [[PROPERTY|key]]value\nvalue\n[[/PROPERTY]]
    const multiLineRegex = /\[\[PROPERTY\|([^\]=]+)\]\]([\s\S]*?)\[\[\/PROPERTY\]\]/g;
    while ((match = multiLineRegex.exec(systemOut)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      test_element.metadata[key] = value;
    }
  }
}

/**
 * @param {import('./junit.result').JUnitTestCase} rawCase
 * @param {TestCase} test_element
 */
function setAttachments(rawCase, test_element) {
  if (rawCase['system.out'] || rawCase['system-out']) {
    const systemOut = rawCase['system.out'] || rawCase['system-out'];

    // junit attachments plug syntax is [[ATTACHMENT|/absolute/path/to/file.png]]
    const regex = new RegExp('\\[\\[ATTACHMENT\\|([^\\]]+)\\]\\]', 'g');

    let m;
    while ((m = regex.exec(systemOut)) !== null) {
      // avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      let filePath = m[1].trim();

      if (filePath.length > 0) {
        const attachment = new TestAttachment();
        attachment.path = filePath;
        attachment.name = path.parse(filePath).base;
        test_element.attachments.push(attachment);
      }
    }
  }
}

/**
 * @param {TestResult} result
 */
function setAggregateResults(result) {
  if (Number.isNaN(result.passed) || Number.isNaN(result.failed)) {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let errors = 0;
    let skipped = 0;
    result.suites.forEach(_suite => {
      total = _suite.total + total;
      passed = _suite.passed + passed;
      failed = _suite.failed + failed;
      errors = _suite.errors + errors;
      skipped = _suite.skipped + skipped;
    });
    result.passed = passed;
    result.failed = failed;
    result.errors = errors;
    result.skipped = skipped;
    result.total = total;
  }
  if (Number.isNaN(result.duration)) {
    let duration = 0;
    result.suites.forEach(_suite => {
      duration = _suite.duration + duration;
    });
    result.duration = duration;
  }
  // find earliest start time and latest end time
  const { startTime, endTime } = getStartAndEndTime(result.suites);
  result.startTime = startTime;
  result.endTime = endTime;
}

/**
 *
 * @param {import('./junit.result').JUnitResultJson} json
 * @param {import('..').ParseOptions} options
 * @returns
 */
function getTestResult(json, options) {
  const result = new TestResult();
  const rawResult = json["testsuites"] ? json["testsuites"][0] : json["testsuite"];
  result.name = rawResult["@_name"] || '';
  result.total = rawResult["@_tests"];
  result.failed = rawResult["@_failures"];
  const errors = rawResult["@_errors"];
  if (errors) {
    result.errors = errors;
  }
  const skipped = rawResult["@_skipped"];
  if (skipped) {
    result.skipped = skipped;
  }
  result.total = result.total - result.skipped;
  result.passed = result.total - result.failed - result.errors;
  result.duration = rawResult["@_time"] * 1000;
  // top-level element is testsuites
  if (json["testsuites"]) {
    const rawSuites = rawResult["testsuite"];
    // Don't filter if there are no testsuite objects
    if (!(typeof rawSuites === "undefined")) {
      const filteredSuites = rawSuites.filter(suite => suite.testcase);
      for (let i = 0; i < filteredSuites.length; i++) {
        result.suites.push(getTestSuite(filteredSuites[i], options));
      }
    }
  } else {
    // top level element is testsuite
    result.suites.push(getTestSuite(rawResult, options));
  }

  setAggregateResults(result);
  result.status = result.total === result.passed ? 'PASS' : 'FAIL';
  return result;
}

/**
 *
 * @param {string} file
 * @param {import('..').ParseOptions} options
 * @returns
 */
function parse(file, options) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json, options);
}

module.exports = {
  parse
}
