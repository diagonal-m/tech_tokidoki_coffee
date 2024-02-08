---
title: 個人的デザインパターン入門~Singleton 編~
date: '2024-02-07'
tags: ['design', 'design pattern(生成)', 'singleton']
draft: false
summary: 'Singletonの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Singleton パターンとは

> あるクラスのインスタンスがプログラム実行中にただ一つだけ存在することを保証する.  
> つまり、Singleton パターンを使用すると、クラスの新しいインスタンスを無制限に作成するのではなく、一つのインスタンスのみが生成され、アプリケーション全体で共有されるようになる。

※ Singleton はアンチパターンと言われることが多い

## Singleton の主な要素

**private なコンストラクタ**

- Singleton クラスのコンストラクタを private に設定することで、クラス外部からのインスタンス化を防ぐ。これにより、新たなインスタンスの生成を制限し、クラス内部でのみ Singleton インスタンスを生成できるようにする。

**唯一のインスタンスを得るための static メソッド**

- 通常、getInstance()という静的メソッドを提供し、このメソッドを通じて Singleton インスタンスにアクセスする。このメソッドは、クラスの唯一のインスタンスが既に存在するかどうかをチェックし、存在しない場合は新たにインスタンスを生成し、存在する場合は既存のインスタンスを返却する

**いつも同じインスタンスを返却する**

- getInstance()メソッドは、プログラム実行中にこのメソッドが呼び出されるたびに、常に同じ Singleton インスタンスを返却します。これにより、アプリケーション全体で同一のインスタンスが使用されることが保証される。

## Singleton のメリット・デメリット

**メリット**

- **クラスが 1 つのインスタンスしか持たないことを保証できる**: これにより、グローバルにアクセス可能な共有リソースやサービスに対して一貫性と制御を保つことができる
- **インスタンスが 1 つなのでメモリ効率が良い**: 複数のインスタンスを生成する代わりに、一つのインスタンスのみをメモリ上に保持するため、メモリ使用量を削減できる
- **最初にインスタンス化されたら以降は使い回しなので、生成コストがかからない**: 初期化にかかるコストが一度きりで済むため、特に初期化プロセスが複雑またはリソース集約型である場合に有効

**デメリット**

- **依存関係が非常にわかりにくくなる**: システム内の多くのコンポーネントが Singleton に依存すると、コードの理解が難しくなり、依存関係の追跡が複雑になる

- **Singleton が状態を保つ場合、密結合になる**: Singleton がアプリケーションの状態を持つ場合、その状態に依存するコンポーネント間で密結合が生じ、コンポーネントの独立性が損なわれる。

- **単体テストの実行が困難**: Singleton の使用は、テスト時にモックやスタブを使用することを困難にし、特定のテスト環境での振る舞いを模倣することが難しくなる。

- **マルチスレッドでの Singleton の扱いが難しい**: インスタンスの初期化時に複数のスレッドが競合すると、正しく一つのインスタンスのみを保証するための適切な同期が必要になる。不適切な実装は、予期せぬバグやパフォーマンスの問題を引き起こす可能性がある。

## Singleton の使い所

アプリケーション全体で共有される設定情報（例えば、環境設定やプリファレンス）を管理する場合、Singleton パターンはこれらの情報を一元管理しやすくする

- **リソース共有**: データベース接続やファイルシステム、ネットワーク接続のセッションなど、共有リソースに対するアクセスを管理する場合、Singleton パターンを使用すると、これらのリソースへのアクセスを効率的に制御できる。
- **ログ記録**: アプリケーションのログ記録システムを実装する場合、Singleton パターンを使用してログ記録クラスのインスタンスを一つに保つことで、アプリケーション全体で一貫したログ記録メカニズムを提供できる

## Singleton のクラス図

![singleton](/static/images/design/design_pattern/singleton/singleton.png)

- CoffeeMachine クラス: コーヒーを提供するマシンを表す Singleton クラスです。
  - `-instance`: CoffeeMachine 型のプライベート静的変数で、クラスの唯一のインスタンスを保持する。
  - `+getInstance()`: このパブリック静的メソッドは、CoffeeMachine クラスの唯一のインスタンスにアクセスするためのメソッド。インスタンスがまだ存在しない場合は新しく生成し、存在する場合はそのインスタンスを返す。
  - `-CoffeeMachine()`: コンストラクタはプライベート。これにより、クラス外部からのインスタンス化が防がれ、クラス内部でのみ CoffeeMachine のインスタンスを生成できるようにする。
  - `+brewCoffee()`: このパブリックメソッドは、コーヒーを淹れる機能を提供します。CoffeeMachine のインスタンスが存在する場合にのみアクセス可能。

## Singleton の実装例

```typescript
class CoffeeMachine {
  private static instance: CoffeeMachine

  // コンストラクタはprivateにすることで、外部からのインスタンス化を防ぐ
  private constructor() {
    console.log('A special coffee machine is initialized.')
  }

  // このメソッドを通じてのみCoffeeMachineのインスタンスにアクセスできる
  public static getInstance(): CoffeeMachine {
    if (!CoffeeMachine.instance) {
      CoffeeMachine.instance = new CoffeeMachine()
    }
    return CoffeeMachine.instance
  }

  public brewCoffee() {
    console.log('Brewing coffee...')
  }
}

function runCoffeeShop() {
  // コーヒーマシンのインスタンスを取得
  const machine1 = CoffeeMachine.getInstance()
  machine1.brewCoffee() // 最初の顧客がコーヒーを注文

  // 同じコーヒーマシンのインスタンスを再度取得
  const machine2 = CoffeeMachine.getInstance()
  machine2.brewCoffee() // 別の顧客がコーヒーを注文

  // machine1 と machine2 が同一のインスタンスであることを確認
  console.log(machine1 === machine2) // true を出力
}

runCoffeeShop()
```

## まとめ

うちにはほぼ使っていない、BALMUDA The Brew があります。
