import * as TestStep from './TestStep';

declare class TestCase {
  name: string;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  duration: number;
  status: string;
  failure: string;
  stack_trace: string;
  steps: TestStep[];
}

declare namespace TestCase { }

export = TestCase;