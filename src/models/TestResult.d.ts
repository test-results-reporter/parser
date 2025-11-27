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
  startTime: Date | undefined;
  endTime: Date | undefined;
  status: string;
  tags: string[];
  metadata: object;

  suites: TestSuite[];
}

declare namespace TestResult {}

export = TestResult;