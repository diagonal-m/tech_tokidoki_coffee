---
title: 個人的デザインパターン入門~Facade 編~
date: '2024-02-10'
tags: ['design', 'design pattern', 'facade']
draft: false
summary: 'Facadeの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Facade パターン とは

> Facade(ファサード)パターンは、複雑なサブシステムに対して統一されたインタフェースを提供する構造パターン。  
> このパターンは、サブシステムの使用を簡単にし、クライアントとサブシステムの間の依存関係を減らすことを目的としている。

## Facade パターンの主な要素

1. **Facade**: サブシステムの複雑さを隠蔽し、クライアントに対して簡単なインタフェースを提供する
2. **Subsystems**: Facade を通じてアクセスされる一連の複雑なクラス群。これらは具体的な機能や処理を担う

## Facade のメリット・デメリット

**メリット**

- システムの使用を簡素化し、クライアントから見たときの複雑さを減らす
- システムの各部分間の結合度を低減し、サブシステムの独立性を高める

**デメリット**

- すべての処理を Facade に集約しすぎると、Facade 自体が複雑になる可能性がある

## Facade の使い所

- 異なるサブシステム間の結合度を低減させたい場合
- サブシステムを独立して開発またはテストしたい場合

## Facade のクラス図

![facade](/static/images/design/design_pattern/facade/facade.png)

- **CoffeeShopFacade**: このクラスは Facade で、コーヒードリッププロセス全体を単一のインタフェース(`prepareCoffee`メソッド)を通じて提供する。クライアントはこのインタフェースを使って、コーヒーを調理する複雑なプロセスを簡単に実行できる
- **Grinder, WaterHeater, CoffeeMaker, CoffeeServer**: これらはサブシステムで、コーヒー調理プロセスの各ステップを担う。各クラスは特定のタスク(豆の挽き方、水の加熱、コーヒーの抽出、サービング)を実行するメソッドを提供する。

## Facade の実装例

### サブシステムクラス

```typescript
// サブシステム1: コーヒー豆の挽き方
class Grinder {
  grindBeans() {
    console.log('Grinding coffee beans.')
  }
}

// サブシステム2: 水の温度
class WaterHeater {
  heatWater() {
    console.log('Heating water to the perfect temperature.')
  }
}

// サブシステム3: コーヒーの抽出
class CoffeeMaker {
  brewCoffee() {
    console.log('Brewing the coffee.')
  }
}

// サブシステム4: サービング
class CoffeeServer {
  serveCoffee() {
    console.log('Serving the coffee.')
  }
}
```

### Facade クラス

```typescript
class CoffeeShopFacade {
  private grinder = new Grinder()
  private waterHeater = new WaterHeater()
  private coffeeMaker = new CoffeeMaker()
  private server = new CoffeeServer()

  prepareCoffee() {
    console.log('Coffee preparation process has started...')
    this.grinder.grindBeans()
    this.waterHeater.heatWater()
    this.coffeeMaker.brewCoffee()
    this.server.serveCoffee()
    console.log('Enjoy your coffee!')
  }
}
```

### クライアントコード

```typescript
const coffeeShop = new CoffeeShopFacade()
coffeeShop.prepareCoffee()
```

## まとめ

最近、継承より委譲の方が何かと都合がいいのではと思い始めてきている。
