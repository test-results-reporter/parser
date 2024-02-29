import * as TestStep from './TestStep';
import * as TestAttachment from './TestAttachment';

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
  attachments: TestAttachment[];
  meta_data: Map<string,string>;
  
  setFailure: SetFailureFunction
}
export type SetFailureFunction = (value: string) => string;

declare namespace TestCase { }

export = TestCase;