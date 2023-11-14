---
title: 動的型付け言語プログラマーによるGo言語入門Vol.2
date: 2023-07-08
tags: ['programming', 'golang']
draft: true
summary: 動的型付け言語しか実務で扱ったことのないエンジニアによるGo言語の入門記事です
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## ブロック

Go 言語ではさまざまな場所で変数が宣言できる。関数の外でも、関数の引数としても、関数の局所変数(ローカル変数)としても宣言できる。  
　変数や関数などの宣言が行われる場所を「ブロック」と呼ぶ。関数の外で宣言された変数、定数、型、関数は「パッケージブロック」に置かれる。  
　関数のトップレベルで定義されているすべての変数はひとつのブロックに含まれ、ひとつの関数内では「\{」と「\}」のペアでまた別のブロックを定義する。  
　内側のブロックで同じ名前の識別子を定義した場合、外側で定義された識別子が「シャドーイング(隠蔽)」されてしまう。

### 変数のシャドーイング

```go
func main() {
  x := 10
	if x > 5 {
		fmt.Println(x)
		x := 5
		fmt.Println(x)
	}
	fmt.Println(x)
}
```

```bash:実行結果
10
5
10
```

5 行目で宣言された変数 x のような「シャドーイング変数」(内側のブロックで同じ名前を持つ変数)があると、隠蔽された変数(外側のブロックの変数)にはアクセスできなくなる。

## if

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
  rand.Seed(time.Now().UnixNano()) // シードの指定
	n := rand.Intn(10) // 0以上10未満の整数を戻す
	if n == 0 {
		fmt.Println("少し小さすぎます:", n)
	} else if n > 5 {
		fmt.Println("少し大きすぎます:", n)
	} else {
		fmt.Println("いい感じの数字です:", n)
	}
}
```

if あるいは else のあとの\{...\}で宣言された変数は、そのブロック内でのみ存在することになる。この性質は多くの言語でも同じだが、Go 言語では、条件部分および if と else の両方のブロックで有効な変数を宣言できる。

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
  rand.Seed(time.Now().UnixNano()) // シードの指定
	if n := rand.Intn(10); n == 0 {
		fmt.Println("少し小さすぎます:", n)
	} else if n > 5 {
		fmt.Println("少し大きすぎます:", n)
	} else {
		fmt.Println("いい感じの数字です:", n)
	}
}
```

↑ のように必要なときだけ変数を宣言して利用できる。一連の if/else が終わると n は未定義になる。

## for

Go 言語ではループには for 文を使う。そして、他の言語と違って for 以外のキーワードを使うループはない。ただし次の四種類の for 文が用意されている。

1. 「初期条件」「条件」「再設定」の 3 つの部分を指定するもの
2. 条件部分のみを指定するもの
3. 無限ループ
4. for-range を使うもの

### 標準形式の for 文

```go
for i := 0; i < 10; i++ {
  fmt.Println(i)
}
```

```bash:実行結果
0
1
2
3
4
5
6
7
8
9
```

### 条件のみの for 文

Go では for 文の初期化と再設定の部分を省略できる。これは while 文の代わりになる。

```go
i := 1
for i < 100 {
  fmt.Println(i)
  i = i * 2
}
```

### 無限ループ

```go
for {
  fmt.Println("Hello")
}
```

### break と continue

for の無限ループから抜け出すには break を使う。

```go
for {
  // <処理>
  if !<ループの継続条件> {
    break
  }
}
```

Go にはキーワード continue もある。今のループの処理を修了して、次のループを開始する。

```go
for i := 1; i <= 100; i++ {
  if i % 3 == 0 && i % 5 == 0 {
	  fmt.Println(i, "3でも5でも割り切れる")
		continue
	}
	if i % 3 == 0 {
		fmt.Println(i, "3で割り切れる")
		continue
	}
	if i % 5 == 0 {
		fmt.Println(i, "5で割り切れる")
		continue
	}
	fmt.Println(i)
}
```

### for-range ループ

```go
func main() {
  evenVals := []int{2, 4, 6, 8, 10, 12}
	for i, v := range evenVals {
		fmt.Println(i, v)
	}
}
```

```bash:実行結果
0 2
1 4
2 6
3 8
4 10
5 12
```

## switch

```go
func main() {
    x := 3

    switch x {
    case 1:
        fmt.Println("x is 1")
    case 2:
        fmt.Println("x is 2")
    case 3:
        fmt.Println("x is 3")
    default:
        fmt.Println("x is not 1, 2, or 3")
    }
}
```
