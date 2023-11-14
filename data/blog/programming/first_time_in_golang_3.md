---
title: 動的型付け言語プログラマーによるGo言語入門Vol.3
date: 2023-07-13
tags: ['programming', 'golang']
draft: true
summary: 動的型付け言語しか実務で扱ったことのないエンジニアによるGo言語の入門記事です
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

# 関数

Go 言語で関数を宣言するには、`func`キーワードを使用する。関数は引数と戻り値の型を指定することができる。そして、関数の本体は波括弧で囲む

## 関数の宣言と呼び出し

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

Go 言語の関数に**ない**機能である「名前付き引数」と「オプション引数」についてみる。  
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

標準出力に主に fmt.Println を使ってきたが、この関数は任意個の引数を受け付ける、可変長引数になっている。可変長引数は引数リストの最後のもの(あるいは唯一の引数)でなければならない。型の前に「...」をつけて表す。可変長引数に対応する変数として関数内で作成されるのは指定された型のスライスで、通常のスライスと同じように扱える。

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

Go 言語は多値を返す関数をサポートしている。これは関数が結果とエラーの両方を返す必要があるときに使える。この特性を使うことで、エラーハンドリングを効率的に行うことができる。

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

Go 言語では関数から複数の値を返せるだけでなく、戻り値の「名前」も指定できる。

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

## 関数は値

他の多くの言語と同様に、Go 言語の関数は「値(value)」である。関数の型はキーワード`func`、および引数と戻り値の型によって決まる。この組み合わせを関数の**シグネチャ**と呼ぶ。2 つの関数の引数と戻り値の数と型が同じならば、両者のシグネチャが一致することになる。

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

このようなことは普通しない。無名関数を定義してすぐ実行するくらいなら、無名関数を使わずにコードをそのまま実行するだろう。ところが変数に代入しない無名関数が役立つ場合が少なくとも 2 つはある。

## クロージャ

関数 f 内で定義された関数 g は、外側の関数 f 内で定義された変数にアクセスしたり変更したりできる。このような場合、関数内で定義された関数 g のことを**クロージャ(closure)**と呼ぶ。

クロージャの機能のひとつは関数のスコープを制限することである。「関数 f からしか呼び出されないが、関数 f から何度も呼び出される」とき、呼び出される関数 g を「隠して」おくのに「関数内の関数」が使える。隠しておけばパッケージレベルでの宣言の数が減るので、名前の衝突の危険が少なくなる。

もうひとつ重要な用途がある。クロージャは別の関数に渡されたり、関数から返されたりすることで興味深いことができるようになる。関数の中で定義された変数をその環境ごと包みこんで持ち出して、関数の外で使えるようになる。

### 関数引数

関数が値であって、しかも引数と戻り値の型により関数の型が特定できるので、関数を別の関数に引数として渡すことができる。ローカル変数を参照するクロージャを作成してそのクロージャを別の関数に渡すことで、局所変数お外に持ち出せるようになる。これは非常に有用なパターンで、標準ライブラリでも使われている。

ひとつの例がスライスのソートである。標準ライブラリのパッケージ`sort`の中に`sort.Slice`という名前の関数がある。この関数は引数にスライスと関数をとり、渡された関数はスライスのソートに使われる。この sort.Slice がどのように働くか、2 つの異なるフィールドをもった構造体のスライスをソートする例でみる。

クロージャを使って同じデータを異なる方法でどのようにソートするのか見てみる。  
まず簡単な型を定義し、その型の値のスライスを定義し、そのスライスを出力する。

```go
type Person struct {
  FirstName string
	LastName string
	Age int
}


func main() {
	people := []Person{
		{"Pat", "Patterson", 37},
		{"Tracy", "Bobbert", 23},
		{"Fred", "Fredson", 18},
	}
	fmt.Println("初期データ")
	fmt.Println(people)

	// 姓(LastName)でソート
	sort.Slice(people, func(i int, j int) bool {
		return people[i].LastName < people[j].LastName
	})
	fmt.Println("姓(LastName)でソート")
	fmt.Println(people)
}
```

