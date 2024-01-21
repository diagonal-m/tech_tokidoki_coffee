---
title: 個人的SOLID原則入門~DIP編~
date: '2024-01-19'
tags: ['design', 'solid', 'dip']
draft: false
summary: '違反例と適用例で依存性逆転の原則を浅く理解するための記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## DIP: 依存性逆転の原則

- 上位レベル: ビジネスロジック等、システムのコアに近い部分
- 下位レベル: データの保存方法や、外部サービスとの通信方法等の具体的な詳細

だとすると、依存性逆転の法則は以下のように説明できる

> 上位レベルの方針の実装コードは、下位レベルの詳細の実装コードに依存すべきではなく、逆に詳細が方針に依存すべきであるという原則

ビジネスロジック(上位レベルのコンポーネント)が、データベースの操作方法や外部 API の呼び出し方(下位レベルのコンポーネント)に依存しているような設計では、上位レベルの処理が下位レベルの処理の変更の影響を受けやすくなってしまうようなことが起こる。

依存性逆転の法則では、この依存関係を逆転させ、下位レベルのコンポーネントが上位レベルのコンポーネントに依存するようにする。これは通常以下の 2 つの方法で実現される。

- **抽象化**: 上位レベルと下位レベルのコンポーネントの間にインタフェース(または抽象クラス)を導入する。上位レベルのコンポーネントは、具体的な実装ではなく、このインタフェースに対してプログラミングされる。
- **依存性注入**: 下位レベルのコンポーネントの実際のインスタンスは、システムの他の部分によって、作成され、上位レベルのコンポーネントに注入される。

## DIP

### 違反例　

以下図では CafeService クラスが CafeRdbRepository の具体的な実装に直接依存していること、そして CafeController クラスが CafeService の具体的な実装に直接依存している。これは上位レベルのモジュールが下位レベルのモジュールの実装に依存している状態であることを意味し、下位レベルの実装を変更する必要が生じた場合、、上位レベルのモジュールもそれに伴って変更を強いられるような問題が発生する。

![bad_dip](/static/images/design/solid/dependency_inversion/bad_dip.png)

ソースコードだと以下のようになる。

```java
class Order {
    // Orderクラスの実装。詳細は省略。
}

class CafeController {
    private CafeService cafeService = new CafeService();

    public Order create(Order order) {
        return cafeService.create(order);
    }

    public Order findByName(String name) {
        return cafeService.findByName(name);
    }
}

class CafeService {
    private CafeRdbRepository cafeRdbRepository = new CafeRdbRepository();

    public Order create(Order order) {
        return cafeRdbRepository.create(order);
    }

    public Order findByName(String name) {
        return cafeRdbRepository.findByName(name);
    }
}

class CafeRdbRepository {
    public Order create(Order order) {
        System.out.println("RDBにOrderを登録");
        return order;
    }

    public Order findByName(String name) {
        System.out.println("名前: " + name + "のOrderを検索");
        return new Order();
    }
}

public class Main {
    public static void main(String[] args) {
        CafeController cafeController = new CafeController();
        cafeController.findByName("エスプレッソ");
    }
}
```

### 適用例

CafeController は ICafeService インターフェースに、CafeService は ICafeRepository インターフェースに依存している。これにより、実際のリポジトリの実装を変更する（例えば、異なるデータストレージを使用する）ときに、サービスやコントローラのコードを変更する必要がなくなる。また、モック実装を使用してテストが容易になるなど、コードの保守性や拡張性が向上している。

![good_dip](/static/images/design/solid/dependency_inversion/good_dip.png)

```java
class Order {}

// ICafeServiceインターフェースの定義
interface ICafeService {
    Order create(Order order);
    Order findByName(String name);
}

// CafeControllerクラスの定義
class CafeController {
    private ICafeService cafeService;

    public CafeController(ICafeService cafeService) {
        this.cafeService = cafeService;
    }

    public Order create(Order order) {
        return cafeService.create(order);
    }

    public Order findByName(String name) {
        return cafeService.findByName(name);
    }
}

// ICafeRepositoryインターフェースの定義
interface ICafeRepository {
    Order create(Order order);
    Order findByName(String name);
}

// CafeServiceクラスの定義、ICafeServiceインターフェースを実装
class CafeService implements ICafeService {
    private ICafeRepository cafeRepository;

    public CafeService(ICafeRepository cafeRepository) {
        this.cafeRepository = cafeRepository;
    }

    public Order create(Order order) {
        return cafeRepository.create(order);
    }

    public Order findByName(String name) {
        return cafeRepository.findByName(name);
    }
}

// CafeRdbRepositoryクラスの定義、ICafeRepositoryインターフェースを実装
class CafeRdbRepository implements ICafeRepository {
    public Order create(Order order) {
        System.out.println("RDBにOrderを登録");
        return order;
    }

    public Order findByName(String name) {
        System.out.println("名前: " + name + "のOrderを検索");
        return new Order();
    }
}

// アプリケーションを実行するクラス
public class Application {
    public static void main(String[] args) {
        ICafeRepository cafeRepository = new CafeRdbRepository();
        ICafeService cafeService = new CafeService(cafeRepository);
        CafeController cafeController = new CafeController(cafeService);

        // テスト実行
        cafeController.findByName("ラテ");
    }
}
```

## まとめ

個人的 SOLID 原則入門シリーズ完
