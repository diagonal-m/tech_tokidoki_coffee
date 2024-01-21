---
title: 個人的SOLID原則入門~SRP編~
tags: ['design', 'solid', 'srp']
draft: false
summary: 'コーヒーを題材に違反例と適用例で単一責任の原則の理解を深めるための記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## SRP: 単一責任の原則とは

そのクラスを使用するユーザーやステークホルダーをひとまとめにした**アクター**という言葉を使って、単一責任の原則は以下のように説明できる。

> **モジュールはたったひとつのアクターに対して責務を負うべきである**

※「ひとつの関数はたったひとつのことだけを行うべきという原則」も存在するが、SOLID 原則の単一責任の原則とは異なる原則。

## コーヒーで理解する SPR

### 違反例

CoffeeBean クラスはコーヒー豆に関する様々な業務プロセスに対応するための中心的な役割であり、品質管理部門と販売部門という異なるアクターに対して責任を担って**しまって**います。

![bad_srp](/static/images/design/solid/single_responsibility/bad_srp.png)

ソースコードで表すと以下のようになります。

```java
public class CoffeeBean {
    private String name;
    private String origin;

    // コンストラクタ
    public CoffeeBean(String name, String origin) {
        this.name = name;
        this.origin = origin;
    }

    /**
     * コーヒー豆の品質を評価するメソッド
     * 風味、香り、色、豆のサイズなどの特性を分析するプロセスが含む
     * 豆が特定の品質基準を満たしているかどうかを決定する
     * 「品質管理部門」がアクター
     */
    public void assessQuality() {
        getFlavorProfile();
        System.out.println("風味情報をもとに" + this.name + "の品質を評価しました");
    }

    /**
     * コーヒー豆の価格を決定するメソッド
     * 豆の品質、産地、希少度、その他のコスト要因に基づいて計算される
     * 「販売部門」がアクター
     */
    public void calculatePrice() {
        getFlavorProfile();
        System.out.println("風味情報をもとに" + this.name + "の販売価格を計算しました");
    }

    /**
     * コーヒー豆の風味プロファイルを抽出するためのメソッド
     * 品質評価や価格設定に関連する決定を行う際のベースとなる
     */
    private void getFlavorProfile() {
        // 品質評価前
        System.out.println("品質評価と価格計算の共通処理");

        // 品質評価部門による仕様変更
        // System.out.println("新しい評価項目を追加");
    }
}

public class Main {
    public static void main(String[] args) {
        CoffeeBean bean = new CoffeeBean("El Paraiso Lychee", "Columbia");
        System.out.println("品質管理部門");
        bean.assessQuality();

        System.out.println("販売部門");
        bean.calculatePrice();
    }
}
```

コーヒー豆の風味プロファイルを抽出するためのメソッドである`getFlavorProfile`は品質評価(`assessQuality`)と価格計算(`calculatePrice`)の共通ロジックとして提供されています。  
品質評価部門が新しい評価項目を導入したとします。評価項目導入に伴う実装修正を`getFlavorProfile`が価格計算ロジックに使われていることに気づかず、実施してしまうと意図せず価格計算の結果も変わってしまう(別のアクターへの影響)といった問題が起こってしまいます。

### SRP 適用例

このような問題を解消するには、関数やデータを別のクラスに移動する方法が考えられます。たとえば次のような 3 つの新しいクラスを作成します。

1. CoffeeBean クラス：コーヒー豆の基本情報を保持する
2. QualityAssessor クラス：品質評価の責任を担う。
3. PriceCalculator クラス：価格計算の責任を担う。

![bad_srp](/static/images/design/solid/single_responsibility/good_srp.png)

```java
// コーヒー豆の基本情報を保持するクラス
public class CoffeeBean {
    private String name;
    private String origin;

    public CoffeeBean(String name, String origin) {
        this.name = name;
        this.origin = origin;
    }

    public String getName() {
        return name;
    }

    public String getOrigin() {
        return origin;
    }
}

// 品質評価を担当するクラス
public class QualityAssessor {
    public void assessQuality(CoffeeBean bean) {
        FlavorProfile profile = getFlavorProfile(bean);
        System.out.println("風味情報をもとに" + bean.getName() + "の品質を評価しました");
        // 他の品質評価ロジックをここに追加...
    }

    private FlavorProfile getFlavorProfile(CoffeeBean bean) {
        // 豆の風味のプロファイルを取得するロジック
        return new FlavorProfile();
    }
}

// 価格計算を担当するクラス
public class PriceCalculator {
    public void calculatePrice(CoffeeBean bean) {
        FlavorProfile profile = getFlavorProfile(bean);
        System.out.println("風味情報をもとに" + bean.getName() + "の販売価格を計算しました");
        // 価格計算ロジックをここに追加...
    }

    private FlavorProfile getFlavorProfile(CoffeeBean bean) {
        // 豆の風味のプロファイルを取得するロジック
        return new FlavorProfile();
    }
}

// 風味プロファイル情報を保持するクラス
public class FlavorProfile {
    // 風味プロファイルに関するデータフィールドとメソッドを定義...
}

// 実行クラス
public class CoffeeApp {
    public static void main(String[] args) {
        CoffeeBean bean = new CoffeeBean("El Paraiso Lychee", "Columbia");
        QualityAssessor qualityAssessor = new QualityAssessor();
        PriceCalculator priceCalculator = new PriceCalculator();

        System.out.println("品質管理部門");
        qualityAssessor.assessQuality(bean);

        System.out.println("販売部門");
        priceCalculator.calculatePrice(bean);
    }
}
```

この設計により、各クラスは単一の責任を持ち、品質評価や価格計算の方法が変更された場合でも、関連するクラスのみを修正すればよく、他のクラスには影響を与えません。

## まとめ

コーヒーを題材にしなかった方がわかりやすかった説はあります。