```bash:実行結果
初期データ
[{Pat Patterson 37} {Tracy Bobbert 23} {Fred Fredson 18}]
姓(LastName)でソート
[{Tracy Bobbert 23} {Fred Fredson 18} {Pat Patterson 37}]
```

sort.Slice に渡されるクロージャには i と j の 2 個の引数しかないが、クロージャ内からは people を参照できるので、フィールド LastName によってソートできる。これを「people はクロージャによって**補足された**」などということがある。次に同じようにフィールド Age でソートする。

```go
func main() {
	people := []Person{
		{"Pat", "Patterson", 37},
		{"Tracy", "Bobbert", 23},
		{"Fred", "Fredson", 18},
	}
	fmt.Println("初期データ")
	fmt.Println(people)

	// 姓(LastName)でソート
	sort.Slice(people, func(i int, j int) bool {
		return people[i].Age < people[j].Age
	})
	fmt.Println("年齢(Age)でソート")
	fmt.Println(people)
}
```

```bash:実行結果
初期データ
[{Pat Patterson 37} {Tracy Bobbert 23} {Fred Fredson 18}]
年齢(Age)でソート
[{Fred Fredson 18} {Tracy Bobbert 23} {Pat Patterson 37}]
```

スライス people は sort.Slice の呼び出しによって変更される。

### 関数から関数を返す

クロージャを使って関数の状態を別の関数に渡せるだけでなく、関数からクロージャを返すこともできる。それを示すのに、「掛け算をする関数を返す関数」を書く。

```go
func makeMult(base int) func(int) int {
  return func(factor int) int {
		return base * factor
	}
}


func main() {
	twoBase := makeMult(2) // 2倍する関数
	threeBase := makeMult(3)  // 3倍する関数
	for i := 0; i <= 5; i++ {
		fmt.Print(i, ": ", twoBase(i), ", ", threeBase(i), "\n")
	}
}
```

関数 makeMult がクロージャを返しており、このプログラムを実行すると次のような出力が得られる。

```bash:実行結果
0: 0, 0
1: 2, 3
2: 4, 6
3: 6, 9
4: 8, 12
5: 10, 15
```

## Go は値渡し

値渡しというのは、関数に引数を渡した際に Go は必ず引数の値のコピーを作るということである。

まず簡単な構造体を定義する。

```go
type person struct {
	age int
	name string
}
```

次に int, string, person を引数に取り、その値を変更する関数を書く。

```go
func modifyFails(i int, s string, p person) {
	i *= 2
	s = "さようなら"
	p.name = "Bob"
}
```

そしてこの関数を main から呼び出し、関数夜変更がどうなるかを見てみる。

```go
func main() {
	p := person{}
	i := 2
	s := "こんにちは"
	fmt.Println(i, s, p)
	modifyFails(i, s, p)
	fmt.Println(i, s, p)
}
```

```bash:実行結果
2 こんにちは {0 }
2 こんにちは {0 }
```

マップとスライスの場合は挙動が少し違う。

まず引数のマップを変更する関数と、引数のスライスを変更する関数を書く。

```go
func modMap(m map[int]string) {
	m[2] = "こんにちは"
	m[3] = "さようなら"
	delete(m, 1)
}
```

```go
func modSlice(s []int) {
	for k, v := range s {
		s[k] = v * 2
	}
	s = append(s, 10)
}
```

2 つの関数を main から呼び出す

```go
func main() {
	m := map[int]string{
		1: "1番目",
		2: "2番目",
	}
	modMap(m)
	fmt.Println(m)

	s := []int{1, 2, 3}
	modSlice(s)
	fmt.Println(s)
}
```

```bash:実行結果
map[2:こんにちは 3:さようなら]
[2 4 6]
```

マップ引数に対して行われた変更は、引数として渡した変数に反映される。スライスの場合はもう少し複雑になる。スライスのどの要素でも変更が可能だが、スライスを延長することはできない。関数に直接渡されたマップやスライスだけでなく、構造体のフィールドになっているマップやスライスでも同じことが起こる。

マップとスライスの振る舞いが他の型と違うのはなぜなのか。それはマップとスライスはどちらもポインタを使って実装されているからである。
