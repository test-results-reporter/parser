const { unescape } = require('html-escaper');


class BaseParser {

  /**
   *
   * @param {string} value
   * @returns
   */
  parseStatus(value) {
    if (value === 'passed' || value === 'PASSED') {
      return 'PASS';
    }
    if (value === 'failed' || value === 'FAILED') {
      return 'FAIL';
    }
    if (value === 'skipped' || value === 'SKIPPED') {
      return 'SKIP';
    }
    return 'FAIL';
  }

  /**
   * @param {string} value
   * @returns
   */
  parseText(value) {
    return value ? unescape(value) : value;
  }

  /**
   *
   * @param {string[]} parent_tags
   * @param {string[]} child_tags
   */
  mergeTags(parent_tags, child_tags) {
    if (!parent_tags) {
      parent_tags = [];
    }
    if (!child_tags) {
      child_tags = [];
    }
    for (const tag of parent_tags) {
      if (child_tags.indexOf(tag) === -1) {
        child_tags.push(tag);
      }
    }
  }

  mergeMetadata(parent_metadata, child_metadata) {
    if (!parent_metadata) {
      parent_metadata = {};
    }
    if (!child_metadata) {
      child_metadata = {};
    }
    for (const [key, value] of Object.entries(parent_metadata)) {
      if (!child_metadata[key]) {
        child_metadata[key] = value;
      }
    }
  }
}

module.exports = { BaseParser }