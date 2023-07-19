---
title: 動的型付け言語プログラマーによるGo言語入門Vol.3
date: 2023-07-13
tags: ['programming', 'golang']
draft: false
summary: 動的型付け言語しか実務で扱ったことのないエンジニアによるGo言語の入門記事です
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## 関数
Go言語で関数を宣言するには、`func`キーワードを使用する。関数は引数と戻り値の型を指定することができる。そして、関数の本体は波括弧で囲む

### 関数の宣言と呼び出し

```go
func greet(name string) string {
  return "Hello, " + name
}
```

```go
fmt.Println(greet("Alice"))
```

```bash:実行結果
Hello, Alice
```

### 名前付き引数とオプション引数
Go言語の関数に**ない**機能である「名前付き引数」と「オプション引数」についてみる。  
名前付き引数やオプション引数を真似しようとするなら、各引数に対応するフィールドをもった構造体を定義してそれを関数に渡す。

```go
type greetOps struct {
	name string
	age int
}

func greet(opts greetOps) error {
	fmt.Println(opts)
	fmt.Println("ここで必要な処理を行う")
	return nil
}

func main() {
	greet(greetOps {name: "alice" ,age: 25})
}
```
名前付き引数やオプション引数がなくても、実質的には問題ない。そもそも関数はあまり多くの引数をもつべきではない。名前付き引数やオプション引数は関数への入力が多い時に役立つものであるので、そのような引数が欲しいと思うときは、関数が複雑すぎるからである。

### 可変長引数とスライス
標準出力に主にfmt.Printlnを使ってきたが、この関数は任意個の引数を受け付ける、可変長引数になっている。可変長引数は引数リストの最後のもの(あるいは唯一の引数)でなければならない。型の前に「...」をつけて表す。可変長引数に対応する変数として関数内で作成されるのは指定された型のスライスで、通常のスライスと同じように扱える。

```go
func sum(nums ...int) int {
  total := 0
  for _, num := range nums {
    total += num
  }
  return total
}

func main() {
	fmt.Println(sum(1, 2, 3, 4)) 
}
```

```bash:実行結果
10
```

### 複数の戻り値
Go言語は多値を返す関数をサポートしている。これは関数が結果とエラーの両方を返す必要があるときに使える。この特性を使うことで、エラーハンドリングを効率的に行うことができる。

```go
func divide(x, y float64) (float64, error) {
  if y == 0 {
    return 0, errors.New("cannot divide by zero")
  }
  return x / y, nil
}

func main() {
	result, err := divide(10.0, 2.0)
	if err != nil {
		log.Fatalln(err)
	} else {
		fmt.Println(result) 
	}	
}
```

```bash:実行結果
5
```

### 名前付き戻り値
Go言語では関数から複数の値を返せるだけでなく、戻り値の「名前」も指定できる。

```go
func divAndRemainder(numerator int, denominator int) (result int, remainder int, err error) {
  if denominator == 0 {
		return numerator, denominator, errors.New("0で割ることはできません")
	}
	result, remainder = numerator / denominator, numerator%denominator
	return result, remainder, err
}
```

戻り値に名前を付ける場合、関数の戻り値を指定する部分に「,」で区切って名前と型を列挙する。名前付き戻り値はゼロ値に初期化される。なので、使わなくても、値を代入しなくても返すことができる。  
名前付き戻り値に使われる名前のスコープは関数の中だけ(ローカル)。関数の外には影響を与えないので次のように、戻り値を別の名前の変数に代入しても問題ない。

```go
func main() {
	x, y, z := divAndRemainder(5, 2)
	fmt.Println(x, y, z)
}
```

```bash:実行結果
2 1 <nil>
```

### 関数は値
他の多くの言語と同様に、Go言語の関数は「値(value)」である。関数の型はキーワード`func`、および引数と戻り値の型によって決まる。この組み合わせを関数の**シグネチャ**と呼ぶ。2つの関数の引数と戻り値の数と型が同じならば、両者のシグネチャが一致することになる。  


### 無名関数
関数は変数に代入できるだけではない。関数内で別の関数を定義し、それを変数に代入することもできる。  
このような、関数内部の関数としては名前を持たない「無名関数(匿名関数)」が使われる。変数に代入する必要もなく、「インライン」で記述してその場で呼び出すこともできる。

```go
func main() {
	for i := 0; i < 5; i++ {
		func(j int) {
			fmt.Println("無名関数の中で", j, "を出力")
		}(i)
	}
}
```

```bash:実行結果
無名関数の中で 0 を出力
無名関数の中で 1 を出力
無名関数の中で 2 を出力
無名関数の中で 3 を出力
無名関数の中で 4 を出力
```

このようなことは普通しない。無名関数を定義してすぐ実行するくらいなら、無名関数を使わずにコードをそのまま実行するだろう。ところが変数に代入しない無名関数が役立つ場合が少なくとも2つはある。


