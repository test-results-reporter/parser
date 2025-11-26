const { unescape } = require('html-escaper');

class TestCase {

    constructor() {
      this.id = '';
      this.name = '';
      this.total = 0;
      this.passed = 0;
      this.failed = 0;
      this.errors = 0;
      this.skipped = 0;
      this.duration = 0;
      this.startTime = undefined;
      this.endTime = undefined;
      this.status = 'NA';
      this.failure = '';
      this.stack_trace = '';
      this.tags = [];
      this.metadata = {};

      this.steps = [];
      this.attachments = [];
    }

    setFailure(value) {
      this.failure = value ? unescape(value) : value;
    }

  }

  module.exports = TestCase;