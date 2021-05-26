# Expressを使うときのTIPS

このtipsは僕の私見を多分に含んでいるのでベストプラクティスと呼べるかは怪しいです。

## ハンドラーのラッパーに必要な機能

まず、Expressを使う時はプロジェクト全体で共通のラッパーを作った方がいいと思います。
理想的にはリクエストやレスポンスをExpressに依存しない形で独自に定義したハンドラーを使って、ラッパーはそれをExpressのRequest型やResponse型とよしなにやってくれるアダプターにするというのがベストだと思いますし、Node Best Practicesにはそうするように書いてました。

ただ、私見ですが、RequestやResponseを全部自分で定義するというのはいささか手間がかかりすぎると思います。
なので、ExpressのRequestやResponseにはガッツリ依存した上で追加の引数を追加するのが現状手取り早い気がします。要するにハンドラの型を以下のようにするということです。

```typescript
type AppContext = {
  requestId: string
  // 他にハンドラ内で使いたいフィールド
  // level: string とか
  // ...
  // ...
}
type AppHandler = (req:Request, res:Response, context:AppContext) => Promise<void>
```

- async/awaitのデフォルトでのサポート
  - Expressでは非同期的なハンドラーの中でキャッチされないエラーが起こった場合はエラーハンドラまで運ばれず、`UnhandledPromiseRejectionWarning`になってしまう。
  - 他のサーバーのAPIを叩いたりデータベースを操作しないハンドラというのは実質ほぼないと思うので全て非同期だと仮定してさほど問題はないと思われる。
- ロガーを使いやすくする。
  - 通常、サーバーでロギングをするときはResponseのステータスコードなども合わせてロギングしたいと思うが、以下の`app.get()`や`app.post()`内で`next()`メソッドを使ってしまうと、最後に配置されている404エラー用のハンドラに処理が移ってしまい。正しいリクエストにも関わらず、ステータスに404を書き込もうとする。(多くの場合、それは失敗するがログを汚してしまうだろう。)
  - ロガーはストラテジーパターンを使って変えられるようにしておく、ユーザーごとに好みのロギング用のライブラリがあると思うので特定のメソッドを自分で定義したロガーさえ作ってくれれば何でも使えるようにする。(一応、pinoを想定したインターフェースで作っておく)
- エラーハンドリングはExpressのエラーハンドリングの機構に任せる
  - サードパーティーのミドルウェア内でのエラーも正しくロギングする必要があるので、これはラッパーのスコープの範囲外とする。
  - ラッパーがやるのは非同期関数ないで起こったエラーをcatchしてExpressのエラーハンドラに投げるところまで


## 簡単な実装例のアイデア

コンテキストはジェネリクスを使って自由度を残した方がいい気もするがライブラリとして公開しないのであれば、固定した型で問題ないと思います。

```typescript
function handlerWrapper(handler:AppHandler,logger:AppLoger,ctxInitializer:ContextInitializer):ExpressHandler{
  return (req, res, next ) => {
    let context = ctxInitializer()
    // 非同期関数をここで処理する。
    // 成功した場合はここでロギングをする。
    // エラーが発生した場合はnext(error)のようにしてエラーハンドラに引き渡す。
    // エラーが発生した際のロギングはExpressのエラーハンドリングの機構に任せる。
    handler(req,res,context).then(logger.log).catch(next)
  }
}
```