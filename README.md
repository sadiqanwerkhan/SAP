# SAPUI5 ToDo Application

Fast local ToDo app built with SAPUI5, OData mock services, and test automation for unit, integration, and functional validation.

## What is included

- Fiori-style SAPUI5 ToDo UI (add, complete, delete, filter, search)
- Local OData V2 mock service (`/v2/todo/`) with metadata + mock data
- Unit tests with QUnit
- Integration tests with OPA5
- Functional test example with wdi5/WebdriverIO
- UAT checklist in `UAT_CHECKLIST.md`

## Requirements

Either [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management.

## Preparation

Use `npm` (or `yarn`) to install the dependencies:

```sh
npm install
```

(To use yarn, just do `yarn` instead.)

## Run the app locally

```sh
npm start
```

Open [http://localhost:8080/index.html](http://localhost:8080/index.html).

## Build

```sh
npm run build:opt
```
## Test

```sh
npm run lint
npm run test-runner-coverage
npm run wdi5
```

You can also open QUnit/OPA manually at:
[http://localhost:8080/test/testsuite.qunit.html](http://localhost:8080/test/testsuite.qunit.html)

## SAP BTP tooling notes

- The project is UI5 Tooling based and ready to be opened in SAP Business Application Studio.
- For BTP deployment, add your destination/HTML5 app repo pipeline on top of the generated `dist` build.
- Keep OData URL externalized in `manifest.json` for non-local landscapes; local runs use the mock server.

## License

This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
