---
title: 個人的デザインパターン入門~Iterator 編~
date: '2024-02-09'
tags: ['design', 'design pattern(振る舞い)', 'iterator']
draft: false
summary: 'Iteratorの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Iterator パターン とは

> コレクション(リスト、ツリー、連想配列)内の要素に順番にアクセスするための方法を提供するデザインパターン。  
> コレクションの内部構造を隠蔽しながら、要素を 1 つずつ走査するインタフェース(イテレータ)を利用者に提供する

## Iterator パターンの主な要素

1. **Iterator**: コレクションを探索するために必要な操作を定義するインタフェース。`next()`, `hasNext()`などのメソッドを提供する。
2. **Concrete Iterator**: Iterator インタフェースを実装し、コレクション内の要素にアクセスする方法を実装する。
3. **Aggregate**: イテレータの生成を行うインタフェース。`createIterator()`メソッド等を提供する
4. **ConcreteAggregate**: Aggregate インタフェースを実装し、具体的なイテレータインスタンスを生成する。

## Iterator のメリット・デメリット

**メリット**

- コレクションの内部構造に依存せずに要素を走査できるため、コードの汎用性が向上する
- 異なるタイプのコレクションでも共通のイテレータインタフェースを使用できるため、コードの再利用性が向上する
- コレクションの内部構造が変更されても、イテレータのインタフェースが変わらなければ、使用する側のコードを変更する必要はない

**デメリット**

- 小規模なプロジェクトや単純な走査が必要な場合、イテレータを使用しない方がシンプルになる

## Iterator の使い所

- コレクションの内部構造を隠蔽しつつ、要素にアクセスしたい場合
- 異なるデータ構造を持つコレクションに対して統一的な走査方法を提供したい場合
- 探索のための方法を複数持たせたい場合

## Iterator のクラス図

![iterator](/static/images/design/design_pattern/iterator/iterator.png)

- **Iterator**: イテレータのインタフェース。要素にアクセスするための`next()`と`hasNext()`メソッドを提供する
- **Aggregate**: アグリゲート(コレクション)のインタフェース。要素に対するイテレータを生成する`createIterator()`メソッドを提供する
- **PublicationIterator**: `Iterator<Publication>`インタフェースの具体的な実装。PublicationCollection 内の Publication オブジェクトを走査する。
- **PublicationCollection**: `Aggregate<Publication>`インタフェースの具体的な実装。`Publication`オブジェクトのコレクションを管理し、そのイテレータを提供する。
- **Publication**: 出版物を表すクラス。タイトルと著者情報を持つ。

## Iterator の実装例

### Iterator と Aggregate のインタフェース定義

```typescript
// Iteratorインターフェイス
interface Iterator<T> {
  next(): T
  hasNext(): boolean
}

// Aggregateインターフェイス
interface Aggregate<T> {
  createIterator(): Iterator<T>
}
```

### Concrete Iterator と Concrete Aggregate の実装

```typescript
// 出版物クラス
class Publication {
  constructor(public title: string, public author: string) {}
}

// 出版物のコレクションを管理するConcrete Aggregate
class PublicationCollection implements Aggregate<Publication> {
  private publications: Publication[] = []

  public add(publication: Publication): void {
    this.publications.push(publication)
  }

  public createIterator(): PublicationIterator {
    return new PublicationIterator(this)
  }

  public getLength(): number {
    return this.publications.lenght
  }

  public getAt(index: number): Publication {
    return this.publications[index]
  }
}

// 出版物のコレクションを走査するConcrete Iterator
class PublicationIterator implements Iterator<Publication> {
  private collection: PublicationCollection
  private position: number = 0

  constructor(collection: PublicationCollection) {
    this.collection = collection
  }

  public next(): Publication {
    return this.collection.getAt(this.position++)
  }

  public hasNext(): boolean {
    return this.position < this.collection()
  }
}
```

### 使用例

```typescript
const collection = new PublicationCollection()
collection.add(new Publication('デザインパターン', 'Eric Freemon'))
collection.add(new Publication('考える技術・書く技術', '山﨑 康司'))
collection.add(new Publication('Clean Architecture', 'Robert C. Martin'))

// コレクションのイテレータを取得し、要素を走査
const iterator = collection.createIterator()
while (iterator.hasNext()) {
  const publication = iterator.next()
  console.log(`${publication.title} by ${publication.author}`)
}
```

## まとめ

これを使う場面は今のところ想像できていない。
