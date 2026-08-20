# Playwright Automation Framework

## Prerequisites

### Node.js

1. You must have [Node.js](https://nodejs.org/en/) installed (Node.js LTS version recommended).
2. When installing Node.js, make sure to check the option:
   - [x] **Automatically install the necessary tools. Note that this will also install Chocolatey. The script will pop up in a new window after the installation completes.**

![nodeInstall](https://user-images.githubusercontent.com/60171460/157139770-d00bb969-9b36-4179-9dd2-ec5bf3fbd89a.PNG)


### Visual Studio Code

You must have [Visual Studio Code](https://code.visualstudio.com/download) installed.


## Initial Set up

1. Select the folder where you would like to clone the project.
2. Open Gitbash and paste the following command:

```bash
git clone git@ //replace with actual repo
```

3. Type `npm install` and wait for all packages to be downloaded.

### Adding env files

For more detailed step by step instructions please visit our [E2E test confulence documentation](https://sendtech.atlassian.net/wiki/spaces/TQ/pages/3698393166/env+files)

1. Create a folder `src/config` (see file structure below)
2. Create a file called `.env.dev` using the template
3. Update the file with the usernames and passwords found in the `env files` folder in Jumpcloud password manager
4. You will need to create a .env file for every environment you will run the tests


#### .env file template

```
Username='{username}'
Password="{password}"
URL=' '
```

## File Structure

The project has the following structure:

```
send-core-automation/
├── .gitattributes
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── playwright.yml
├── src/
│   ├── config/
│   │   └── .env.dev
│   ├── data/
│   │   └── login.spec.data.ts
│   ├── fixtures/
│   │   └── page.fixtures.ts
│   ├── linters/
│   │   ├── .eslintrc.js
│   │   ├── lintstagedrc.json
│   │   └── prettierrc.yml
│   ├── page/
│   │   ├── dashboard.page.ts
│   │   └── login.page.ts
│   ├── specs/
│   │   └── login.spec.ts
│   └── utilities/
│       ├── env.utils.ts
│       ├── playwright.utils.ts
│       └── test.helper.ts
```

### How to Run Test Cases 🧪

### All tests

```bash
npx playwright test
```

### Smoke test suite

```bash
npx playwright test --grep '@smoke'
```

### Tests based on system component tag 

```bash
npx playwright test --grep "@dashboard"
```
List of component tags can be found in our [E2E test confulence documentation](https://sendtech.atlassian.net/wiki/spaces/TQ/pages/3697704966/Tagging)

### Run tests against a different environment
Make sure you have the .env file set up for the environment you want to run the tests on

```bash
NODE_ENV=uat npx playwright test
```

### How to Open Playwright Report 🎭

```bash
npx playwright show-report
```


## DOs and DON'Ts

### DOs

1. **Keep Code Clean**: Always run linting (`npm run pretest`) before committing your code to ensure it follows the coding standards.
2. **Run Tests**: Use `npm run test:dev` to run tests in the 'send-dev' environment.

### DON'Ts

1. **Ignore Linting Errors**: Do not ignore linting errors; always fix them before committing code.
2. **Skip Pretest**: Do not skip the `pretest` step as it ensures your code is formatted and follows the defined standards.