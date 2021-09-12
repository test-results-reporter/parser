import TestResult from "./models/TestResult";

declare interface ParseOptions {
  type: string;
  files: string[];
}

export function parse(options: ParseOptions): TestResult;

export namespace parser { }