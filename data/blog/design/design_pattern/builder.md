---
title: 個人的デザインパターン入門~Builder 編~
date: '2024-03-01'
tags: ['design', 'design pattern', 'builder']
draft: false
summary: 'Builderの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Builderパターンとは

> 同じ生成手順で異なる材料を使って異なるオブジェクトを生成するパターン  
> オブジェクトの構築とその表現を分離し、同じ構築プロセスで異なる表現を生成できるようにする

## Builderパターンの主な要素
1. **Builder**: オブジェクトの構築手順を定義するインタフェース(or 抽象クラス)
2. **ConcreteBuilder**: Builderインタフェースを実装し、具体的なオブジェクトの構築を行う
3. **Director**: Builderインタフェースを使用して、オブジェクトの構築手順を定義する
4. **Product**: 構築されるオブジェクト

## Builderのメリット・デメリット
**メリット**  
- 生成されるオブジェクトの生成過程や生成手順を隠すことができる
- オブジェクト構築用のコードをビジネスロジックから分離させる

**デメリット**
- 複数のクラスを作成する必要があり、過剰な設計となる可能性がある

## Builderの使い所
- 複雑なオブジェクトの構築過程がステップバイステップで行われる場合。
- 同じ構築プロセスで異なる表現のオブジェクトを生成したい場合。
- オブジェクトの構築過程をさまざまな表現で柔軟に変更したい場合。

## Builderのクラス図

![builder](/static/images/design/design_pattern/builder/builder.png)
- **Coffee**: 製品クラス
- **CoffeeBuilder**: インタフェース。コーヒーの構築手順を定義する
- **EspressoBuilder**: CoffeeBuilderの具体的な実装。エスプレッソのドリッププロセスを実装し、最終的なCoffeeオブジェクトを返す
- **LatteBuilder**: CoffeeBuilderの具体的な実装。ラテの調理プロセスを実装し、最終的な`Coffee`オブジェクトを返す
- **Director**: 構築手順を定義するクラス。CoffeeBuilderを使用して普通のコーヒーと特別なコーヒーを構築する

## Builderの実装例

```typescript
export {};

class Coffee {
    type: string;
    beans: string;
    milk: number;
}

interface CoffeeBuilder {
    addBeans(beans: string);
    addMilk(milk: number);
}

class EspressoBuilder implements CoffeeBuilder {
    private coffee: Coffee;

    constructor() {
        this.coffee = new Coffee();
        this.coffee.type = "Espresso";
    }

    addBeans(beans: string) {
        this.coffee.beans = beans;
    }

    addMilk(milk: number) {
        this.coffee.milk = 0; // エスプレッソにはミルクを加えない
    }

    getResult(): Coffee {
        return this.coffee;
    }
}

class LatteBuilder implements CoffeeBuilder {
    private coffee: Coffee;

    constructor() {
        this.coffee = new Coffee();
        this.coffee.type = "Latte";
    }

    addBeans(beans: string) {
        this.coffee.beans = beans;
    }

    addMilk(milk: number) {
        this.coffee.milk = milk;
    }

    getResult(): Coffee {
        return this.coffee;
    }
}

class Director {
    constructor(private builder: CoffeeBuilder) {}

    makeStandardCoffee() {
        this.builder.addBeans("Arabica");
        this.builder.addMilk(150);
    }

    makeSpecialCoffee() {
        this.builder.addBeans("Robusta");
        this.builder.addMilk(0);
    }
}

function run() {
    const espressoBuilder = new EspressoBuilder();
    const espressoDirector = new Director(espressoBuilder);
    espressoDirector.makeStandardCoffee();
    const espressoCoffee = espressoBuilder.getResult();
    console.log(espressoCoffee);

    const latteBuilder = new LatteBuilder();
    const latteDirector = new Director(latteBuilder);
    latteDirector.makeSpecialCoffee();
    const latteCoffee = latteBuilder.getResult();
    console.log(latteCoffee);
}

run();
```

## まとめ
美味しくないコーヒーはミルクで誤魔化します
