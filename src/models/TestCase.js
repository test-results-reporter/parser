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
      this.status = 'NA';
      this.failure = '';
      this.stack_trace = '';
      this.steps = [];
      this.attachments = [];
      this.meta_data = new Map();
    }

    setFailure(value) {
      this.failure = value ? unescape(value) : value;
    }
  
  }
  
  module.exports = TestCase;