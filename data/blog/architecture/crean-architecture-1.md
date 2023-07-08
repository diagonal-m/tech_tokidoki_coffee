---
title: Clean Architecture備忘録vol.1
date: '2023-07-03'
tags: ['architebure', 'clean architecure']
draft: false
summary: 'Clean Architecture~達人に学ぶソフトウェアの構造と設計~を読んでの備忘録vol.1'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## 設計とアーキテクチャ

### 設計とアーキテクチャの違いは？

一般的にアーキテクチャと設計は以下のような使い分けがされている  
**アーキテクチャ**

> 下位レベルの詳細とは切り離された文脈で使用される

**設計**

> 下位レベルの構造や意思決定を表している

→ **両者に違いはない！**

> 下位レベルの詳細と上位レベルの構造は全体の設計の一部となる。それらが連続した構造を作り、システムの形状を定義する。  
> ...  
> 最上位レベルから最下位レベルまで、決定の連続なのである。

### 優れたソフトウェア設計の目的とは何か？

> ソフトウェアアーキテクチャの目的は、求められるシステムを構築・保守するために必要な人材を最小限に抑えることである。

## 設計の原則

### SRP：単一責任の原則

> モジュールはたったひとつのアクター(変更を望む人たち)に対して責務を負うべきである  
> (アクターの異なるコードは分割すべき)

モジュール：端的に言えば、ソースファイル。いくつかの関数やデータをまとめた凝集性のあるもの。

### OCP：オープン・クローズドの原則

> ソフトウェアの振る舞いは、既存の成果物を変更せず拡張できるようにするべき

> オープン・クローズドの原則を達成するには、システムをコンポーネントに分割して、コンポーネントの依存関係を階層構造にして、上位レベルのコンポーネントが下位レベルのコンポーネントの変更の影響を受けないようにする。

### LSP: リスコフの置換原則

> S 型のオブジェクト o1 の各々に、対応する T 型のオブジェクト o2 が 1 つ存在し、T を使って定義されたプログラム P に対して o2 の代わりに o1 を使っても P の振る舞いが変わらない場合、S は T の派生型であると言える。

↓

**「派生クラスはその基本クラスと置換可能でなければならない。」**

> もしクラス B がクラス A の派生クラスであれば、我々はクラス A のオブジェクトをクラス B のオブジェクトで置換しても、プログラムは正常に動作し続けるべきである

### ISP: インターフェイス分離の法則

> 特定のクライアントに役立たない、または必要としないメソッドへの依存を避けるべきである

一つの大きなインターフェースに多くのメソッドが含まれていると、それを実装するクラスは、実際には使用しないメソッドにも依存することになる。この結果、不必要な依存関係が生じ、それによって他のクラスにまで影響を及ぼす可能性がある。さらに、大きなインターフェースを利用すると、クラスの再利用性も低下する。

そのため、ISP はこのような問題を防ぐために、「より小さな、特定の目的に特化したインターフェースを使用するように」と提案する。

### DIP: 依存関係逆転の原則

> ソースコードの依存関係が(具象ではなく)抽象だけを参照しているもの。それが、最も柔軟なシステムである。

これが「依存関係逆転の原則(DIP)」の伝えようとしていることである。

安定したソフトウェアアーキテクチャは、変化しやすい具象への依存を避け、安定した抽象インターフェーイスに依存すべきである。これをコーディングレベルのプラクティスにまとめると以下のようになる。

- **変化しやすい具象クラスを参照しない**その代わりに抽象インターフェイスを参照すること。一般的には**Abstract Factory**パターンを使う。
- **変化しやすい具象クラスを継承しない**。静的型付け言語における継承は、ソースコードの関係の中で最も強力かつ厳格なもの。
- **具象関数をオーバーライドしない**。具象関数はソースコードの依存を要求することが多い。
- **変化しやすい具象を名指しで参照しない**。

## コンポーネント

> コンポーネントとは、デプロイの単位である。システムの一部としてデプロイできる、最小限のまとまりを指す。

### 再利用・リリース等価の原則(REP)

> 再利用の単位とリリースの単位は等価になる

あるコードが、再利用される場合、そのコードは同じリリースとバージョン管理の周期を共有すべき。

### 閉鎖性共通の原則

> 同じ理由、同じタイミングで変更されるクラスをコンポーネントにまとめること。変更の理由やタイミングが異なるクラスは、別のコンポーネントに分けること。

### 全再利用の原則

> コンポーネントのユーザーに対して、実際には使われないものへの依存を強要してはいけない。

