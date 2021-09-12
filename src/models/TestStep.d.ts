declare class TestStep {
  name: string;
  duration: number;
  status: string;
  failure: string;
}

declare namespace TestStep { }

export = TestStep;