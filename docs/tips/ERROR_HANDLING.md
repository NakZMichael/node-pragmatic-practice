## TODO: What I need to search about

- prototype chain
  - Object.setPrototypeOf(this, new.target.prototype);
- APMを調べる
- Validatorのライブラリを調べる
- アプリ用に定義されたErrorを作る。
- Errorハンドリングを一元化する
- ロガーを使う winston
- 未処理のPromiseを全て拾ってエラーハンドリングをする。

## Use Async-Await or promises for async error handling

You should avoid callback-hell.
Use Async-Await.

Example

```typescript
async function executeAsyncTask () {
  try {
    const valueA = await functionA();
    const valueB = await functionB(valueA);
    const valueC = await functionC(valueB);
    return await functionD(valueC);
  }
  catch (err) {
    logger.error(err);
  } finally {
    await alwaysExecuteThisFunction();
  }
}
```

## Use only the built-in Error object

Example of a basic way.

```typescript
// throwing an Error from typical function, whether sync or async
if(!productToAdd)
    throw new Error('How can I add new product when no value provided?');

// 'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));

// 'throwing' an Error from a Promise
const addProduct = async (productToAdd) => {
  try {
    const existingProduct = await DAL.getProduct(productToAdd.id);
    if (existingProduct !== null) {
      throw new Error('Product already exists!');
    }
  } catch (err) {
    // ...
  }
}
```

Example of a better way.

```typescript
// centralized error object that derives from Node’s Error
export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode: HttpCode, description: string, isOperational: boolean) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

// client throwing an exception
if(user == null)
    throw new AppError(commonErrors.resourceNotFound, commonHTTPErrors.notFound, 'further explanation', true)
```

## エラー処理を一元化し、ミドウェア内で処理をしない

```typescript
// DAL（データアクセスレイヤー）, ここではエラー処理を行いません
DB.addDocument(newCustomer, (error: Error, result: Result) => {
  if (error)
    throw new Error('Great error explanation comes here', other useful parameters)
});

// API route コード, 同期エラーと非同期エラーの両方を捕捉し、ミドルウェアへ進みます
try {
  customerService.addNew(req.body).then((result: Result) => {
    res.status(200).json(result);
  }).catch((error: Error) => {
    next(error)
  });
}
catch (error) {
  next(error);
}

// エラー処理ミドルウェア、一元化されたエラーハンドラに処理を委譲します
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const isOperationalError = await errorHandler.handleError(err);
  if (!isOperationalError) {
    next(err);
  }
});
```

```typescript
class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await logger.logError(err);
    await sendMailToAdminIfCritical();
    await saveInOpsQueueIfCritical();
    await determineIfOperationalError();
  };
}

export const handler = new ErrorHandler();
```

アンチパターン

```typescript
// エラーを直接的に処理するミドルウェア、Cron ジョブやテストエラーは誰が処理するのでしょうか？
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.logError(err);
  if (err.severity == errors.high) {
    mailer.sendMail(configuration.adminMail, 'Critical error occured', err);
  }
  if (!err.isOperational) {
    next(err);
  }
});
```

## Swagger または GraphQL を利用して API のエラーをドキュメント化する

## 見ず知らずの事象が起きたら潔くプロセスを終了する

TL;DR: 未知のエラーが発生した場合（プログラマーのエラー、ベストプラクティス 2.3 参照）、アプリケーションの健全性に不確実さがあります。一般的に、Forever や PM2 のようなプロセス管理ツールを利用してプロセスを慎重に再起動することが推奨されています。

さもないと: 不明な例外が発生した場合、一部のオブジェクトが不完全な状態（例えば、グローバルに使用されているイベントエミッタが内部的なエラーによりイベントを発火しなくなっている、など）になっている可能性があり、後に来るリクエストが失敗したり、予期せぬ挙動をしたりするかもしれません。

