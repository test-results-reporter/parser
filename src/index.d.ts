
export interface ITestResult {
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
  metadata: object;
  suites: ITestSuite[];
}

export interface ITestSuite {
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
  cases: ITestCase[];
}

export interface ITestCase {
  name: string;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  duration: number;
  startTime: Date | undefined;
  endTime: Date | undefined;
  status: string;
  failure: string;
  stack_trace: string;
  tags: string[];
  metadata: object;
  steps: ITestStep[];
  attachments: ITestAttachment[];
}

export interface ITestStep {
  name: string;
  duration: number;
  status: string;
  failure: string;
  stack_trace: string;
}

export interface ITestAttachment {
  name: string;
  path: string;
}

export interface ParseOptions {
  type: string;
  files: string[];
}

export function parse(options: ParseOptions): ITestResult;
export function parseV2(options: ParseOptions): { result: ITestResult, errors: string[] };

export namespace parser { }