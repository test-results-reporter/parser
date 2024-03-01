export type JUnitProperty = {
  '@_name': string;
  '@_value': string;
}

export type JUnitProperties = {
  property: JUnitProperty[];
}

export type JUnitFailure = {
  '#text': string;
  '@_message': string;
  '@_type': string;
}

export type JUnitTestCase = {
  properties?: JUnitProperties;
  failure?: JUnitFailure[];
  '@_id': string;
  '@_name': string;
  '@_time': number;
  'system.out': string;
}

export type JUnitTestSuite = {
  properties?: JUnitProperties;
  testcase: JUnitTestCase[];
  '@_id': string;
  '@_name': string;
  '@_tests': number;
  '@_failures': number;
  '@_time': number;
  '@_hostname': string;
}

export type JUnitResult = {
  testsuite: JUnitTestSuite[];
  '@_id': string;
  '@_name': string;
  '@_tests': number;
  '@_failures': number;
  '@_errors': string;
  '@_time': number;
}

export type JUnitResultJson = {
  '?xml': {
    '@_version': number;
    '@_encoding': string;
  };
  testsuites: JUnitResult[];
}

