# Tocos API testing framework

## Introduction

This document provides instructions on how to get started with the project, including installation, setup, and running tests. The test suite is organized across three files in the tests directory, specifically designed to cover various aspects of interacting with the Tocos API.

## Getting Started

### Installation

To install the necessary dependencies for this project, run the following command:

```bash
npm install
```

After installing the general dependencies, you need to install Playwright specifically. This step ensures that you have all the necessary browsers for the tests. Run:

```bash
npx playwright install
```

### Setup

Ensure that your environment is set up with the necessary API endpoints and any required authentication mechanisms. You may need to configure environment variables or similar settings as defined in your project documentation.

### Running Tests

The tests are stored in the `tests` directory and are split into three files to cover different scenarios:

* Tests related to buying Tocos  `tocos-buy.spec.ts`
* Tests related to selling Tocos `tocos-sell.spec.ts`
* Tests covering transactions between users `tocos-transactions.spec.ts`
* To run the tests, execute the following command:

```bash
npx playwright test
```

You can also run a specific test file by specifying its path:

```bash
npx playwright test tests/tocos-buy.spec.ts
```

### Test Helpers

* A `testHelpers.ts` file is created in the project to contain helper functions that facilitate the testing process. These functions perform common tasks, such as fetching a user's balance from the Tocos API, to reduce redundancy and improve test readability.

### Test Documentation

* A `test-documentation` folder has been created in the project to contain the `Tocos- Test Plan` PDF file, providing detailed insights into the testing strategy, decisions and coverage.
