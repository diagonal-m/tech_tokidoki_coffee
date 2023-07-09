---
title: SOLID原則を理解したい~リスコフの置換原則編~
date: '2023-07-09'
tags: ['architecture', 'solid']
draft: false
summary: 'SOLID原則についてそれぞれ理解を深めたい記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## LSP: リスコフの置換原則
### リスコフの置換原則とは

> S型のオブジェクトo1の各々に、対応するT型のオブジェクトo2が１つ存在し、Tを使って定義されたプログラムPに対してo2をの代わりにo2を使ってもPのふるまいが変わらない場合、SはTの派生型であると言える

あるクラスが他のクラスから派生した場合(あるクラスが他のクラスのサブクラスである場合)、そのサブクラスのオブジェクトは、親クラスのオブジェクトとして使えるべき、というのがこの原則の主旨である。

言い換えると子クラスは親クラスのふるまいを変更せずに拡張できるべきだということである。子クラスは親クラスの持つ全てのメソッドを使うことができ、そのメソッドのふるまいを変えることなく新たな機能を追加できるべき、ということである。

### 継承の使い方の指針
以下のような、`Licence`クラスについて考える。このクラスには`calcFee()`メソッドがあり、`Billing`アプリケーションから呼ばれている。また、`License`の「派生型」が2つある。`PersonalLicense`と`BusinessLicense`だ。これらは、それぞれ異なるアルゴリズムを用いてライセンス料を計算する。

[![Image](https://i.gyazo.com/b48d1467fd9ec0fc56485a65fdaac276.png)](https://gyazo.com/b48d1467fd9ec0fc56485a65fdaac276)

Billingアプリケーションは、使っている2つの派生型に依存していないため、この設計はリスコフの置換原則を満たしている。どちらの派生型もLicense型に置き換えることができる。

### 正方形・長方形問題
 リスコフの置換原則の一般的な違反の例としてよく引用されるのが、正方形（Square）と長方形（Rectangle）の関係である。一見、正方形は長方形の一種と見なすことができる（すべての辺が等しい特別な長方形）、そのため、何も問題ないように見えるかもしれない。しかし、コードに落とし込むと問題が発生する。

 まず以下のように、長方形のクラスを考えてみる。

 ```java
public class Rectangle {
    protected int width;
    protected int height;

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getArea() {
        return this.width * this.height;
    }
}
 ```

これは問題ないように見える。次に、正方形のクラスを作る。正方形は長方形の特別な形なので、Rectangleクラスを継承させて作成する。

```java
public class Square extends Rectangle {
    public void setWidth(int width) {
        this.width = width;
        this.height = width;  // 正方形では縦と横の長さが等しい
    }

    public void setHeight(int height) {
        this.width = height;  // 正方形では縦と横の長さが等しい
        this.height = height;
    }
}
```

これにより問題が発生する。以下のようなコードを考えてみる。

```java
public void test(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.getArea() == 20;
}
```

Rectangle型のオブジェクトを受け取り、幅と高さを設定し、その面積が適切であることを確認するこの関数は、Rectangleオブジェクトに対しては完全に機能します。しかし、Squareオブジェクトを渡すと、このテストは失敗することになる。なぜなら、SquareクラスのsetWidthやsetHeightメソッドは両方の次元を同時に変更するからである。結果的に、面積は16（4x4）となり、20ではなくなる。

これがリスコフの置換原則（LSP）違反の一例です。正方形は一見長方形の一種に見えるが、コードとして表現するとその特性が矛盾を引き起こすため、正方形を長方形のサブタイプとして扱うことは適切ではない。これがLSPの重要な点であり、LSPはオブジェクト指向設計の基本原則の一つである。
