# node-pragmatic-practice
Simple node application based on "The Pragmatic Programmer" and [nodebestpracitice](https://github.com/goldbergyoni/nodebestpractices)

# How to set up a project with TypeScript

```
yarn init
yarn add --dev typescript ts-node ts-node-dev jest
npx tsc --init
mkdir src
mkdir dist
```

And config `./tsconfig.json` like the one in this project.

# How to set up Eslint and auto fix

```
yarn add -D eslint
yarn eslint --init
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
  "test": "jest --coverage --verbose"
}
```

# How to start Express application

We already wrote package.json, so that just execute a command below to start the Express application.  

```
yarn start
```

# viewディレクトリについて

Reactのフロントエンドのアプリです

もしS3などのCDNを使うのであればプロジェクトごと分けた方がいいのかもしれないが、フロントエンド込みでE2Eテストをする場合に完全に分かれているとdocker-composeの設定なども分けないといけなくなるので...

どうするのが正解なんだ....

# References

- [javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices/)
- [nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)