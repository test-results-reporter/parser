import TestResult from "./models/TestResult";

declare interface ParseOptions {
  type: string;
  files: string[];
  skipped_tests_passed?: boolean;
}

export function parse(options: ParseOptions): TestResult;

export namespace parser { }