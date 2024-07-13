import * as TestAttachment from './TestAttachment';
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
  tags: string[];
  meta_data: object;

  steps: TestStep[];
  attachments: TestAttachment[];

  setFailure: SetFailureFunction
}
export type SetFailureFunction = (value: string) => string;

declare namespace TestCase { }

export = TestCase;