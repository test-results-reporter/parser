const testng = require('./testng');
const junit = require('./junit');
const nunit = require('./nunit');
const mstest = require('./mstest');
const xunit = require('./xunit');
const mocha = require('./mocha');
const cucumber = require('./cucumber');
const TestResult = require('../models/TestResult');
const { getMatchingFilePaths } = require('../helpers/helper');

/**
 * @param {import('../models/TestResult')[]} results 
 */
function merge(results) {
  const main_result = new TestResult();
  for (let i = 0; i < results.length; i++) {
    const current_result = results[i];
    if (!main_result.name) {
      main_result.name = current_result.name;
    }
    main_result.total = main_result.total + current_result.total;
    main_result.passed = main_result.passed + current_result.passed;
    main_result.failed = main_result.failed + current_result.failed;
    main_result.errors = main_result.errors + current_result.errors;
    main_result.skipped = main_result.skipped + current_result.skipped;
    main_result.retried = main_result.retried + current_result.retried;
    main_result.duration = main_result.duration + current_result.duration;
    main_result.suites = main_result.suites.concat(...current_result.suites);
  }
  main_result.status = results.every(_result => _result.status === 'PASS') ? 'PASS' : 'FAIL';
  return main_result;
}

function getParser(type) {
  switch (type) {
    case 'testng':
      return testng;
    case 'junit':
      return junit;
    case 'xunit':
      return xunit;
    case 'nunit':
      return nunit;
    case 'mstest':
      return mstest;
    case 'mocha':
      return mocha;
    case 'cucumber':
      return cucumber;
    default:
      throw `UnSupported Result Type - ${options.type}`;
  }
}

/**
 * @param {import('../index').ParseOptions} options 
 */
function parse(options) {
  const parser = getParser(options.type);
  const results = [];
  for (let i = 0; i < options.files.length; i++) {
    const matched_files = getMatchingFilePaths(options.files[i]);
    for (let j = 0; j < matched_files.length; j++) {
      const file = matched_files[j];
      results.push(parser.parse(file));
    }
  }
  return merge(results);
}

module.exports = {
  parse
}