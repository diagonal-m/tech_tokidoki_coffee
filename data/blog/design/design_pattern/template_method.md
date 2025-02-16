---
title: 個人的デザインパターン入門~TemplateMethod 編~
date: '2024-02-01'
tags: ['design', 'design pattern', 'template method']
draft: false
summary: 'TemplateMethodの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Template Method パターン とは

デザインパターンの一つで「振る舞い」に関するパターンであり、以下のように説明できる。

> Template Method パターンは、親クラスで処理の骨組みを定義し、一部のステップを子クラスに移譲して具体的な実装を行う。
> Template Method はアルゴリズムの構造を変更せずに特定のステップの実装をサブクラスで変更することができる。

## Template Method パターンの主な要素

Template Method パターンの主な要素は以下

1. **Abstract Class(抽象クラス)**: 処理全体の抽象操作(またはデフォルトの操作)を定義する抽象クラス。テンプレートメソッドは、アルゴリズムのスケルトン(骨格)を定義し、その中で一連のステップ(抽象・具象)を実行する k
2. **Concrete Class(具体クラス):**: 抽象クラスを継承し、抽象メソッドをオーバーライドして具体的な実装を提供する。これにより、アルゴリズムの特定のステップをカスタマイズできる。

## Template Method のメリット・デメリット

**メリット**

1. 共通のアルゴリズムを抽象クラスに定義することで、重複するコードを減らすことができる
2. 処理全体の流れは変えずに、子クラスごとに一部の処理内容を変えることができる

**デメリット**

1. 子クラスが親クラスに依存するため、親クラスの変更が子クラスに影響を与える可能性がある
2. 子クラスで親クラスのメソッドの振る舞いを変えようとすると、リスコフの置換原則に違反する

## Template Method の使い所

1. 処理フローの全体構造を変えることなく、処理の一部だけが変更される場合  
   e.g.) データ処理やテストフレームワーク
2. 複数のクラスで似たような処理フローが使われるが、いくつかの処理が異なる場合に、コードの重複を避ける目的で使われる

## Template Method のクラス図

![template method](/static/images/design/design_pattern/template_method/template_method.png)

- **継承関係**: `LightRoastCoffee` と `DarkRoastCoffee` は共に `CoffeeDripTemplate` を継承する
- **抽象メソッド**: `addCoffeeGrounds` と `steep` は抽象メソッドで、サブクラスでの実装が必要。
- **テンプレートメソッド**: `dripCoffee` はテンプレートメソッドで、ドリッププロセスのステップを定義する。

## Template Method の実装例

```typescript
export {}

// 抽象クラス
abstract class CoffeeDripTemplate {
  // テンプレートメソッド
  dripCoffee() {
    this.boilWater()
    this.addCoffeeGrounds()
    this.pourWater()
    this.steep()
    this.serve()
  }

  // 共通のステップ
  boilWater() {
    console.log('お湯を沸かしています')
  }

  // 抽象メソッド: コーヒーの粉を追加
  abstract addCoffeeGrounds()

  // 共通のステップ
  pourWater() {
    console.log('コーヒーの粉にお湯を注いでいます')
  }

  // 抽象メソッド: 抽出時間
  abstract steep()

  // 共通のステップ
  serve() {
    console.log('コーヒーを提供します')
  }
}

// ライトローストコーヒーのクラス
class LightRoastCoffee extends CoffeeDripTemplate {
  addCoffeeGrounds() {
    console.log('ライトローストのコーヒー粉を追加しています')
  }

  steep() {
    console.log('2分間抽出します')
  }
}

// ダークローストコーヒーのクラス
class DarkRoastCoffee extends CoffeeDripTemplate {
  addCoffeeGrounds() {
    console.log('ダークローストのコーヒー粉を追加しています')
  }

  steep() {
    console.log('4分間抽出します')
  }
}

// 実行関数
function run() {
  const lightRoast = new LightRoastCoffee()
  const darkRoast = new DarkRoastCoffee()

  console.log('ライトローストコーヒーを作っています:')
  lightRoast.dripCoffee()
  console.log('')

  console.log('ダークローストコーヒーを作っています:')
  darkRoast.dripCoffee()
}

run()
```

## まとめ

浅煎りと深煎りの淹れ方は全然違う