コード内のどこかで、エラーハンドラオブジェクトがエラー発生時にどのように処理するかを決定することに責任を負っているとき ー エラーが信頼されている場合は（すなわち、操作上のエラーのことです。ベストプラクティス 2.3 の説明を参照してください）、ログファイルに書き込むだけで十分かもしれません。不明なエラーの場合は、複雑になります ー 一部のコンポーネントが不完全な状態にあり、後に来るリクエストは失敗の対象となることを意味しています。例えば、シングルトンでステートフルなトークン発行者サービスが例外を投げて、保持していた状態を消失したと仮定しましょう ー これは、予期せぬ挙動をしたり、全てのリクエストが失敗する原因となっているかもしれません。このようなケースの場合は、プロセスを kill して、（Forever や PM2 などの）「再起動ツール」を利用してクリーンな状態からやり直してください。

Code Example: 

``` typescript
// 開発者は既知のエラーに対して error.isOperational=true とマークをつけることを仮定しています。ベストプラクティス 2.3 を参照してください
process.on('uncaughtException', (error: Error) => {
  errorManagement.handler.handleError(error);
  if(!errorManagement.handler.isTrustedError(error))
    process.exit(1)
});

// Node のエラーオブジェクトを継承した、集中化されたエラーオブジェクト
export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(description: string, isOperational: boolean) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

// エラー処理関連のロジックをカプセル化した、集中化されたエラーハンドラ
class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await logger.logError(err);
    await sendMailToAdminIfCritical();
    await saveInOpsQueueIfCritical();
    await determineIfOperationalError();
  };

  public isTrustedError(error: Error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

export const handler = new ErrorHandler();
```

### The best way is to crash

プログラマーのエラーから復帰する最も良い方法は直ちにクラッシュさせることです。プログラムがクラッシュしたときに自動的に再起動してくれるリスターターを備えた、プログラムを動かすべきです。リスターターを備えている場合、一時的なプログラマーのエラーに直面した際に、安定したサービスへと復旧させるための一番手っ取り早い方法は、クラッシュさせることになります。

### There are three schools of thoughts on error handling

エラー処理について、主に以下の3つの考え方があります:

1. アプリケーションをクラッシュさせ、再起動させる
2. 起こりうるすべてのエラーを処理し、決してクラッシュさせない
3. 上記 2 つをバランスよく取り入れたアプローチ

### No safe way to leave without creating some undefined brittle state

JavaScript における throw の挙動の性質上、参照をリークさせたり、不明瞭で不安定な状態を作り出したりすることなく、安全に「中断したところから再開する」方法はほぼありません。投げられたエラーに対応する最も安全な方法は、プロセスをシャットダウンすることです。もちろん、通常のウェブサーバーでは、多くのコネクションがオープン状態になっているかもしれず、エラーが他の誰かによって引き起こされたからといって、それらを急にシャットダウンすることは合理的ではありません。より良いアプローチは、エラーの引き金となったリクエストにエラーレスポンスを送り、他のリクエストは通常の時間内に終了するようにして、そのワーカーにおいて新しいリクエストの受信を停止することです。

## エラーの可視性を高めるために成熟したロガーを使用する

私たちはみな console.log を愛用していますが、明らかに Winston（非常に人気）や Pino（パフォーマンスにフォーカスした新参者）のような、評価が高く永続的なロガーが真面目なプロジェクトにおいて必須となります。一連のプラクティスやツール群は、より素早くエラーについての考察を行うことに役立ちます ー（１）ログレベルを使い分ける（debug、info、error）、（２）ロギングする際は、JSON オブジェクトとしてコンテキスト情報を提供する（下記の例を参照）、（３）（多くのロガーに組み込まれている）ログクエリ API やログビューアソフトウェアを使用して、ログの確認やフィルタリングを行う、（４）Splunk のような運用ツールを使用して、運用チームのためにログステートメントを公開し、まとめる

Example: Winston

