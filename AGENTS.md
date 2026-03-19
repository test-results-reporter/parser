# AGENTS.md

This project is a Node.js utility for parsing test results from various frameworks like JUnit, Mocha, Cucumber, and more.

## Development Setup

- **Install dependencies**: `npm install`
- **Run tests**: `npm test`
- **Node.js Versions**: Supported on Node.js 20.x and 22.x.

## Project Structure

- `src/parsers/`: Contains the logic for parsing different test result formats.
- `src/models/`: Defines the internal data structures for `TestResult`, `TestSuite`, and `TestCase`.
- `tests/`: Contains test suites for each parser.
- `tests/data/`: Contains sample test result files used for testing.

## Adding a New Framework Support

To add support for a new test framework:

1. **Create a Parser**: Add a new parser file in `src/parsers/` (e.g., `jest.js`). It should export a `parse(file, options)` function that returns a `TestResult` object.
2. **Implement Models**: Use `src/models/TestResult`, `src/models/TestSuite`, and `src/models/TestCase` to structure the parsed data.
3. **Register the Parser**: Add the new parser to `getParser` in `src/parsers/index.js`.
4. **Add Test Data**: Place sample output files from the new framework in a new directory under `tests/data/`.
5. **Create Tests**: Add a new test file in `tests/` (e.g., `tests/parser.jest.spec.js`) to verify the new parser with the sample data.

## Code Style & Conventions

- Use standard JavaScript (CommonJS).
- Follow existing patterns in other parsers for consistency.
- Maintain compatibility with both `parse` and `parseV2` methods in `src/parsers/index.js`.

## PR Guidelines

- **PR Titles**: This project uses Conventional Commits. Ensure your PR title follows the format: `type(scope): description` (e.g., `feat(parser): add support for vitest`).
- **Tests**: All new features or bug fixes must include corresponding tests.
- **Verification**: Run `npm test` to ensure all tests pass before submitting.
