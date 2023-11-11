const { getJsonFromXMLFile } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

const SUITE_TYPES_WITH_TESTCASES = [
    "TestFixture",
    "ParameterizedTest",
    "GenericFixture"
]

const RESULTMAP = {
    Success: "PASS",
    Failure: "FAIL",
    Ignored: "SKIP",
    NotRunnable: "SKIP",
    Error: "ERROR",
    Inconclusive: "FAIL"
}

function populateMetaData(raw, map) {
    if (raw.categories) {
        let categories = raw.categories.category;
        for (let i = 0; i < categories.length; i++) {
            let categoryName = categories[i]["@_name"];
            map.set(categoryName, "");

            // create comma-delimited list of categories
            if (map.has("Categories")) {
                map.set("Categories", map.get("Categories").concat(",", categoryName));
            } else {
                map.set("Categories", categoryName);
            }
        }
    }
    if (raw.properties) {
        let properties = raw.properties.property;
        for (let i = 0; i < properties.length; i++) {
            let property = properties[i];
            map.set(property["@_name"], property["@_value"]);
        }
    }
}

function getTestCases(rawSuite, parent_meta) {
    var cases = [];

    let rawTestCases = rawSuite.results["test-case"];
    if (rawTestCases) {
        for (let i = 0; i < rawTestCases.length; i++) {
            let rawCase = rawTestCases[i];
            let testCase = new TestCase();
            let result = rawCase["@_result"]
            testCase.name = rawCase["@_name"];
            testCase.duration = rawCase["@_time"] * 1000; // in milliseconds
            testCase.status = RESULTMAP[result];
            if (rawCase["@_executed"] == "False") {
                testCase.status = "SKIP"; // exclude failures that weren't executed.
            }
            let errorDetails = rawCase.reason ?? rawCase.failure;
            if (errorDetails !== undefined) {
                testCase.setFailure(errorDetails.message);
                if (errorDetails["stack-trace"]) {
                    testCase.stack_trace = errorDetails["stack-trace"]
                }
            }
            // copy parent_meta data to test case
            for( let kvp of parent_meta.entries()) {
                testCase.meta_data.set(kvp[0], kvp[1]);
            }
            populateMetaData(rawCase, testCase.meta_data);

            cases.push( testCase );
        }
    }

    return cases;
}

function getTestSuites(rawSuites) {
    var suites = [];
    
    for(let i = 0; i < rawSuites.length; i++) {
        let rawSuite = rawSuites[i];
    
        if (rawSuite.results["test-suite"]) {
            // handle nested test-suites
            suites.push(...getTestSuites(rawSuite.results["test-suite"]));
        } else if (SUITE_TYPES_WITH_TESTCASES.indexOf(rawSuite["@_type"]) !== -1) {
        
            let suite = new TestSuite();
            suite.duration = rawSuite["@_time"] * 1000; // in milliseconds
            suite.status = RESULTMAP[rawSuite["@_result"]];
            
            var meta_data = new Map();
            populateMetaData(rawSuite, meta_data);
            suite.cases.push(...getTestCases(rawSuite, meta_data));
            
            // calculate totals
            suite.total = suite.cases.length;
            suite.passed = suite.cases.filter(i => i.status == "PASS").length;
            suite.failed = suite.cases.filter(i => i.status == "FAIL").length;
            suite.errors = suite.cases.filter(i => i.status == "ERROR").length;
            suite.skipped = suite.cases.filter(i => i.status == "SKIP").length;
        
            suites.push(suite);
        }
    }
    
    return suites;
}


function getTestResult(json) {
    const rawResult = json["test-results"];
    const rawSuite = rawResult["test-suite"][0];
    
    const result = new TestResult();
    result.name    = rawResult["@_name"];
    result.duration = rawSuite["@_time"] * 1000; // in milliseconds
    // test-results attributes related to totals
    //      total    = executed=True
    //      errors   = result="Error"
    //      failures = result="Failure"
    //      not-run  = executed=False
    //      inconclusive = result="Inconclusive"
    //      ignored  = result="Ignored"
    //      skipped  = sample has zero?
    //      invalid  = result="NotRunable"
    result.total   = rawResult["@_total"] + rawResult["@_not-run"]; // total executed and not executed
    result.errors  = rawResult["@_errors"];
    result.failed  = rawResult["@_failures"];
    result.skipped = rawResult["@_not-run"]; // Ignored, NotRunnable
    // assume inconclusive is neither a pass or failure to prevent religious wars, total's won't match as a result.
    result.passed  = rawResult["@_total"] - (result.errors + result.failed + rawResult["@_inconclusive"]);    
    
    result.suites.push(getTestSuites( [ rawSuite ]) );
    
    return result;
}

function parse(file) {
  const json = getJsonFromXMLFile(file);
  return getTestResult(json);
}

module.exports = {
  parse
}