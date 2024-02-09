---
title: 個人的デザインパターン入門~Adapter 編~
date: '2024-02-08'
tags: ['design', 'design pattern(構造)', 'Adapter']
draft: false
summary: 'Adapterの個人的入門記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## Adapter パターンとは

> 既存のクラスのインターフェイスを、必要とされる別のインターフェイスに変換する役割を担い、異なるインタフェースを持つクラス同士が互いに通信できるようにする。  
> → あるクラスのインタフェースを、そのクラスを利用する側が求めている他のインタフェースへ変換するパターン

e.g.) 日本と海外のコンセントの変換アダプター

## Adapter の主な要素

Adapter パターンの主な要素は以下

1. **Client**: あるクラスの機能を「利用する」側のクラス
2. **Target**: クライアントが使用する予定のインタフェースを定義する。Client はこのインタフェースを通じて Adapter を使用する
3. **Adapter**: Target インタフェースを実装し、Adaptee のメソッドを Target インタフェースに適合させる役割を担う。つまり、Target インタフェースの要求を Adaptee のインタフェースに変換する
4. **Adaptee**: Adapter によって使用される既存のクラスやコンポーネント。このクラスは Target インタフェースとは異なるインタフェースを持っている

## Adapter のメリット・デメリット

**メリット**

1. **既存のクラス(Adaptee)を修正しない**: Adapter パターンを使用すると、既存のクラスのコードを変更することなく、新しいインターフェースをそのクラスに適用できる。
2. **変換のためのコードをビジネスロジックから分離**: Adapter クラスは、インターフェースの変換ロジックをカプセル化する。
3. **オープンクローズドの原則に違反しない**: Adapter パターンを使用すると、新しいインターフェースを既存のシステムに追加する際に、既存のコードを変更せずに済む。

**デメリット**

1. **インターフェースやクラスが増える**: Adapter パターンを使用すると、アダプター自体となるクラスやインターフェースが追加されます。これにより、システムの複雑性が増す可能性がある。
2. **パフォーマンスのオーバーヘッド**: アダプターを介して呼び出しが行われるため、直接呼び出しに比べてわずかながらパフォーマンスのオーバーヘッドが発生する可能性がある。

## Adapter の使い所

1. **インタフェースの不一致**: 既存のクラスやライブラリを利用したいが、そのインタフェースが現在のプロジェクトの要件と一致しない場合
2. **再利用性の向上**: 既にテストされ、信頼性の高いクラスを、追加のテストなしに再利用したい場合
3. **Adaptee のソースコードが手に入らない場合**: 必要なクラスやコンポーネントのソースコードが利用不可能な場合でも、その機能をプロジェクト内で使いたい場合

## Adapter のクラス図

![adapter](/static/images/design/design_pattern/adapter/adapter.png)

### 継承を使用した Adapter

- 継承を使うアダプターは、既存のクラス（Adaptee）を継承し、ターゲットインターフェイスを実装する
  - Adaptee の機能を直接継承し、必要に応じてオーバーライドして使用する

### 委譲を使用した Adapter

- 委譲を使うアダプターは、Adaptee のインスタンスを内部に持ち(委譲)、ターゲットインタフェースを実装する。アダプターは、インタフェースのメソッドを Adaptee に委譲することで機能を提供する

## Adapter の実装例

### 継承を使用した Adapter の実装例

```typescript
export {}

interface Target {
  getCsvData(): string
}

class NewLibrary {
  getJsonData() {
    return [
      {
        data1: 'json_dataA',
        data2: 'json_dataB',
      },
      {
        data1: 'json_dataC',
        data2: 'json_dataD',
      },
    ]
  }
}

class JsonToCsvAdapter extends NewLibrary implements Target {
  getCsvData(): string {
    const jsonData = this.getJsonData()

    const header = Object.keys(jsonData[0]).join(',') + '\n'
    const body = jsonData
      .map((d) => {
        return Object.keys(d)
          .map((key) => d[key])
          .join(',')
      })
      .join('\n')

    return header + body
  }
}

function run() {
  const adaptee = new NewLibrary()
  console.log('=== Adapteeが提供するデータ ===')
  console.log(adaptee.getJsonData())

  console.log('')

  const adapter = new JsonToCsvAdapter()
  console.log('=== Adapterに変換されたデータ ===')
  console.log(adapter.getCsvData())
}

run()
```

### 委譲を使用した Adapter の実装例

```typescript
export {}

interface Target {
  getCsvData(): string
}

class NewLibrary {
  getJsonData() {
    return [
      {
        data1: 'json_dataA',
        data2: 'json_dataB',
      },
      {
        data1: 'json_dataC',
        data2: 'json_dataD',
      },
    ]
  }
}

class JsonToCsvAdapter implements Target {
  constructor(private adaptee: NewLibrary) {}

  getCsvData(): string {
    const jsonData = this.adaptee.getJsonData()

    const header = Object.keys(jsonData[0]).join(',') + '\n'
    const body = jsonData
      .map((d) => {
        return Object.keys(d)
          .map((key) => d[key])
          .join(',')
      })
      .join('\n')

    return header + body
  }
}

function run() {
  const adaptee = new NewLibrary()
  console.log('=== Adapteeが提供するデータ ===')
  console.log(adaptee.getJsonData())

  console.log('')

  const adapter = new JsonToCsvAdapter(adaptee)
  console.log('=== Adapterに変換されたデータ ===')
  console.log(adapter.getCsvData())
}

run()
```

## まとめ

これはわりと使える場面ありそう
