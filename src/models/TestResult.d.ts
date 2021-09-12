import * as TestSuite from './TestSuite';

declare class TestResult {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  duration: number;
  status: string;
  suites: TestSuite[];
}

declare namespace TestResult {}

export = TestResult;