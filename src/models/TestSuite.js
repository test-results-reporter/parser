class TestSuite {

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
    this.meta_data = new Map();
    this.cases = [];
  }

}

module.exports = TestSuite;