```typescript
const logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)()
  ]
});

// ロガーを使用したカスタムコード
logger.log('info', 'Test Log Message with some parameter %s', 'some parameter', { anything: 'This is metadata' });
```

Example:ログフォルダをクエリする（エントリを検索する）

```typescript
const options = {
  from: Date.now() - 24 * 60 * 60 * 1000,
  until: new Date(),
  limit: 10,
  start: 0,
  order: 'desc',
  fields: ['message']
};

// 1日前から今にかけてのログを見つける
winston.query(options, (err, results) => {
  // results を受け取ってコールバックを実行する
});
```

### （ロガーのための）いくつかの要件を確認してみましょう:

- 各ログ行にタイムスタンプをつけましょう。これは非常に自明です ー 各ログエントリがいつ発生したのかをはっきりさせることができるはずです。
- ロギングフォーマットは、機械だけでなく人間にとっても容易に解釈できるものであるべきです。
- 複数の設定可能な送信先ストリームを許可しましょう。例えば、あるファイルにトレースログを書き込み、一方でエラーが発生した際は同様のファイルに書き込むと同時にエラーファイルにも書き込み、そして e メールを送信するかもしれません。

## お気に入りのテストフレームワークを使用してエラーフローをテストする

「ハッピー」パスをテストすることは、失敗をテストすることも同然です。良いテストコードカバレッジは、例外パスをテストすることを要求します。さもなければ、例外が実際に正しく処理されるという信用はありません。Mocha や Chai といったすべてのユニットテストフレームワークは、例外テストをサポートしています（下記のコード例参照）。もしすべての内部関数や例外をテストすることが面倒だと感じたら、REST API の HTTP エラーのみをテストすることに落ち着くかもしれません。

Example:Mocha と Chai を利用して正しい例外が投げられることを確認する

```typescript
describe('Facebook chat', () => {
  it('Notifies on new chat message', () => {
    const chatService = new chatService();
    chatService.participants = getDisconnectedParticipants();
    expect(chatService.sendMessage.bind({ message: 'Hi' })).to.throw(ConnectionError);
  });
});
```

Example:API が正しい HTTP エラーコードを返すことを確認する

```typescript
it('Creates new Facebook group', async () => {
  let invalidGroupInfo = {};
  try {
    const response = await httpRequest({
      method: 'POST',
      uri: 'facebook.com/api/groups',
      resolveWithFullResponse: true,
      body: invalidGroupInfo,
      json: true
    })
    // このブロックで下記コードを実行した場合、上記オペレーションではエラーが発生しなかったことを意味します
    expect.fail('The request should have failed')
  } catch(response) {
    expect(400).to.equal(response.statusCode);
  }
});
```

## APM 製品を利用してエラーとダウンタイムを発見する

TL;DR: モニタリング・パフォーマンス計測を行う製品（APM として知られています）は、コードベースや API をプロアクティブに計測し、見落としていたエラーやクラッシュ、処理の遅い部分を自動的にハイライトすることができます。

さもないと: API のパフォーマンスとダウンタイムの計測に多大な労力を費やしているかもしれませんが、現実のシナリオにおいてどの部分のコードが最も遅いのか、そしてそれらがどのように UX に影響を及ぼしているのか、あなたが気づくことは恐らくないでしょう。

例外 != エラーです。従来のエラー処理では、コードが関連する問題としての例外の存在を想定していましたが、アプリケーションエラーは処理の遅いコードの実行パス、API のダウンタイム、計算リソースの不足といった形で発生する可能性があります。そこで、最小限の設定で広範囲に渡る「埋もれた」問題をプロアクティブに検出することができるものとして、 APM 製品が役に立ちます。APM 製品の一般的な機能として、例えば HTTP の API がエラーを返した際のアラート、API の応答時間が閾値を下回った瞬間の検出、「コードの臭い」の検出、サーバーリソースをモニタリングする機能、IT メトリクスを確認できる運用管理ダッシュボード、そのほか多くの便利な機能があります。多くのベンダーは無料プランを提供しています。

