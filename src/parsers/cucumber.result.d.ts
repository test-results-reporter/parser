export type CucumberResult = {
  status: string;
  duration: number;
};

export type CucumberMatch = {
  location: string;
};

export type CucumberArgument = {
  arguments: any[];
  keyword: string;
  line: number;
  name: string;
  match: CucumberMatch;
  result: CucumberResult;
};

export type CucumberStep = {
  arguments: any[];
  keyword: string;
  line: number;
  name: string;
  match: CucumberMatch;
  result: CucumberResult;
};

export type CucumberTag = {
  name: string;
  line: number;
};

export type CucumberElement = {
  description: string;
  id: string;
  keyword: string;
  line: number;
  name: string;
  steps: CucumberStep[];
  tags: CucumberTag[];
  type: string;
};

export type CucumberFeature = {
  description: string;
  elements: CucumberElement[];
  id: string;
  line: number;
  keyword: string;
  name: string;
  tags: CucumberTag[];
  uri: string;
};

export type CucumberJsonResult = CucumberFeature[];
