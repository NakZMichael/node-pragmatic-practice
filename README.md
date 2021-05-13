# node-pragmatic-practice
Simple node application based on "The Pragmatic Programmer" and [nodebestpracitice](https://github.com/goldbergyoni/nodebestpractices)

# How to set up a project with TypeScript

```
yarn init
yarn add --dev typescript
npx tsc --init
mkdir src
mkdir public
```

And config `./sconfig.json` like the one in this project.

# How to set up Eslint and auto fix

```
yarn add -D eslint
yarn run eslint --init
```

And config `./.vscode/settings.json` like below

```
{
  "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
  },
}
```

# How to develop in a docker container

```
docker-compose build
docker-compose up -d
```

Then use the extension of Visual Studio Code, `Remote - Containers` and `ESLint`.

# How to test

Install packages below.

```
yarn add -D jest @types/jest ts-jest
```

Then add `jest.config.js` and write codes below.

```
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
```

Finaly, add script below to `package.json`.

```
{
  "test": "jest"
}
```

# How to start Express application

We already wrote package.json, so that just execute a command below to start the Express application.  

```
yarn start
```

