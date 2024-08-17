const { parseV2 } = require('../src');
const assert = require('assert');

describe('Parser V2 - JUnit', () => {

  const testDataPath = "tests/data/junit"

  it('with all files valid', () => {
    const { result } = parseV2({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/playwright-failures.xml`]});
    assert.equal(result.total, 16);
    assert.equal(result.passed, 14);
    assert.equal(result.failed, 2);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites[1].cases[1].attachments[0].name, `test-failed-1.png`);
    assert.equal(result.suites[1].cases[1].attachments[0].path, `example-get-started-link-chromium/test-failed-1.png`);
  });

  it('with one invalid file ', () => {
    const { result, errors } = parseV2({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/playwright-failures.xml`, `${testDataPath}/playwright-failures.json`] });
    assert.equal(result.total, 16);
    assert.equal(result.passed, 14);
    assert.equal(result.failed, 2);
    assert.equal(result.status, 'FAIL');
    assert.equal(result.suites[1].cases[1].attachments[0].name, `test-failed-1.png`);
    assert.equal(result.suites[1].cases[1].attachments[0].path, `example-get-started-link-chromium/test-failed-1.png`);
    assert.ok(errors.length === 1);
    assert.ok(errors[0].includes(`Error`));
  });

  it('with all files invalid', () => {
    const { result, errors } = parseV2({ type: 'junit', ignore_error_count: true, files: [`${testDataPath}/invalid.xml`, `${testDataPath}/invalid.json`] });
    assert.equal(result, null);
    assert.ok(errors.length === 2);
    assert.ok(errors[0].includes(`Error`));
    assert.ok(errors[1].includes(`Error`));
  });

});