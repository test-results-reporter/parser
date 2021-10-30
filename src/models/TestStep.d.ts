declare class TestStep {
  name: string;
  duration: number;
  status: string;
  failure: string;
  stack_trace: string;
}

declare namespace TestStep { }

export = TestStep;