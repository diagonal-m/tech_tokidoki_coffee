---
title: AWSで独自ドメインの静的サイトを公開してみた(お名前ドットコム × S3 × CloudFront × Route53 × ACM)
date: '2023-12-05'
tags: ['AWS', 'S3', 'CloudFront']
draft: false
summary: 'AWSで独自ドメインの静的サイトを公開してみたのでその備忘録'
---

## 目次

<TOCInline toc={props.toc} exclude="目次" toHeading={3} />

## はじめに

s3 を使えば簡単に静的サイトを公開できると聞いたので、試してみたところなんやかんやで所々詰まったので、**詰まった箇所に限定して**備忘録的にまとめます。

## この記事で扱わないこと

- お名前ドットコムでドメイン登録
- S3 での静的 Web サイトホスティング

上の 2 つに関しては、特に詰まるところなかったので、他所記事に解説を任せます。  
また、この記事では仕組みにはほぼほぼ触れずにハンズオン形式で独自ドメインでの静的 Web サイトの公開までをまとめます。

## 作業手順

0. お名前ドットコムでドメイン登録(以降`example.com`として進めます) & S3 での静的 Web サイトホスティング
1. Route53 で独自ドメイン登録 ← **ここから**
2. CertificateManager で SSL 証明書の発行
3. CloudFront で独自ドメインアクセス

## 1. Route53 で独自ドメイン登録

### 1-1. Route53 ダッシュボード画面に遷移

Route53 のダッシュボード画面に遷移する

![route53](/static/images/s3_cloudfront_route53/route53.png)

### 1-2. ホストゾーンを作成する

route53 > ホストゾーン > 「ホストゾーンの作成」を押下してホストゾーンを作成する。  
ドメイン名は、お名前ドットコムで登録した`example.com`を入力して作成します。

![hostzone](/static/images/s3_cloudfront_route53/create_hostzone.png)

### 1-3. お名前ドットコムのDNS設定

ドメイン > ドメイン名(`example.com`)押下 > ネームサーバーの変更 > 他のネームサーバーを利用  
の順番に遷移し、ネームサーバー情報を入力に、登録したホストゾーンの`NS`タイプに記載のトラフィックのルーティング先を転記する。


| ネームサーバー              | 値                     |
| --------------------------- | ---------------------- |
| 1プライマリネームサーバー   | ns-111.awsdns-11.co.uk |
| 2セカンダリリネームサーバー | ns-2222.awsdns-22.net  |
| 3                           | ns-3333.awsdns-33.com  |
| 4                           | ns-444.awsdns-44.org   |

## 2. CertificateManagerでSSL証明書の発行
※ 「米国東部（バージニア北部）」リージョンで行うようにしてください。

### 2-1 SSL証明書の発行
AWS Certificate Manager (ACM)の画面に遷移する。  
「リクエスト」ボタン押下 > 「パブリック証明書をリクエスト」を選択 > ドメイン名を入力して「リクエスト」ボタン押下

![acm](/static/images/s3_cloudfront_route53/acm.png)

### 2-2 お名前ドットコムのDNS設定vol.2

ネームサーバー設定 > ドメインのDNS設定 > DNSレコード設定を利用する > 「A/AAAA/CNAME/MX/NS/TXT/SRV/DS/CAAレコード」を追加  
発行した証明書のCNAME名とCNAME値を入力


| ホスト名  | TYPE  | TTL  | VALUE                    | 優先 | 状態 | 追加 |
| --------- | ----- | ---- | ------------------------ | ---- | ---- | ---- |
|  xxxx2222 | CNAME | 3600 | xxxxacm-validations.aws. |      | 有効 | 追加 |


### 2-3 Route53でレコード作成

証明書 > ドメイン > 「Route53でレコードを作成」押下

## 3. CloudFrontで独自ドメインでアクセス

### 3-1 ディストリビューションの作成 
CloudFront > 「ディストリビューションを作成」を押下  
以下のようにディストリビューションを作成

| 項目                         | 値                                  |
| ---------------------------- | ----------------------------------- |
| オリジンドメイン             | example.com.s3.xxxxx.amazonaws.com  |
| カスタムSSL証明書            | ACM証明書(example.com)              |
| デフォルトルートオブジェクト | index.html                          |

### 3-2 Route53にCloudFrontの設定を反映させる

Route53で登録したホストゾーンにCloudFrontに登録したドメイン名(xxxx.cloudfront.net)をAレコードとして登録する

## Done

https://example.com にアクセスしてindex.htmlの内容が表示されたら成功です。


