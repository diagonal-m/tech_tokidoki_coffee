---
title: SOLID原則を理解したい~依存関係逆転の原則編~
date: '2023-07-09'
tags: ['architecture', 'solid']
draft: false
summary: 'SOLID原則についてそれぞれ理解を深めたい記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## 依存関係逆転の原則

### 依存関係逆転の原則とは

> ソースコードの依存関係が具象ではなく抽象だけを参照しているもの。

Java のような静的型付け言語ならば、user や import や include で指定する参照先を、インターフェイスや抽象クラスなどの抽象宣言だけを含むソースモジュールに限定し、具象に依存すべきでないということである。Ruby や Python のような動的型付け言語でも同じく、ソースコードの依存性が具象モジュールを参照してはいけない。  
※ ここでいう具象モジュールとは呼ばれている関数の実装が書かれているモジュールのこと

### 安定した抽象

抽象インターフェースの変更は、それに対応する具象実装の変更につながる。一方、具象実装を変更してもインターフェイスの変更が必要になることはあまりない。  
安定したソフトウェアアーキテクチャは、変化しやすい具象への依存を避け、安定した抽象インターフェイスに依存すべきである。これをコーディングレベルのプラクティスにまとめると、以下のようになる。

- **変化しやすい具象クラスを参照しない**。その代わりに抽象インターフェースを参照すること。一般的には**Abstract Factory**パターンを使うことになる。
- **変化しやすい具象クラスを継承しない**。静的型付け言語における継承は、ソースコードの関係の中で最も協力かつ厳格なものだ。そのため、十分に注意しながら使う必要がある。
- **具象関数をオーバーライドしない**。具象関数はソースコードの依存を要求することが多い。関数をオーバーライドしても依存関係を排除することはできず、そのまま**継承**することになるだろう。
- **変化しやすい具象を名指しで参照しない**。これは単に依存関係逆転の原則(DIP)を言い換えたもの

### Factory

上記のルールに従おうとすると、具象オブジェクトを生成する際に特別な処理が必要になる。事実上すべての言語において、オブジェクトの生成にはオブジェクトの具象定義を含むソースコードへの依存が避けられないからだ。  
大半のオブジェクト指向言語では、**Abstract Factory パターン**を使ってこの依存性を管理する。  
仕組みを下図に示す。`Application`は`Service`インターフェイス経由で`ConcreateImpl`を使う。だが、`Application`は何らかの方法で`ConcreateImpl`を生成する必要がある。`ConcreateImpl`のソースコードに依存せずにこれを実現するために、`Application`は`ServiceFactory`の`makeSvc`メソッドを呼ぶ。このメソッドの実装は`ServiceFactoryImpl`クラスで定義されており、このクラスは`ServiceFactory`の派生クラスである。この実装が`ConcreateImpl`のインスタンスを生成し、それを`Service`として戻すのである。
[![Image](https://i.gyazo.com/5c0a9cf25e3194023e91aac77d5bcfff.png)](https://gyazo.com/5c0a9cf25e3194023e91aac77d5bcfff)

```java
// サービスインターフェイス
public interface Service {
    void execute();
}

// 具体的なサービスの実装
public class ConcreteImpl implements Service {
    public void execute() {
        System.out.println("Executing ConcreteImpl");
    }
}

// サービスファクトリインターフェイス
public interface ServiceFactory {
    Service makeSvc();
}

// 具体的なサービスファクトリの実装
public class ServiceFactoryImpl implements ServiceFactory {
    public Service makeSvc() {
        return new ConcreteImpl();
    }
}

// アプリケーションクラス
public class Application {
    private Service service;

    public Application(ServiceFactory factory) {
        service = factory.makeSvc();
    }

    public void doSomething() {
        service.execute();
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        // 具体的なファクトリを作成
        ServiceFactory factory = new ServiceFactoryImpl();
        
        // アプリケーションを作成し、具体的なファクトリを渡す
        Application app = new Application(factory);
        
        // アプリケーションの動作を開始
        app.doSomething();  // "Executing ConcreteImpl" と表示される
    }
}
```

まず具体的なファクトリ、`ServiceFactoryImpl`のインスタンスを作成する。そしてそのファクトリを`Application`のコンストラクタに渡してアプリケーションを作成している。その後、`app.doSomething()`を実行することで、`Service`インターフェースを実装した`ConcreteImpl`の`exclude`メソッドが呼び出される。
