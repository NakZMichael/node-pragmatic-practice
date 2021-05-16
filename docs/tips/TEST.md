## TODO: What I need to search about

- 脆弱性を検査するツールを調べる。
- jestでタグをつける方法を調べる。
- sinon
- node-mock-http
- !をつけるときの意味は[ここをみて](https://google.github.io/styleguide/tsguide.html#type-and-non-nullability-assertions)


## 最低でも、API（コンポーネント）のテストを書く

## 各テスト名に 3 つの要素を含む

TL;DR: テストを要件レベルを表現することで、コード内部をよく知らない QA エンジニアや開発者に対しても説明的であるようにしてください。テスト名には、何がテストされていて（テスト対象のユニット）、どのような状況で、どのような結果が期待されているのかを記述してください。

さもないと: "Add product" という名付けられたテストが通らず、デプロイが失敗しました。これは、実際に何がうまく動作しなかったのかを示しているでしょうか？

- 何がテストされているのか？ 例: ProductsService.addNewProduct メソッド
- どのような状況、シナリオ下なのか？ 例: price という引数がメソッドに渡されていない
- 期待する結果は何か？ 例: 新しい製品（new product）が承認されない

Example

```typescript
//1. テスト対象のユニット
describe('Products Service', () => {
  describe('Add new product', () => {
    //2. シナリオ、そして 3. 期待する結果
    it('When no price is specified, then the product status is pending approval', () => {
      const newProduct = new ProductService().add(...);
      expect(newProduct.status).to.equal('pendingApproval');
    });
  });
});
```

Anti Pattern

```typescript
describe('Products Service', () => {
  describe('Add new product', () => {
    it('Should return the right status', () => {
      // えーと、このテストは何をチェックしているのでしょうか？シナリオと期待する結果は何でしょうか？
      const newProduct = new ProductService().add(...);
      expect(newProduct.status).to.equal('pendingApproval');
    });
  });
});
```

## AAA パターンを用いてテストを構成する

TL;DR: 上手に分けられた 3 つのセクションを利用してテストを構成してください: Arrange、Act、そして Assert (AAA) です。まず最初の部分でテストのセットアップを行い、次にテスト対象のユニットの実行、そして最後にアサーションフェーズに入ります。この構造に従うことで、コードを読む人がテストプランを理解するために頭脳の CPU を費やさないことが保証されます。

さもないと: メインコードを理解するのに長時間費やすだけでなく、今までシンプルな部分であったはずのもの（テスト）が、脳のリソースを奪います。

- 1 つ目のA - Arrange（アレンジ）: テストがシミュレートするシナリオにシステムの環境を設定するための、すべてのセットアップコードです。これには、テストコンストラクタ対象ユニットのインスタンス化、DB レコードの追加、オブジェクトのモック／スタブ、その他準備のためのコードが含まれるかもしれません。
- 2 つ目のA - Act（アクト）: テスト対象のユニットを実行します。通常、1 行のコードです。
- 3 つ目のA - Assert（アサート）: 得た値が期待する条件を満たすことを確認します。通常、1 行のコードです。

Example: AAA パターンで構成されたテスト

```typescript
describe.skip('Customer classifier', () => {
    test('When customer spent more than 500$, should be classified as premium', () => {
        //Arrange
        const customerToClassify = {spent:505, joined: new Date(), id:1}
        const DBStub = sinon.stub(dataAccess, 'getCustomer')
            .reply({id:1, classification: 'regular'});

        //Act
        const receivedClassification = customerClassifier.classifyCustomer(customerToClassify);

        //Assert
        expect(receivedClassification).toMatch('premium');
    });
});
```

Anti Pattern: アンチパターン: 分割無し、一塊の、解釈の難しいコード

```typescript
test('Should be classified as premium', () => {
        const customerToClassify = {spent:505, joined: new Date(), id:1}
        const DBStub = sinon.stub(dataAccess, 'getCustomer')
            .reply({id:1, classification: 'regular'});
        const receivedClassification = customerClassifier.classifyCustomer(customerToClassify);
        expect(receivedClassification).toMatch('premium');
    });
```

テストコード読者にとって重要なことは、テストがどんな挙動を検証しているのかすぐに判断できることです

## Describe expectations in a product language: use BDD(behavior-driven development)-style assertions

Right Example: declarative test

```javascript
it("When asking for an admin, ensure only ordered admins in results", () => {
  //assuming we've added here two admins
  const allAdmins = getUsers({ adminOnly: true });

  expect(allAdmins)
    .to.include.ordered.members(["admin1", "admin2"])
    .but.not.include.ordered.members(["user1"]);
});
```

Anti pattern: The reader must skim through not short code.

```javascript
test("When asking for an admin, ensure only ordered admins in results", () => {
  //assuming we've added here two admins "admin1", "admin2" and "user1"
  const allAdmins = getUsers({ adminOnly: true });

  let admin1Found,
    adming2Found = false;

  allAdmins.forEach(aSingleUser => {
    if (aSingleUser === "user1") {
      assert.notEqual(aSingleUser, "user1", "A user was found and not admin");
    }
    if (aSingleUser === "admin1") {
      admin1Found = true;
    }
    if (aSingleUser === "admin2") {
      admin2Found = true;
    }
  });

  if (!admin1Found || !admin2Found) {
    throw new Error("Not all admins were returned");
  }
});
```

### How to write declaretive test with Jest

Check [this Jest page](https://jestjs.io/docs/expect#expectextendmatchers),especially `expect.extend(matchers)`.

## Stick to black-box testing: Test only public methods. Don't test private methods or private properties.

If you test private methods or properties, your test might break because of minor code refactors although the results are fine - this dramatically make the maintenance cost bigger.

## Choose the right test doubles: Use stubs and spies. Avoid mocking.

Do you use test doubles to test functionality that doesn't appear in the requirements document? 
If yes, it’s probably a white-box test.

If you use mock that it was called with the right JavaScript types — then your test is focused on internal and are likely to change frequently. Then any refactoring of code require searching for all the mocks in the test code and updating accordingly. Tests become a burden rather than a helpful friend.

Anti-pattern example: Mocks focus on the internals

```javascript
it("When a valid product is about to be deleted, ensure data access DAL was called once, with the right product and right config", async () => {
  //Assume we already added a product
  const dataAccessMock = sinon.mock(DAL);
  //hmmm BAD: testing the internals is actually our main goal here, not just a side-effect
  dataAccessMock
    .expects("deleteProduct")
    .once()
    .withArgs(DBConfig, theProductWeJustAdded, true, false);
  new ProductService().deletePrice(theProductWeJustAdded);
  dataAccessMock.verify();
});
```

Right Example: spies are focused on testing the requirements but as a side-effect are unavoidably touching to the internals

```javascript
it("When a valid product is about to be deleted, ensure an email is sent", async () => {
  //Assume we already added here a product
  const spy = sinon.spy(Emailer.prototype, "sendEmail");
  new ProductService().deletePrice(theProductWeJustAdded);
  //hmmm OK: we deal with internals? Yes, but as a side effect of testing the requirements (sending an email)
  expect(spy.calledOnce).to.be.true;
});
```

## Don’t use “foo”, use realistic input data

Often production bugs are revealed under some very specific and surprising input — the more realistic the test input is, the greater the chances are to catch bugs early. 

Use dedicated libraries like Faker to generate pseudo-real random data that resembles the variety and form of production data. 


## Test many input combinations using Property-based testing

Example: Testing many input permutations with “fast-check”

```javascript
import fc from "fast-check";

describe("Product service", () => {
  describe("Adding new", () => {
    //this will run 100 times with different random properties
    it("Add new product with random yet valid properties, always successful", () =>
      fc.assert(
        fc.property(fc.integer(), fc.string(), (id, name) => {
          expect(addNewProduct(id, name).status).toEqual("approved");
        })
      ));
  });
});
```

## If needed, use only short & inline snapshots

スナップショットしたことないから良く分からんけど一応書いとく。あとで試してみること。

Anti-Pattern Example: Coupling our test to unseen 2000 lines of code

```javascript
it("TestJavaScript.com is renderd correctly", () => {
  //Arrange

  //Act
  const receivedPage = renderer
    .create(<DisplayPage page="http://www.testjavascript.com"> Test JavaScript </DisplayPage>)
    .toJSON();

  //Assert
  expect(receivedPage).toMatchSnapshot();
  //We now implicitly maintain a 2000 lines long document
  //every additional line break or comment - will break this test
});
```

Right Example: Expectations are visible and focused

```javascript
it("When visiting TestJavaScript.com home page, a menu is displayed", () => {
  //Arrange

  //Act
  const receivedPage = renderer
    .create(<DisplayPage page="http://www.testjavascript.com"> Test JavaScript </DisplayPage>)
    .toJSON();

  //Assert

  const menu = receivedPage.content.menu;
  expect(menu).toMatchInlineSnapshot(`
<ul>
<li>Home</li>
<li> About </li>
<li> Contact </li>
</ul>
`);
});
```

## Linter を用いてコードの問題を検出する

## グローバルなテストフィクスチャとシードを避け、テストごとにデータを追加する

TL;DR: テスト同士が結合してしまうことを防ぎ、テストフローの理解を容易にするために、各テストは独自の DB データ行のセットを用意し、それらを利用して実行されるべきです。テストがいくつかの DB データをプルしたり、その存在を仮定する必要がある場合には、明示的にデータを追加し、他のレコードに変更を加えないようにしなければなりません。

さもないと: テストが失敗したことによってデプロイが中止されるというシナリオを考えてみましょう。チームは貴重な時間を調査に費やし、結果として悲しい結論にたどり着きます: システムは機能していますが、テスト同士が干渉しあって、ビルドを壊しているのです。

テストケースをこれ以上ないほどシンプルに保つ、という黄金のテストルールに則り、各テストは、テスト同士が結合するのを防ぎ、テストフローの理解を容易にするために、各自のデータセットを用意して実行されるべきです。実際には、これはしばしば、パフォーマンス向上を目的としてテストを実行する前に DB にシードデータを与える（「テストフィクスチャ」としても知られています）テスターによって違反されています。もちろんパフォーマンスは懸念するべき事項ではありますが、それは緩和することができます（例えば、インメモリ DB、「最低でも、API（コンポーネント）のテストを書く」の項目を参照してください）。しかしながらテストの複雑さは、他の懸念事項を凌駕するほどの、はるかに痛みを伴う悲痛の種です。現実的には、各テストケースに必要な DB レコードを明示的に追加させ、それらのレコード上でのみ実行させるべきです。もしパフォーマンスがクリティカルな懸念事項になる場合には、バランスを考慮した妥協案として、データに変更を加えない唯一のテストスイート（例えば、クエリ）をシードする、という形がありえます。

Anti pattern:アンチパターン: テストが独立しておらず、事前に整えられたデータの存在を仮定している

Anti pattern

```typescript
before(() => {
  // サイトと管理者のデータを DB に追加しています。データはどこにあるのでしょうか？外部ファイルです。外部の json ファイルか、もしくは マイグレーションフレームワークです。
  await DB.AddSeedDataFromJson('seed.json');
});
it('When updating site name, get successful confirmation', async () => {
  // 私は「Portal」という名前のサイトがあることを知っています - シードファイル上で確認したのです
  const siteToUpdate = await SiteService.getSiteByName('Portal');
  const updateNameResult = await SiteService.changeName(siteToUpdate, 'newName');
  expect(updateNameResult).to.be(true);
});
it('When querying by site name, get the right site', async () => {
  // 私は「Portal」という名前のサイトがあることを知っています - シードファイル上で確認したのです
  const siteToCheck = await SiteService.getSiteByName('Portal');
  expect(siteToCheck.name).to.be.equal('Portal'); // 失敗しました！前のテストがサイト名を変更しています :[
});
```

## Don’t catch errors, expect them

Anti-pattern Example: A long test case that tries to assert the existence of error with try-catch

```javascript
it("When no product name, it throws error 400", async () => {
  let errorWeExceptFor = null;
  try {
    const result = await addNewProduct({});
  } catch (error) {
    expect(error.code).to.equal("InvalidInput");
    errorWeExceptFor = error;
  }
  expect(errorWeExceptFor).not.to.be.null;
  //if this assertion fails, the tests results/reports will only show
  //that some value is null, there won't be a word about a missing Exception
});
```

Right Example: A human-readable expectation that could be understood easily, maybe even by QA or technical PM

```javascript
it("When no product name, it throws error 400", async () => {
  await expect(addNewProduct({}))
    .to.eventually.throw(AppError)
    .with.property("code", "InvalidInput");
});
```

## 脆弱性のある依存関係がないか常に検査する

TL;DR: Express のような最も評判の良い依存関係にも、既知の脆弱性があります。これは、ビルド毎に CI において実行できる 🔗 npm audit や 🔗 snyk.io といったコミュニティや商用のツールを利用することで、簡単に検査することができます。

さもないと: 専用のツールを使用せずに、コードを安全に保つには、新しい脅威についての情報を、常に追う必要があります。これは非常に面倒です。

## テストにタグをつける

TL;DR: 異なるテストは、異なるシナリオ下において実行しなければなりません: I/O の無いクイックスモークテストは、開発者がファイルを保存したりコミットした際に実施し、完全なエンドツーエンドテストは新しいプルリクエストが出されたときに実施する、などです。これは、テストの手綱を掴んで望み通りのテストセットを実行できるように、 #cold #api #sanity といったようにキーワードでテストをタグ付けすることで実現できます。例えば、Mocha を利用して sanity テストグループを実施する方法は次の通りです: mocha --grep 'sanity'

さもないと: 小さな変更をするたびに多くの DB クエリを実施するテストを含む全てのテストを実行することは、非常に遅く、そして開発者がテストを実行しなくなります。

Right Example: Tagging tests as ‘#cold-test’ allows the test runner to execute only fast tests (Cold===quick tests that are doing no IO and can be executed frequently even as the developer is typing)

```javascript
//this test is fast (no DB) and we're tagging it correspondigly
//now the user/CI can run it frequently
describe("Order service", function() {
  describe("Add new order #cold-test #sanity", function() {
    test("Scenario - no currency was supplied. Expectation - Use the default currency #sanity", function() {
      //code logic here
    });
  });
});
```

## Categorize tests under at least 2 levels

A common method for this is by placing at least 2 'describe' blocks above your tests: the 1st is for the name of the unit under test and the 2nd for additional level of categorization like the scenario or custom categories (see code examples and print screen below).

Right Example: Structuring suite with the name of unit under test and scenarios will lead to the convenient report that is shown below

```javascript
// Unit under test
describe("Transfer service", () => {
  //Scenario
  describe("When no credit", () => {
    //Expectation
    test("Then the response status should decline", () => {});

    //Expectation
    test("Then it should send email to admin", () => {});
  });
});
```

Anti-pattern Example: A flat list of tests will make it harder for the reader to identify the user stories and correlate failing tests

```javascript
test("Then the response status should decline", () => {});

test("Then it should send email", () => {});

test("Then there should not be a new transfer record", () => {});
```

## Other generic good testing hygiene

TDDを学ぼう

## 間違ったテストパターンを特定するためにテストカバレッジをチェックする

TL;DR: Istanbul/NYC のようなコードカバレッジツールは 3 つの理由から素晴らしいといえます: 無料で提供されている（このレポートの恩恵を受けるために努力は必要ありません）、テストカバレッジの低下を特定するのに役立つ、そして最後に、テストのミスマッチを強調してくれることです。色付けされたコードカバレッジレポートを見ることで、例えば、キャッチ句のようなテストが全く実施されていない領域（つまり、テストがハッピーパスのみテストしていて、エラー時にどのように振る舞うかをテストしていない、ということです）に気づくかもしれません。カバレッジが特定に閾値を下回ったらビルドが失敗するように設定しましょう。

さもないと: コードの大部分がテストでカバーされていないことを教えてくれる、自動化されたメトリックが存在しないことになります。

## パッケージが古くなっていないか点検する

TL;DR: お気に入りのツール（例えば、「npm outdated」や「npm-check-updates」など）を使って、インストールされたパッケージが古くなっていることを検出し、このチェックを CI パイプラインの中に組み込み、深刻な場合にはビルドを失敗させてください。深刻な場合とは例えば、インストールされているパッケージが 5 回のパッチコミット分遅れている場合（例えば、ローカルバージョンが 1.3.1 でリポジトリバージョンが 1.3.8 である、など）や、作者によって非推奨とタグ付けされている場合などがあります。ビルドをキルして、このバージョンのデプロイを禁止してください。

さもないと: 作者によって明示的に危険であるとタグ付けされたパッケージを、本番環境で実行することになります。

## エンドツーエンドテストのために本番に近い環境を使用する

TL;DR: ライブデータを含むエンドツーエンド（e2e）テストは、DB のような複数の重たいサービスに依存するため、CI プロセスにおける最も弱い接続部となっていました。できる限り本番環境に近い環境を使用してください（注意: コンテンツが不足しています。「さもないと」から判断するに、docker-compose について言及されているはずです）

さもないと: docker-compose を使用しない場合、チームは開発者のマシンを含む各テスト環境のためのテスト DB を管理し、環境によって結果に差異が出ないようにそれらすべての DB が同期された状態を保たなくてはなりません。

## 静的解析ツールを使用して定期的にリファクタリングする

TL;DR: 静的解析ツールを利用することは、客観的な視点をもたらし、コードの品質向上や保守性の維持に役立ちます。静的解析ツールを CI に追加することで、コードの臭いを発見した際にビルドを失敗させることができます。シンプルな linting に勝るポイントとしては、複数ファイルを含むコンテキストで品質を検査できること（例：重複の検出）、高度な分析を実施できること（例：コードの複雑さ）、そしてコードの問題の履歴や進行状況を追跡できることです。使用できるツールの例としては、Sonarqube (2,600+ stars) と Code Climate (1,500+ stars) の 2 つがあります。

さもないと: コードの品質が低いと、ピカピカの新しいライブラリや最新の機能では修正できない類のバグやパフォーマンスが常に問題となります。

リファクタリングは反復開発フローにおいて重要なプロセスです。重複したコード、長いメソッド、長いパラメータリストといった「コードの臭い」（悪いコーディングプラクティス）を取り除くことで、コードが改善し、保守性が向上します。静的解析ツールを使用することは、そういったコードの臭いを発見しリファクタリングを中心としたプロセスを構築するのに役立ちます。こういったツールを CI に導入することで、品質チェックプロセスを自動化することができます。CI が Sonar や Code Climate といったツールと統合されている場合、コードの臭いを検出した際にビルドを失敗させ、作者に問題の対処方法を知らせます。これらの静的解析ツールは、ESLint のような lint ツールを補うものです。多くの linting ツールは、単一ファイルにおけるインデントやセミコロンの付け忘れ（長い関数のようなコードの臭いを見つけるものもありますが）といったコードスタイルにフォーカスしますが、静的解析ツールは単一のファイルおよび複数のファイルにおいてコードの臭いを発見する（重複したコード、複雑性解析など）ことにフォーカスしています。

## CI プラットフォームを慎重に選択する（Jenkins vs CircleCI vs Travis vs その他すべて）

TL;DR: 継続的インテグレーションプラットフォーム (CI/CD) は全ての品質に関わるツール（テストや lint など）をホストするので、プラグインのエコシステムが充実しているはずです。Jenkins は最大のコミュニティを持ち、非常に強力なプラットフォームであるため、多くのプロジェクトでデフォルトとして使われていましたが、複雑なセットアップと多大な学習コストが難点でした。最近では、CircleCI のような SaaS ツールを使用することで、CI ソリューションをセットアップすることが非常に簡単になってきました。こういったツールは、インフラ全体の管理にコストをかけることなく柔軟な CI パイプラインを構築することを可能にします。最終的には、堅牢性とスピードの間のトレードオフとなります ー 慎重にどちらを取るか選んでください。

さもないと: ニッチなベンダーを選択すると、高度なカスタマイズが必要になった際に困るかもしれません。一方で、Jenkins を選択するとインフラのセットアップに貴重な時間を費やすことになる可能性があります。

## ミドルウェアを分離してテストする

TL;DR: ミドルウェアが多くのリクエストにまたがる巨大なロジックを保持している場合は、ウェブフレームワーク全体を起動することなく、分離してテストする価値があります。これは、{req, res, next} オブジェクトをスタブ化してスパイすることで容易に達成することができます。

さもないと: Express ミドルウェアにおけるバグ === ほぼ全てのリクエストにおけるバグ

ミドルウェアはシステムのごく一部であり、Express を起動させる必要があるため、多くの人はミドルウェアのテストを避けます。しかし、どちらの理由も間違っています ー ミドルウェアは小さいですが、すべて、あるいはほとんどのリクエストに影響を及ぼすものであり、{req, res} という JS オブジェクトを取得する純粋な関数として簡単にテストできます。ミドルウェア関数をテストするためには、その関数を呼び出して、関数が正しく動作していることを確認するために、{req, res} オブジェクトとのやり取りを（例えば Sinon を使用して）スパイするべきです。node-mock-http というライブラリは、これをさらに発展させ、{req, res} オブジェクトの動作をスパイしながら、そのオブジェクトに要素付けします。例えば、res オブジェクトに設定された http ステータスが期待値と一致しているかどうかを判定することができます（下記の例を参照してください）。

Example: ミドルウェアを分離してテストする

```typescript
// テストしたいミドルウェア
const unitUnderTest = require("./middleware");
const httpMocks = require("node-mocks-http");
// Jest シンタックス、Mocha における describe() と it() と同様
test("A request without authentication header, should return http status 403", () => {
  const request = httpMocks.createRequest({
    method: "GET",
    url: "/user/42",
    headers: {
      authentication: ""
    }
  });
  const response = httpMocks.createResponse();
  unitUnderTest(request, response);
  expect(response.statusCode).toBe(403);
});
```

