---
title: 個人的デザインパターン入門~Prototype 編~
date: '2024-02-29'
tags: ['design', 'design pattern', 'prototype']
draft: false
summary: 'Prototypeの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Prototype パターン とは

> 原型となるインスタンスをコピーして新しいインスタンスを生成するパターン  
> オブジェクトの作成が複雑またはコストが高い場合に、既存のインスタンスをプロトタイプとして利用して新しいインスタンスを効率的に生成する 

## シャローコピー(浅いコピー)とディープコピー(深いコピー)
### シャローコピー
- 変数に格納された値がそのままコピーされる
- オブジェクトの参照を格納した変数では、参照がコピーされる
  → どちらかのオブジェクトを変更すると、もう片方も変更される

### ディープコピー
- オブジェクトの参照を格納した変数では、実態がコピーされる
  → どちらかのオブジェクトを変更しても、もう片方に影響を与えない

## Prototypeの主な要素
1. **Prototype**: インスタンスをコピーして新しいインスタンスを作成されるためのメソッドを持つ、インタフェース(or 抽象クラス)
2. **ConcretePrototype**: Prototypeインタフェースを実装し、自身の複製を作成する方法を提供するクラス 

## Prototypeのメリット・デメリット
**メリット**  
- オブジェクトの生成処理を隠蔽できる
- 構築済みのプロトタイプのクローンの作成を使うことにより、初期化コードの重複を削減

**デメリット**  
- ディープコピーとシャローコピーの違いを理解し、適切に処理する必要がある

## Prototypeの使い所
- オブジェクトの作成コストが高い場合や、クライアントが具体的なクラスを知らずにオブジェクトを生成したい場合

## Prototypeのクラス図

![prototype](/static/images/design/design_pattern/prototype/prototype.png)

- **CoffeeManager**: コーヒーのプロトタイプを管理し、クライアントが要求するときにクローンを生成する
- **CoffeePrototype**: プロトタイプのインタフェースを定義する
- **DeepCopyCoffee**: createCopyメソッドをオーバーライドしてディープコピーを行う
- **ShallowCopyCoffee**: createCopyメソッドをオーバーライドしてシャローコピーを行う

## Prototypeの実装例

```typescript
import _ from "lodash";

abstract class CoffeePrototype {
    constructor(
        public name: string,
        public detail: Detail = {"reviews": []}
    ) {}

    addReview(review: string) {
        this.detail.reviews.push(review);
    }

    abstract createCopy(): CoffeePrototype;
}

type Detail = {"reviews": string[]};

class DeepCopyCoffee extends CoffeePrototype {
    createCopy(): CoffeePrototype {
        return _.cloneDeep(this);
    }
}

class ShallowCopyCoffee extends CoffeePrototype {
    createCopy(): CoffeePrototype {
        return _.clone(this);
    }
}

class CoffeeManager {
    coffees: {[key: string]: CoffeePrototype} = {};

    registerCoffee(key: string, coffee: CoffeePrototype) {
        this.coffees[key] = coffee;
    }

    create(key: string) {
        if (key in this.coffees) {
            const coffee = this.coffees[key];
            return coffee.createCopy();
        }
        throw new Error("指定されたキーは存在しません");
    }
}

function run() {
    const espresso = new DeepCopyCoffee("エスプレッソ");
    espresso.addReview("original");

    const latte = new ShallowCopyCoffee("ラテ");
    latte.addReview("original");

    const manager = new CoffeeManager();
    manager.registerCoffee("espresso", espresso);
    manager.registerCoffee("latte", latte);

    const clonedEspresso = manager.create("espresso");
    const clonedLatte = manager.create("latte");

    console.log("エスプレッソ（オリジナル）: ", espresso);
    console.log("エスプレッソ（コピー）: ", clonedEspresso);
    console.log("ラテ（オリジナル）: ", latte);
    console.log("ラテ（コピー）: ", clonedLatte);

    clonedEspresso.addReview("Intense");
    clonedLatte.addReview("Smooth");
    console.log("");
    console.log("エスプレッソ（オリジナル）: ", espresso);
    console.log("エスプレッソ（コピー）: ", clonedEspresso);
    console.log("ラテ（オリジナル）: ", latte);
    console.log("ラテ（コピー）: ", clonedLatte);
}

run();
```

## まとめ
シャローコピーとディープコピーがどっちがどっちかわからなくなる
