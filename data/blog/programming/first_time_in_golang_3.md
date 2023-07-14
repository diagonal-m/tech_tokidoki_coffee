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


