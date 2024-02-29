# Test Framework - Reference

This collection of resources is intended to support development efforts for the test frameworks supported by test-parser.

- **Cucumber**:

  Cucumber was created several years before the JSON Schema standard started gaining traction. The lack of formal schema led to inconsistencies between different Cucumber implementations and releases. The [cucumber-json-converter](https://github.com/cucumber/cucumber-json-converter) project offers the best reference schema:
  - [behave][behave]
  - [cucumber-js][cucumber-js]
  - [cucumber-jvm][cucumber-jvm]
  - [cucumber-ruby][cucumber-ruby]

[behave]: https://github.com/cucumber/cucumber-json-converter/blob/main/src/behave/BehaveSchema.ts
[cucumber-js]: https://github.com/cucumber/cucumber-json-converter/blob/main/src/cucumber-js/CucumberJsSchema.ts
[cucumber-jvm]: https://github.com/cucumber/cucumber-json-converter/blob/main/src/cucumber-jvm/CucumberJvmSchema.ts
[cucumber-ruby]: https://github.com/cucumber/cucumber-json-converter/blob/main/src/cucumber-ruby/CucumberRubySchema.ts

- **JUnit**:

  Several attempts have been made to nail down JUnit's schema:

  - Schema: <https://github.com/windyroad/JUnit-Schema/blob/master/JUnit.xsd> - referenced by [IBM's outline][ibm-ref] for JUnit schema
  - Schema: <https://github.com/junit-team/junit5/blob/main/platform-tests/src/test/resources/jenkins-junit.xsd> - referenced by github issue [junit-team/2625][github-issue-2625]
  - Overview with examples: <https://github.com/testmoapp/junitxml>

[github-issue-2625]: https://github.com/junit-team/junit5/issues/2625
[ibm-ref]: https://www.ibm.com/docs/en/developer-for-zos/16.0?topic=formats-junit-xml-format

- **Mocha**:

  - Mocha reporter: <https://mochajs.org/#json>
  - Mochawesome reporter: <https://github.com/mochajs/mocha/blob/master/lib/reporters/json.js>

- **MSTest**:

  - The XSD schema for MSTest is installed with Visual Studio at `%Program Files%\Microsoft Visual Studio\<version>\Xml\Schemas\vstst.xd`

- **NUnit**:

  - NUnit v2 schema: <https://nunit.org/files/testresult_schema_25.txt>
  - NUnit v3 documentation: <https://docs.nunit.org/articles/nunit/technical-notes/usage/Test-Result-XML-Format.html>

- **TestNG**:

  - Xml reporter: <https://testng-docs.readthedocs.io/testresults/#xml-reports>

- **xUnit**:

  - xUnit v2+ schema: <https://xunit.net/docs/format-xml-v2>
