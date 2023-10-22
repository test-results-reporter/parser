export interface MochaTest {
  title: string;
  fullTitle: string;
  timedOut: null | boolean;
  duration: number;
  state: "passed" | "failed" | "pending";
  speed: "slow" | "medium" | "fast";
  pass: boolean;
  fail: boolean;
  pending: boolean;
  context: null;
  code: string;
  err: any;
  uuid: string;
  parentUUID: string;
  isHook: boolean;
  skipped: boolean;
}

export interface MochaSuite {
  uuid: string;
  title: string;
  fullFile: string;
  file: string;
  beforeHooks: any[];
  afterHooks: any[];
  tests: Test[];
  suites: Suite[];
  passes: string[]; // Array of test UUIDs that passed
  failures: string[]; // Array of test UUIDs that failed
  pending: string[]; // Array of test UUIDs that are pending
  skipped: string[]; // Array of test UUIDs that were skipped
  duration: number;
  root: boolean;
  rootEmpty: boolean;
  _timeout: number;
}

export interface MochaStats {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start: string;
  end: string;
  duration: number;
  testsRegistered: number;
  passPercent: number;
  pendingPercent: number;
  other: number;
  hasOther: boolean;
  skipped: number;
  hasSkipped: boolean;
}

export interface MochaResult {
  uuid: string;
  title: string;
  fullFile: string;
  file: string;
  beforeHooks: any[];
  afterHooks: any[];
  tests: Test[];
  suites: Suite[];
  passes: string[]; // Array of test UUIDs that passed
  failures: string[]; // Array of test UUIDs that failed
  pending: string[]; // Array of test UUIDs that are pending
  skipped: string[]; // Array of test UUIDs that were skipped
  duration: number;
  root: boolean;
  rootEmpty: boolean;
  _timeout: number;
}

export interface MochaMeta {
  mocha: {
    version: string;
  };
  mochawesome: {
    options: {
      quiet: boolean;
      reportFilename: string;
      saveHtml: boolean;
      saveJson: boolean;
      consoleReporter: string;
      useInlineDiffs: boolean;
      code: boolean;
    };
    version: string;
  };
  marge: {
    options: {
      id: string;
      reportDir: string;
      quiet: boolean;
      overwrite: boolean;
      html: boolean;
      json: boolean;
    };
    version: string;
  };
}

export interface MochaJsonData {
  stats: Stats;
  results: Result[];
  meta: Meta;
}
