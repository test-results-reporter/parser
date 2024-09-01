const path = require('path');
const fs = require('fs');
const { resolveFilePath, decodeIfEncoded, isFilePath, saveAttachmentToDisk } = require('../helpers/helper');

const TestResult = require('../models/TestResult');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const TestStep = require('../models/TestStep');
const { BaseParser } = require('./base.parser');
const TestAttachment = require('../models/TestAttachment');

class CucumberParser extends BaseParser {

  constructor(file) {
    super();
    this.result = new TestResult();
    this.raw_result = this.#getCucumberResult(file);
  }

  /**
   * @returns {import('./cucumber.result').CucumberJsonResult}
   */
  #getCucumberResult(file) {
    return require(resolveFilePath(file));
  }

  parse() {
    this.#setTestResults();
    return this.result;
  }

  #setTestResults() {
    this.result.name = '';
    this.#setTestSuites();
    this.result.status = this.result.suites.every(suite => suite.status === "PASS") ? "PASS" : "FAIL";
    this.result.total = this.result.suites.reduce((total, suite) => total + suite.total, 0);
    this.result.passed = this.result.suites.reduce((total, suite) => total + suite.passed, 0);
    this.result.failed = this.result.suites.reduce((total, suite) => total + suite.failed, 0);
    this.result.duration = this.result.suites.reduce((total, suite) => total + suite.duration, 0);
    this.result.duration = parseFloat(this.result.duration.toFixed(2));
  }

  #setTestSuites() {
    for (const feature of this.raw_result) {
      const test_suite = new TestSuite();
      test_suite.name = feature.name;
      test_suite.total = feature.elements.length;
      for (const scenario of feature.elements) {
        test_suite.cases.push(this.#getTestCase(scenario));
      }
      test_suite.total = test_suite.cases.length;
      test_suite.passed = test_suite.cases.filter(_ => _.status === "PASS").length;
      test_suite.failed = test_suite.cases.filter(_ => _.status === "FAIL").length;
      test_suite.duration = test_suite.cases.reduce((total, _) => total + _.duration, 0);
      test_suite.duration = parseFloat(test_suite.duration.toFixed(2));
      test_suite.status = test_suite.total === test_suite.passed ? 'PASS' : 'FAIL';
      const { tags, metadata } = this.#getTagsAndMetadata(feature);
      test_suite.tags = tags;
      test_suite.metadata = metadata;
      for (const test_case of test_suite.cases) {
        this.mergeTags(test_suite.tags, test_case.tags);
        this.mergeMetadata(test_suite.metadata, test_case.metadata);
      }

      this.result.suites.push(test_suite);
    }
  }

  /**
   *
   * @param {import('./cucumber.result').CucumberElement} scenario
   */
  #getTestCase(scenario) {
    const test_case = new TestCase();
    test_case.name = scenario.name;
    for (const step of scenario.steps) {
      const test_step = this.#getTestStep(step);
      if (test_step) {
        test_case.steps.push(test_step);
      }
    }
    test_case.total = test_case.steps.length;
    test_case.passed = test_case.steps.filter(step => step.status === "PASS").length;
    test_case.failed = test_case.steps.filter(step => step.status === "FAIL").length;
    test_case.skipped = test_case.steps.filter(step => step.status === "SKIP").length;
    test_case.duration = test_case.steps.reduce((total, _) => total + _.duration, 0);
    test_case.duration = parseFloat((test_case.duration).toFixed(2));
    test_case.status = test_case.total === test_case.passed ? 'PASS' : 'FAIL';
    if (test_case.status === "FAIL") {
      const failed_step = test_case.steps.find(step => step.status === "FAIL");
      test_case.failure = failed_step.failure;
      test_case.stack_trace = failed_step.stack_trace
    }
    const { tags, metadata } = this.#getTagsAndMetadata(scenario);
    test_case.tags = tags;
    test_case.metadata = metadata;
    test_case.attachments = this.#getAttachments(scenario.steps);
    return test_case;
  }

  /**
   *
   * @param {import('./cucumber.result').CucumberStep} step
   */
  #getTestStep(step) {
    if (!step.keyword) {
      return;
    }
    const test_step = new TestStep();
    test_step.name = step.keyword.endsWith(' ') ? step.keyword + (step.name || '') : step.keyword + ' ' + (step.name || '');
    test_step.status = this.parseStatus(step.result.status);
    test_step.duration = step.result.duration ? parseFloat((step.result.duration / 1000000).toFixed(2)) : 0;
    if (test_step.status === "FAIL") {
      const { failure, stack_trace } = this.#getFailureAndStackTrace(step.result.error_message);
      test_step.failure = failure;
      test_step.stack_trace = stack_trace;
    }
    return test_step;
  }

  /**
   *
   * @param {string} message
   */
  #getFailureAndStackTrace(message) {
    if (message) {
      const stack_trace_start_index = message.indexOf('    at ');
      if (stack_trace_start_index) {
        const failure = this.parseText(message.slice(0, stack_trace_start_index));
        const stack_trace = message.slice(stack_trace_start_index);
        return { failure, stack_trace };
      } else {
        return { failure: message, stack_trace: '' };
      }
    }
    return { failure: '', stack_trace: '' };
  }

  /**
   *
   * @param {import('./cucumber.result').CucumberFeature | import('./cucumber.result').CucumberElement} feature
   */
  #getTagsAndMetadata(feature) {
    const cucumber_tags = feature.tags || [];
    const metadata = {};
    const tags = [];
    if (cucumber_tags) {
      for (const tag of cucumber_tags) {
        if (tag["name"].includes("=")) {
          const [name, value] = tag["name"].substring(1).split("=");
          metadata[name] = value;
        } else {
          tags.push(tag["name"]);
        }
      }
    }
    if (feature.metadata) {
      Object.assign(metadata, feature.metadata);
    }

    return { tags, metadata };
  }

  /**
   *
   * @param {import('./cucumber.result').CucumberStep[]} steps
   */
  #getAttachments(steps) {
    const attachments = [];
    const failed_steps = steps.filter(_ => this.parseStatus(_.result.status) === 'FAIL' && _.embeddings && _.embeddings.length > 0);

    for (const step of failed_steps) {
      for (const embedding of step.embeddings) {
        const attachment = this.#getAttachment(step, embedding);
        if (attachment) {
          attachments.push(attachment);
        }
      }
    }
    return attachments;
  }

  /**
   *
   * @param {import('./cucumber.result').CucumberStep} step
   * @param {import('./cucumber.result').CucumberEmbedding} embedding
   */
  #getAttachment(step, embedding) {
    try {
      const decoded = decodeIfEncoded(embedding.data);
      const is_file_path = isFilePath(decoded);
      if (is_file_path) {
        const attachment = new TestAttachment();
        attachment.name = path.parse(decoded).base;
        attachment.path = decoded;
        return attachment;
      } else {
        const file_name = step.name.replace(/[^a-zA-Z0-9]/g, '_') + '-' + Date.now();
        const file_path = saveAttachmentToDisk(file_name, embedding.data, embedding.mime_type);
        if (!file_path) {
          return null;
        }
        const attachment = new TestAttachment();
        attachment.name = path.parse(file_path).base;
        attachment.path = file_path;
        return attachment;
      }
    } catch (e) {
      return null;
    }
  }

}

function parse(file) {
  const parser = new CucumberParser(file);
  return parser.parse();
}

module.exports = {
  parse
}