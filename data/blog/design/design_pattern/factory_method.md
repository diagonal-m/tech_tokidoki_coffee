---
title: 個人的デザインパターン入門~Factory Method 編~
date: '2024-02-10'
tags: ['design', 'design pattern(生成)', 'factory method']
draft: false
summary: 'Factory Methodの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Factory Method パターン とは

> Factory Method パターンは、オブジェクトの作成をサブクラスに委ねることで、インスタンス化のロジックをクライアントから分離するデザインパターン  
> 生成したいオブジェクトのコンストラクタを呼び出してインスタンスを生成するのではなく、親クラスに定義された生成用のメソッドを呼び出してインスタンスの生成を行う

## Factory Method パターンの主な要素

1. **Product(製品)**: 生成されるオブジェクトのインタフェースまたは抽象クラス
2. **ConcreteProduct(具象製品)**: Product の具体的な実装
3. **Creator(作成者)**: Product オブジェクトの生成に関するメソッド(Factory Method)を宣言するインタフェースまたは抽象クラス
4. **ConcreteCreator(具象作成者)**: Factory Method を実装し、ConcreteProduct のインスタンスを生成するクラス

## Factory Method のメリット・デメリット

**メリット**

- オープンクローズドの原則に違反することなく新しい Product を追加することができる
- オブジェクトの利用側とオブジェクトの結びつきを弱くすることができる

**デメリット**

- 単純なオブジェクト生成の場合、Factory Method パターンを導入することで設計が過剰になる可能性がある

## Factory Method の使い所

- オブジェクトの作成プロセスが複雑で、クライアントコードから分離したい場合
- 類似した複数種類のオブジェクトを生成する必要がある場合
- Product の種類や生成手順が頻繁に変更される可能性がある場合

## Factory Method のクラス図

![factory method](/static/images/design/design_pattern/factory_method/factory_method.png)

- **Coffee(Product)**: コーヒー製品を表すインタフェース。すべての具象製品はこのインタフェースを実装する
- **Americano, Espresso, Latte(ConcreteProduct)**: `Coffee`インタフェースの具体的な実装。それぞれ異なる種類のコーヒーを表す。
- **CoffeeShop(Creator)**: コーヒーを生成するための抽象クラス(またはインタフェース)。`createCoffee`メソッド(FactoryMethod)を宣言し、サブクラスで具体的なコーヒーのインスタンス生成を担当する
- **MyCoffeeShop(ConcreteCreator)**: `CoffeeShop`の具体的な実装。要求されたコーヒータイプに基づいて、適切な`Coffee`インスタンスを生成する。

## Factory Method の実装例

### Product(製品)と ConcreteProduct

```typescript
// Product(製品)
interface Coffee {
  brew(): void
}

// ConcreteProduct(具象製品)
class Americano implements Coffee {
  public brew(): void {
    console.log('Brewing an Americano.')
  }
}

class Espresso implements Coffee {
  public brew(): void {
    console.log('Brewing an Espresso.')
  }
}

class Latte implements Coffee {
  public brew(): void {
    console.log('Brewing a Latte.')
  }
}
```

### Creator(作成者)と ConcreteCreator(具体的な作業者)

```typescript
// Creator(作成者)
abstract class CoffeeShop {
  // Factory Method
  abstract createCoffee(type: String): Coffee

  orderCoffee(type: string): void {
    const coffee = this.createCoffee(type)
    console.log(`Order received. Preparing your ${type}...`)
    coffee.brew()
  }
}

// ConcreteCreator(具体的な作成者)
class MyCoffeeShop extends CoffeeShop {
  createCoffee(type: string): Coffee {
    switch (type) {
      case 'Americano':
        return new Americano()
      case 'Espresso':
        return new Espresso()
      case 'Latte':
        return new Latte()
      default:
        throw new Error(`Coffee type ${type} is not recognized.`)
    }
  }
}
```

### 使用例

```typescript
const coffeeShop = new MyCoffeeShop()

coffeeShop.orderCoffee('Americano')
coffeeShop.orderCoffee('Espresso')
coffeeShop.orderCoffee('Latte')
```

## まとめ

これはわりと出番ありそう
