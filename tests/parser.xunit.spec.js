const { parse } = require('../src');
const assert = require('assert');
const path = require('path');

describe('Parser - XUnit', () => {

  const testDataPath = "tests/data/xunit";
  
  it('single suite with single test', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/single-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'single suite test',
      total: 1,
      passed: 0,
      failed: 1,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 86006.5,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Example test collection 1',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 86006.5,
          status: 'FAIL',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              duration: 86006.5,
              errors: 0,
              failed: 0,
              failure: "Example of a failure message",
              id: "",
              name: "Example test case 1",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              meta_data: newMap({ TestID: "ID", TestLevel: "Regression", TestProduct: "TestProductExample", TestSuite: "TestSuiteExample"}),
              total: 0
            }
          ]
        }
      ]
    });
  });
  it('suite with single skipped test', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/skipped-suite.xml`] });
    assert.deepEqual(result, {
      id: '',
      name: 'Skipped test',
      total: 1,
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 1,
      retried: 0,
      duration: 1,
      status: 'PASS',
      suites: [
        {
          id: '',
          name: 'Test collection skipped',
          total: 1,
          passed: 0,
          failed: 0,
          errors: 0,
          skipped: 1,
          duration: 1,
          status: 'PASS',
          meta_data: new Map(),
          cases: [ 
            {
            attachments: [],
            duration: 1,
            errors: 0,
            failed: 0,
            failure: "",
            id: "",
            name: "SkippedTest",
            passed: 0,
            skipped: 0,
            stack_trace: "",
            status: "SKIP",
            steps: [],
            meta_data: newMap({ UnsupportedEnvirnoment: "uat"}),
            total: 0
          }]
        }
      ]
    });
  });
  it('multiple suites', () => {
    const result = parse({ type: 'xunit', files: [`${testDataPath}/multiple-suites.xml`] });
    const expectedObj = {
      id: '',
      name: 'Multiple suites',
      total: 6,
      passed: 3,
      failed: 3,
      errors: 0,
      skipped: 0,
      retried: 0,
      duration: 348807,
      status: 'FAIL',
      suites: [
        {
          id: '',
          name: 'Test suite number 1',
          total: 2,
          passed: 1,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 92155,
          status: 'FAIL',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              duration: 84201.1799,
              errors: 0,
              failed: 0,
              failure: "Test message",
              id: "",
              name: "ExampleTestCase 1",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              meta_data: newMap({ TestID: "RTA-21505", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            },
            {
              attachments: [],
              duration: 218.6713,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "ExampleTestCase 2",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              meta_data: newMap({ TestID: "RTA-21510", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Test suite number 2',
          total: 2,
          passed: 1,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 85450,
          status: 'FAIL',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              duration: 1411.6188,
              errors: 0,
              failed: 0,
              failure: "Test message",
              id: "",
              name: "ExampleTestCase 3",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              meta_data: newMap({ TestID: "RTA-21516", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            },   
            {
              attachments: [],
              duration: 1791.1067,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "ExampleTestCase 4",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              meta_data: newMap({ TestID: "RTA-21513", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Test suite number 3',
          total: 1,
          passed: 1,
          failed: 0,
          errors: 0,
          skipped: 0,
          duration: 84195,
          status: 'PASS',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              duration: 84195.474,
              errors: 0,
              failed: 0,
              failure: "",
              id: "",
              name: "ExampleTestCase 5",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "PASS",
              steps: [],
              meta_data: newMap({ TestID: "RTA-21538", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            }
          ]
        },
        {
          id: '',
          name: 'Test suite number 4',
          total: 1,
          passed: 0,
          failed: 1,
          errors: 0,
          skipped: 0,
          duration: 86007,
          status: 'FAIL',
          meta_data: new Map(),
          cases: [
            {
              attachments: [],
              duration: 86006.7435,
              errors: 0,
              failed: 0,
              failure: "Test message",
              id: "",
              name: "ExampleTestCase 6",
              passed: 0,
              skipped: 0,
              stack_trace: "",
              status: "FAIL",
              steps: [],
              meta_data: newMap({ TestID: "RTA-37684", TestLevel: "Regression", TestProduct: "ExampleTestProduct", TestSuite: "ExampleTestSuite"}),
              total: 0
            }
          ]
        }
      ]
    }
    assert.deepEqual(result, expectedObj );
  });

  it('can support absolute and relative file paths', () => {
    let relativePath = `${testDataPath}/single-suite.xml`;
    let absolutePath = path.resolve(relativePath);
    const result1 = parse({ type: 'xunit', files: [absolutePath] });
    assert.notEqual(null, result1);
    const result2 = parse({ type: 'xunit', files: [relativePath]});
    assert.notEqual(null, result2);
  });

  it('meta-data from traits', () => {
    const result = parse({ type: 'xunit', files: ['tests/data/xunit/single-suite.xml'] });
    assert.equal(result.suites[0].cases[0].meta_data.size, 4);
  });
  
  it('no meta-data from empty traits', () => {
    const result = parse({ type: 'xunit', files: ['tests/data/xunit/no-traits-suite.xml'] });
    assert.equal(result.suites[0].cases[0].meta_data.size, 0);
  })

  function newMap( obj ) {
    let map = new Map();
    for (const property in obj) {
      map.set( property, obj[property]);
    }
    return map;
  }
});