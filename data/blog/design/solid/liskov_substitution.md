---
title: リスコフの置換原則を浅くでいいから理解したい
date: '2023-12-25'
tags: ['design', 'solid', 'lsp']
draft: false
summary: '違反例と適用例でリスコフの置換原則を深めるための記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## LSP: リスコフの置換原則とは

**スーパータイプ**: 継承元となるクラス  
**サブクラス**: スーパータイプを継承したくらす  
だとすると、リスコフの置換原則は以下のように定義できる

> サブタイプはそのスーパータイプと置換可能でなければならない

言い換えると、**サブクラス**は**スーパークラス**のふるまいを変更せずに拡張できるべきであり、**サブクラス**は**スーパークラス**の持つ全てのメソッドを使うことができ、そのメソッドの振る舞いを変えることなく新たな機能を追加できるべき、ということである。

## LSP

### 違反例

LSP 違反例の王道「Rectangle(長方形)」と「Square(正方形)」を例に見ていきます。  
正方形は縦横が同じ長さの、長方形と見做せるからといって、Square(正方形)は Rectangle(長方形)の適切な派生型とは言えない。  
Rectangle は幅と高さをそれぞれ独立して変えられるのに対して、Square は両方は同時に変える必要がある。

![bad_lsp](/static/images/design/solid/liskov_substitution/bad_lsp.png)

ソースコードで表すと以下のようになります。

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

```java
public void test(Rectangle r) {
    r.setWidth(3);
    r.setHeight(4);
    assert r.getArea() == 12;
}
```

Rectangle 型のオブジェクトを受け取り、幅と高さを設定し、その面積が適切であることを確認するこの関数は、Rectangle オブジェクトに対しては想定通り動作する。しかし、Square オブジェクトを渡すと、このテストは失敗することになる。なぜなら、Square クラスの setWidth や setHeight は縦横の長さを同時に変更するからである。結果的に、面積は 16（4x4）となり、12 ではなくなる。

### 適用例

Square(正方形)は Rectangle(長方形)は、継承関係のように見えるが実際は、振る舞いが異なるため正しい継承とは言えない。
関係を見直し、IShape というインタフェースを用意し、Rectangle と Square で IShape を実装するようにする。

![good_lsp](/static/images/design/solid/liskov_substitution/good_lsp.png)

```java
public interface IShape {
    int getArea();
}

public class Rectangle implements IShape {
    protected int width;
    protected int height;

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    @Override
    public int getArea() {
        return this.width * this.height;
    }
}

public class Square implements IShape {
    private int length;

    public void setLength(int length) {
        this.length = length;
    }

    @Override
    public int getArea() {
        return this.length * this.length;
    }
}
```

```java
public void test(IShape shape) {
    if (shape instanceof Rectangle) {
        Rectangle r = (Rectangle) shape;
        r.setWidth(3);
        r.setHeight(4);
        assert r.getArea() == 12;
    } else if (shape instanceof Square) {
        Square s = (Square) shape;
        s.setSize(3);
        assert s.getArea() == 9;
    }
}
```

この修正により、Rectangle と Square は IShape インターフェースを通じて共通の振る舞いを提供し、それぞれのクラス固有のプロパティを保持するようになる。

## まとめ

コーヒーを題材にするのは諦めました。
