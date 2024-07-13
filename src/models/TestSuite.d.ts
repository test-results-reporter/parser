import * as TestCase from './TestCase';

declare class TestSuite {
  name: string;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  duration: number;
  status: string;
  tags: string[];
  metadata: object;

  cases: TestCase[];
}

declare namespace TestSuite { }

export = TestSuite;