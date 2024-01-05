---
title: インタフェース分離の原則を浅く理解する
date: '2024-01-06'
tags: ['design', 'solid', 'isp']
draft: false
summary: '違反例と適用例でインタフェース分離の原則を浅く理解するための記事'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## ISP: インタフェース分離の原則

この原則は、インタフェース(または抽象クラス)が提供する機能を適切に分けるべきだという考えに基づいており、以下のようなポイントがある。

1. **クライアントに不必要な依存を強いない**: インタフェースのユーザー（クライアント）が、実際には使用しないフィールドやメソッドに依存させられるべきではない。たとえば、ある機能だけが必要なクライアントに、関係ない他の機能も実装するよう強制するのは望ましくない。
2. **未実装の抽象メソッドはエラー**: インタフェースや抽象クラスにおいて、抽象メソッドが未実装の状態ではエラーとなります。これは、サブクラスがそのメソッドを実装することを要求するためである。
3. **関係のないメソッドの実装を強制しない**: インタフェースには必要なメソッドのみを含めるべきである。クライアントにとって無関係なメソッドが含まれている場合、それらを実装することを強制してはならない。

つまり、「インタフェースに用意されている不必要なフィールドやメソッドにクライアントが依存しなくてもいいように、インタフェースは適切に分割すべき」というのがインタフェース分離の原則である。

## ISP

### 違反例

`ICoffeeMachine`インタフェースがコーヒーマシンの全機能を定義しているが、すべてのコーヒーマシンがこれらの機能を持っているわけではない。  
たとえば、`SimpleCoffeeMaker`はミルクをスチームしたり、豆を挽いたりする機能を持っていないが、インタフェースの定義によりこれらのメソッドを実装しなければならず、これはインタフェース分離の原則に反している。

![bad_isp](/static/images/design/solid/interface_segregation/bad_isp.png)

ソースコードだと以下のようになる。

```java
// コーヒー関連の機器を表すインターフェース
interface CoffeeMachine {
    String getBrand();
    String getColor();
    void brewCoffee();   // コーヒーを淹れる
    void steamMilk();    // ミルクをスチームする
    void grindBeans();   // コーヒー豆を挽く
}

// エスプレッソマシン
class EspressoMachine implements CoffeeMachine {
    private String brand;
    private String color;

    public EspressoMachine(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }

    @Override
    public String getBrand() {
        return brand;
    }

    @Override
    public String getColor() {
        return color;
    }

    @Override
    public void brewCoffee() {
        System.out.println("Espresso brewing!");
    }

    @Override
    public void steamMilk() {
        System.out.println("Steaming milk!");
    }

    @Override
    public void grindBeans() {
        System.out.println("Grinding coffee beans!");
    }
}

// シンプルなコーヒーメーカー
class SimpleCoffeeMaker implements CoffeeMachine {
    private String brand;
    private String color;

    public SimpleCoffeeMaker(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }

    @Override
    public String getBrand() {
        return brand;
    }

    @Override
    public String getColor() {
        return color;
    }

    @Override
    public void brewCoffee() {
        System.out.println("Brewing coffee!");
    }

    @Override
    public void steamMilk() {
        throw new UnsupportedOperationException("この機種ではミルクをスチームする機能はありません");
    }

    @Override
    public void grindBeans() {
        throw new UnsupportedOperationException("この機種ではコーヒー豆を挽く機能はありません");
    }
}

public class CoffeeShop {
    public static void main(String[] args) {
        CoffeeMachine machine1 = new EspressoMachine("Breville", "silver");
        CoffeeMachine machine2 = new SimpleCoffeeMaker("Mr. Coffee", "black");

        machine1.steamMilk();
        machine2.steamMilk(); // ここでエラーが発生
    }
}
```

### 適用例

各機能(コーヒーを淹れる、ミルクをスチームする、豆を挽く)が別々のインタフェース(`CoffeeBrewer`, `MilkSteamer`, `BeanGrinder`)に分離されている。これにより、`EspressoMachine`はこれらすべてのインタフェースを実装し、`SimpleCoffeeMaker`は必要な`CoffeeBrewer`インタフェースのみを実装することができる。こうすることで、各クラスが必要とする機能のみを実装することを可能にし、インタフェース分離の原則に即している。

![good_isp](/static/images/design/solid/interface_segregation/good_isp.png)

```java
// コーヒーマシンの基本的な特性を表すインターフェース
interface CoffeeMachine {
    String getBrand();
    String getColor();
}

// コーヒーを淹れる機能を持つインターフェース
interface CoffeeBrewer {
    void brewCoffee();
}

// ミルクをスチームする機能を持つインターフェース
interface MilkSteamer {
    void steamMilk();
}

// コーヒー豆を挽く機能を持つインターフェース
interface BeanGrinder {
    void grindBeans();
}

// エスプレッソマシンはコーヒーを淹れる、ミルクをスチームする、豆を挽く機能を全て持つ
class EspressoMachine implements CoffeeMachine, CoffeeBrewer, MilkSteamer, BeanGrinder {
    private String brand;
    private String color;

    public EspressoMachine(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }

    @Override
    public String getBrand() {
        return brand;
    }

    @Override
    public String getColor() {
        return color;
    }

    @Override
    public void brewCoffee() {
        System.out.println("Espresso brewing!");
    }

    @Override
    public void steamMilk() {
        System.out.println("Steaming milk!");
    }

    @Override
    public void grindBeans() {
        System.out.println("Grinding coffee beans!");
    }
}

// シンプルなコーヒーメーカーはコーヒーを淹れる機能のみを持つ
class SimpleCoffeeMaker implements CoffeeMachine, CoffeeBrewer {
    private String brand;
    private String color;

    public SimpleCoffeeMaker(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }

    @Override
    public String getBrand() {
        return brand;
    }

    @Override
    public String getColor() {
        return color;
    }

    @Override
    public void brewCoffee() {
        System.out.println("Brewing coffee!");
    }
}

public class CoffeeShop {
    public static void main(String[] args) {
        EspressoMachine espressoMachine = new EspressoMachine("Breville", "silver");
        SimpleCoffeeMaker simpleCoffeeMaker = new SimpleCoffeeMaker("Mr. Coffee", "black");

        espressoMachine.brewCoffee();
        espressoMachine.steamMilk();
        espressoMachine.grindBeans();

        simpleCoffeeMaker.brewCoffee();
    }
}
```

## まとめ

弊家には、深煎り豆専用として使用しているバルミューダのコーヒーマシンがあります。
