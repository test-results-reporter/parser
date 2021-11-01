class TestResult {

  constructor() {
    this.id = '';
    this.name = '';
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.errors = 0;
    this.skipped = 0;
    this.retried = 0;
    this.duration = 0;
    this.status = 'NA';
    this.suites = [];
  }
}

module.exports = TestResult;