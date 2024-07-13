import * as TestSuite from './TestSuite';

declare class TestResult {
  name: string;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  retried: number;
  duration: number;
  status: string;
  tags: string[];
  meta_data: object;

  suites: TestSuite[];
}

declare namespace TestResult {}

export = TestResult;