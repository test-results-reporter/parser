const { getJsonFromXMLFile } = require('../helpers/helper');
const { BaseParser } = require('./base.parser');
const { getDate, getStartAndEndTime } = require('./base.helpers');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

class XUnitParser extends BaseParser {
  constructor(json) {
    super();
    this.raw_result = json;
  }

  parse() {
    this.#setTestResult();
    this.#setResultStartEndTimes();
    return this.result;
  }

  #setTestResult()
  {
    // TODO: support multiple assemblies
    const rawAssembly = this.getTestAssembly(this.raw_result);
    this.result = this.#getTestResult(rawAssembly);
  }

  #getTestResult(rawAssembly) {
    const result = new TestResult();

    result.name = rawAssembly["@_name"] ?? "not specified";
    result.total = rawAssembly["@_total"] ?? 0;
    result.passed = rawAssembly["@_passed"] ?? 0;
    result.failed = rawAssembly["@_failed"] ?? 0;
    const errors = rawAssembly["@_errors"];
    if (errors) {
      result.errors = errors;
    }
    const skipped = rawAssembly["@_skipped"];
    if (skipped) {
      result.skipped = skipped;
    }
    result.duration = (rawAssembly["@_time"] ?? 0) * 1000;
    const rawSuites = rawAssembly["collection"] ?? [];

    for (let i = 0; i < rawSuites.length; i++) {
      result.suites.push(this.#getTestSuite(rawSuites[i]));
    }

    result.status = (result.failed + result.errors) > 0 ? "FAIL" : "PASS";
    return result;
  }

  #getTestSuite(rawSuite) {
    const suite = new TestSuite();
    suite.name = rawSuite["@_name"];
    suite.total = rawSuite["@_total"];
    suite.failed = rawSuite["@_failed"];
    suite.passed = rawSuite["@_passed"];
    suite.duration = rawSuite["@_time"]  * 1000;
    // suites do not have enough information for rtf dates, compute from cases
    suite.skipped = rawSuite["@_skipped"];
    suite.status = suite.total === suite.passed ? 'PASS' : 'FAIL';
    suite.status = suite.skipped == suite.total ? 'PASS' : suite.status;
    const raw_test_cases = rawSuite.test;
    if (raw_test_cases) {
      for(let i = 0; i < raw_test_cases.length; i++) {
        suite.cases.push(this.#getTestCase(raw_test_cases[i]));
      }
    }
    const { startTime, endTime } = getStartAndEndTime(suite.cases);
    suite.startTime = startTime;
    suite.endTime = endTime;
    return suite;
  }

  #getTestCase(rawCase) {
    const test_case = new TestCase();
    test_case.name = rawCase["@_name"];
    test_case.duration = rawCase["@_time"] * 1000;
    // v3 schema supports rtf
    test_case.startTime = getDate(rawCase["@_start-rtf"]);
    test_case.endTime = getDate(rawCase["@_finish-rtf"]);
    if(rawCase["@_result"] == "Skip")
    {
      test_case.status = 'SKIP';
    }
    else if (rawCase.failure && rawCase.failure.length > 0) {
      test_case.status = 'FAIL';
      test_case.setFailure(rawCase.failure[0]["message"]);
      test_case.stack_trace = rawCase.failure[0]["stack-trace"];
    }
    else {
      test_case.status = 'PASS';
    }
    if(rawCase.traits && rawCase.traits.trait && rawCase.traits.trait.length > 0) {
      const traits = rawCase.traits.trait;
      for(let i = 0; i < traits.length; i++) {
        test_case.metadata[traits[i]["@_name"]] =  traits[i]["@_value"];
      }
    }

    return test_case;
  }

  #setResultStartEndTimes() {
    const assemblies = this.raw_result["assemblies"];
    if (assemblies) {
      if (assemblies["@_schema-version"] === 3) {
        // use round-trippable format date strings
        this.result.startTime = getDate(assemblies["@_start-rtf"]);
        this.result.endTime = getDate(assemblies["@_finish-rtf"]);
      }
      else {
        // compute from duration
        const startTime = getDate(assemblies["@_timestamp"]);
        const endTime = new Date(startTime.getTime() + (this.result.duration || 0));
        this.result.startTime = startTime;
        this.result.endTime = endTime;
     }
    }
  }
  
  getTestAssembly(json) {
    const defaultResult = {};
    const assemblies = json["assemblies"];
    const assemblyArray = assemblies && assemblies.assembly;
    const rawResult = Array.isArray(assemblyArray) && assemblyArray.length > 0 ? assemblyArray[0] : defaultResult;
    return rawResult;
  }  
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return new XUnitParser(json).parse();
}

// FUTURE: support parsing from raw xml string
// function parseRaw(json) {
//   return new XUnitParser(json).parse();
// }

module.exports = {
  parse
}