## 未処理の reject された promise を捕捉する

TL;DR: promise の中で投げられた全ての例外は、開発者が明示的に処理を行うことを忘れていない限り、飲み込まれて破棄されます。たとえコードが process.uncaughtException をサブスクライブしていたとしてもです！process.unhandledRejection イベントに登録することで、この問題を乗り越えることができます。

さもないと: あなたのエラーは飲み込まれて、何のトレースも残しません。心配することは、何も残りません。

一般的に、モダンな Node.js/Express アプリケーションのコードの多くは、promise の中で実行されます ー .then ハンドラ、コールバック関数、あるいは catch ブロックのいずれかです。驚くべきことに、開発者が忘れずに .catch 節を追加しない限り、promise 内で投げられた例外は uncaughtException イベントハンドラで処理されず、消えてなくなります。最近の Node.js のバージョンでは、未処理の reject があった場合に警告メッセージを表示するようになりましたが、これは何かがうまくいっていないときに気づくのに役立つかもしれませんが、明らかに適切なエラー処理の方法ではありません。単純な解決策は、各 promise チェインコール内に .catch 節を追加することを絶対に忘れず、集中化されたエラーハンドラに処理をリダイレクトすることです。しかしながら、開発者の規律だけでエラー処理の方針を構築することは、いささか脆いものです。したがって、潔いフォールバックを利用すること、そして process.on('unhandledRejection', callback) をサブスクライブすることを強く推奨します ー これは、全ての promise エラーが、ローカルで処理されていなくても、確実に処理されることを保証します。

Bad Exampl: これらのエラーはどのエラーハンドラにも捕捉されません（unhandledRejection を除く）

```typescript
DAL.getUserById(1).then((johnSnow) => {
  // このエラーはただ消えるだけです
  if(johnSnow.isAlive === false)
      throw new Error('ahhhh');
});
```

Example: 未解決の promise や reject された promise を捕捉する

```typescript
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  // 未処理の promise の reject を捕捉しました
  // すでに未処理のエラーのためのフォールバックハンドラ（下記参照）を持っているので、
  // 投げて、処理させましょう
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  // 未処理のエラーを受信したので、処理を行い、再起動が必要かどうかを判断してください
  errorManagement.handler.handleError(error);
  if (!errorManagement.handler.isTrustedError(error))
    process.exit(1);
});
```

## 専用のライブラリを利用して引数の検証を高速に行う

## Always await promises before returning to avoid a partial stacktrace

TL;DR: Always do return await when returning a promise to benefit full error stacktrace. If a function returns a promise, that function must be declared as async function and explicitly await the promise before returning it

Otherwise: The function that returns a promise without awaiting won't appear in the stacktrace. Such missing frames would probably complicate the understanding of the flow that leads to the error, especially if the cause of the abnormal behavior is inside of the missing function

## Returning promises

to avoid holes in stacktraces when returned promises would be rejected, we must always explicitly resolve promises with await before returning them from functions

Anti pattern

```javascript
async function throwAsync(msg) {
  await null // need to await at least something to be truly async (see note #2)
  throw Error(msg)
}

async function returnWithoutAwait () {
  return throwAsync('missing returnWithoutAwait in the stacktrace')
}

// 👎 will NOT have returnWithoutAwait in the stacktrace
returnWithoutAwait().catch(console.log)
```

would log

```
Error: missing returnWithoutAwait in the stacktrace
    at throwAsync ([...])
```

Good Practice

```javascript
async function throwAsync(msg) {
  await null // need to await at least something to be truly async (see note #2)
  throw Error(msg)
}

async function returnWithAwait() {
  return await throwAsync('with all frames present')
}

// 👍 will have returnWithAwait in the stacktrace
returnWithAwait().catch(console.log)
```

would log

```
Error: with all frames present
    at throwAsync ([...])
    at async returnWithAwait ([...])
```