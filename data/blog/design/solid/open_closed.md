---
title: オープン・クローズドの原則を浅くでいいから理解したい
date: '2023-12-21'
tags: ['design', 'solid', 'ocp']
draft: false
summary: 'コーヒーを題材に違反例と適用例でオープン・クローズドの原則の理解を深めるための記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## SRP: 単一責任の原則とは

> ソフトウェアの構成要素は拡張に対して開いていて、修正に対しては閉じていなければならない

既存のソフトウェアの動作を変更せずに新たな機能を追加すべきと言い換えることもできます。

- 拡張に対して開かれている  
  → **新たなコードを追加することで機能を拡張することができる**
- 修正に対して閉じている  
  → **拡張によって既存のコードが修正されない**

## コーヒーで理解する OCP

### 違反例

`RoastProfiler`は豆の情報(`CoffeeBean`)を受け取り、焙煎レベルや豆の情報に基づき、最適な焙煎時間や焙煎温度を提案します。

![bad_ocp](/static/images/design/solid/open_closed/bad_ocp.png)

ソースコードで表すと以下のようになります。

```java
// 焙煎度合い(浅煎り, 中煎り, 深煎り)
enum Roasted {
    MEDIUM, CITY, FRENCH;
}

class CoffeeBean {
    private String name;
    private Roasted roasted;

    public CoffeeBean(String name, Roasted roasted) {
        this.name = name;
        this.roasted = roasted;
    }

    // getter メソッド
    public String getName() {
        return name;
    }

    public Roasted getRoasted() {
        return roasted;
    }
}

class RoastProfiler {
    private double baseTemp;
    private double baseTime;

    public RoastProfiler(double baseTemp, double baseTime) {
        this.baseTemp = baseTemp;
        this.baseTime = baseTime;
    }

    public double[] suggestRoastProfile(CoffeeBean bean) {
        double tempMultiplier;
        double timeMultiplier;

        switch (bean.getRoasted()) {
            case MEDIUM:
                tempMultiplier = 1.0;
                timeMultiplier = 1.0;
                break;
            case CITY:
                tempMultiplier = 1.2;
                timeMultiplier = 1.2;
                break;
            case FRENCH:
                tempMultiplier = 1.3;
                timeMultiplier = 1.3;
                break;
            default:
                throw new IllegalArgumentException("Unknown roasted level: " + bean.getRoasted());
        }
        return new double[]{baseTemp * tempMultiplier, baseTime * timeMultiplier};
    }
}

public class Main {
    public static void main(String[] args) {
        CoffeeBean bean1 = new CoffeeBean("del eden", Roasted.MEDIUM);
        CoffeeBean bean2 = new CoffeeBean("del eden", Roasted.CITY);
        CoffeeBean bean3 = new CoffeeBean("del eden", Roasted.FRENCH);

        RoastProfiler roastProfiler = new RoastProfiler(100, 100);

        System.out.println(Arrays.toString(roastProfiler.suggestRoastProfile(bean1)));
        System.out.println(Arrays.toString(roastProfiler.suggestRoastProfile(bean2)));
        System.out.println(Arrays.toString(roastProfiler.suggestRoastProfile(bean3)));
    }
}
```

` RoastProfiler` クラスの `suggestRoastProfile`メソッド内の`switch` 文は、新しい焙煎度合いを追加するたびにメソッドを修正する必要があり、ケアレスミスを誘発する可能性があるため**修正に対して閉じているとは言えません**。

### OCP 適用例

上記の問題を解消するには、拡張の可能性のあるもの(今回の場合は焙煎度)は、抽象化し、具体の種別は抽象を実装するようにします。

![good_ocp](/static/images/design/solid/open_closed/good_ocp.png)

```typescript
// 焙煎度に関するインターフェース
interface ICoffeeRoast {
    String getName();
    double[] getRoastProfile(double baseTemp, double baseTime);
}

// 異なる焙煎度合いを表すクラス
class MediumRoast implements ICoffeeRoast {
    private String name;

    public MediumRoast(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public double[] getRoastProfile(double baseTemp, double baseTime) {
        return new double[]{baseTemp * 1.0, baseTime * 1.0};
    }
}

class CityRoast implements ICoffeeRoast {
    private String name;

    public CityRoast(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public double[] getRoastProfile(double baseTemp, double baseTime) {
        return new double[]{baseTemp * 1.2, baseTime * 1.2};
    }
}

class FrenchRoast implements ICoffeeRoast {
    private String name;

    public FrenchRoast(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public double[] getRoastProfile(double baseTemp, double baseTime) {
        return new double[]{baseTemp * 1.3, baseTime * 1.3};
    }
}

public class CoffeeRoastingApp {
    public static void main(String[] args) {
        ICoffeeRoast mediumRoast = new MediumRoast("del eden");
        ICoffeeRoast cityRoast = new CityRoast("del eden");
        ICoffeeRoast frenchRoast = new FrenchRoast("del eden");

        double baseTemp = 100;
        double baseTime = 100;

        System.out.println("Medium Roast Profile: " + java.util.Arrays.toString(mediumRoast.getRoastProfile(baseTemp, baseTime)));
        System.out.println("City Roast Profile: " + java.util.Arrays.toString(cityRoast.getRoastProfile(baseTemp, baseTime)));
        System.out.println("French Roast Profile: " + java.util.Arrays.toString(frenchRoast.getRoastProfile(baseTemp, baseTime)));
    }
}
```

このコードでは、焙煎度合いごとに別々のクラスがあり、それぞれが ICoffeeRoast インターフェースを実装しています。これにより、新しい焙煎度合いを追加する場合に既存のコードを変更する必要がなく、新しいクラスを追加するだけで済ますことができます。

## まとめ

自家用焙煎機に憧れています。
