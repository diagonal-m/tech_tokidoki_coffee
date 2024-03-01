---
title: 個人的デザインパターン入門~Abstract Factory 編~
date: '2024-03-02'
tags: ['design', 'design pattern(生成)', 'abstract factory']
draft: false
summary: 'Abstract Factoryの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Abstract Factoryパターンとは

> Abstract Factoryパターンは、関連するオブジェクトのグループを作成するためのインタフェースを提供するデザインパターン。  
> クライアントが具体的なクラスを指定することなく、一連の関連するオブジェクトを生成できるようにする

## Abstract Factoryパターンの主な要素

- **AbstractFactory**: 抽象的なファクトリーのインタフェース。関連するオブジェクトのセットを作成するためのAPIを定義する。
- **AbstractProduct**: 抽象的な製品のインタフェース。個々の製品に共通のAPIを定義する。
- **ConcreteFactory**: `AbstractFactory`の具体的な実装。具体的な製品のインスタンスを生成する。
- **ConcreteProduct**: `AbstractProduct`の具体的な実装。具体的な製品のインスタンスを表す。

## Abstract Factoryのメリット・デメリット
**メリット**  
- **具体的なクラスの隠蔽**: クライアントコードは具体的な製品のクラスを知る必要がなく、インタフェースを通じてオブジェクトを操作できる
- **整合性の保持**: 関連するオブジェクト群の整合性が保ちやすくなる

**デメリット**  
- **複雑性の増加**: 多くのクラスが必要になるため、システムが複雑になる可能性がある

## Abstract Factoryの使い所
- 関連するオブジェクト群を一貫して生成し、その整合性を保ちたい場合
- システムを構成するオブジェクト群を、異なる環境や条件で簡単に切り替えたい場合

## Abstract Factoryのクラス図

![abstract factory](/static/images/design/design_pattern/abstract_factory/abstract_factory.png)
- **CoffeeMachine**: インタフェース。コーヒーを淹れるためのメソッド`brew`を定義する
- **Grinder**: インタフェース。コーヒー豆を挽くためのメソッド`grind`を定義する
- **CoffeeEquipmentFactory**: インタフェース。コーヒー調理器具のファクトリーの役割を果たし、`createCoffeeMachine`と`createGrinder`メソッドを定義する
- **EspressoMachine**/**DripCoffeeMachine**: `CoffeeMachine`インターフェイスの具体的な実装。それぞれエスプレッソマシンとドリップコーヒーマシンを表す
- **BurrGrinder** と **BladeGrinder**: `Grinder`インターフェイスの具体的な実装。それぞれバーブラインダーとブレードグラインダーを表す
- **EspressoEquipmentFactory**と**DripCoffeeEquipmentFactory**: `CoffeeEquipmentFactory`インターフェイスの具体的な実装。それぞれエスプレッソとドリップコーヒーの調理器具セットを生成する

## Abstract Factoryの実装例

```typescript
export {}

interface CoffeeMachine {
    brew();
}

interface Grinder {
    grind();
}

interface CoffeeEquipmentFactory {
    createCoffeeMachine(): CoffeeMachine;
    createGrinder(): Grinder;
}

class EspressoMachine implements CoffeeMachine {
    brew() {
        console.log("エスプレッソを淹れました");
    }
}

class BurrGrinder implements Grinder {
    grind() {
        console.log("豆を挽きました");
    }
}

class EspressoEquipmentFactory implements CoffeeEquipmentFactory {
    createCoffeeMachine(): CoffeeMachine {
        return new EspressoMachine();
    }
    createGrinder(): Grinder {
        return new BurrGrinder();
    }
}

class DripCoffeeMachine implements CoffeeMachine {
    brew() {
        console.log("ドリップコーヒーを淹れました");
    }
}

class BladeGrinder implements Grinder {
    grind() {
        console.log("豆を挽きました（ブレードグラインダー）");
    }
}

class DripCoffeeEquipmentFactory implements CoffeeEquipmentFactory {
    createCoffeeMachine(): CoffeeMachine {
        return new DripCoffeeMachine();
    }
    createGrinder(): Grinder {
        return new BladeGrinder();
    }
}

function run(factory: CoffeeEquipmentFactory) {
    const coffeeMachine = factory.createCoffeeMachine();
    const grinder = factory.createGrinder();
    grinder.grind();
    coffeeMachine.brew();
}

run(new EspressoEquipmentFactory());
run(new DripCoffeeEquipmentFactory());
```

## まとめ

これは近々使い道がありそう