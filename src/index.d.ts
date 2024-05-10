import TestResult from "./models/TestResult";

declare interface ParseOptions {
  type: string;
  ignore_error_count?: boolean;
  files: string[];
  skipped_tests_passed?: boolean;
}

export function parse(options: ParseOptions): TestResult;

export namespace parser { }