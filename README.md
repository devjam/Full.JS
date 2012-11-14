# Full.JS

## What is Full.JS?
フルフラッシュのようなサイトをJavaScriptで構築する時に役立つフレームワークを目指しています。  
名前はすごく立派な感じですが、完全に名前負け状態ですw  
名前に負けぬように機能も随時追加予定です。  
実装はCoffeeScriptで行っていまが、JavaScriptでの利用も可能です。  
ただ、CoffeeScriptが吐き出すJSなので、読みにくいかもしれません。  
CoffeeScriptで利用するとかなりコードがスッキリするので、オススメです。  
**注）内部でjQueryを使ってます。**  
**謝）現在絶賛ベータ版なのでAPIの変更は気まぐれに発生します。たぶん（汗**  

## How do I use Full.JS?

### JS部分

Full.JSはフレームワークなので、ベースとなるクラスを継承して使います。  
このクラスは、グループ分けしたコンテンツと紐づけて使用します。  
主に`init`と`update`の部分を書き換えて使います。  
`update`の引数は、

- absolute: サイト全体での現在地
- relative: コンテンツ内での現在地
- ratio: コンテンツのサイズを1とした時の現在地
- width: ウィンドウ幅
- height: ウィンドウ高
- inVector: コンテンツに上から入ったか、下から入ったか

この引数を駆使してアニメーションなどを実装します。  
**謝）この実装方法は大変なので、簡単に登録できる方法を用意する予定です。つまり、まだ準備中です。（汗**

```
#こちらはCoffeeのコードです。
#クラス名のExampleの部分を適宜変更して使います。
class @FullJS.Sections.Example extends @FullJS.Sections.Base

	init: ->
		### 初期化 ###

	update: (absolute, relative, ratio, width, height, inVector)->
		### アニメーションなど ###

```

```
//こちらはコンパイルしたJSのコードです。
//JSで利用する場合はExampleを一斉置換がはやいです。
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FullJS.Sections.Example = (function(_super) {

    __extends(Example, _super);

    function Example() {
      this.update = __bind(this.update, this);

      this.init = __bind(this.init, this);
      return Example.__super__.constructor.apply(this, arguments);
    }

    Example.prototype.init = function() {
      /* 初期化
      */

    };

    Example.prototype.update = function(absolute, relative, ratio, width, height) {
      /* アニメーションなど
      */

    };

    return Example;

  })(this.FullJS.Sections.Base);

}).call(this);
```

### HTML部分
HTMLの要素と先ほどのサブクラスを紐付ける方法として、jQueryのプラグインを用意しています。  
注意点は要素のidにサブクラス名を付けておく事です。  
引数で渡しているデータは、初期化用のデータです。  
渡さなくても動作します。  
この例は、横移動するパララックスのようなサイトの設定になります。

```
<head>
	<script src="js/jquery.js"></script>
	<script src="js/full.js"></script>
	<script src="js/subClass.js"></script>
	<script src="js/subClass2.js"></script>
	<script>
		$(function(){
			$(".section").addToFullJS({
				useWheel: true,
				useScrollLayout: true,
				layoutType: FullJS.LAYOUT_TYPE_HORIZONAL
			});
		});
	</script>
</head>
<body>
	<div id="subClass" class="section"></div>
	<div id="subClass2" class="section"></div>
</body>

```


**謝）現在絶賛ベータ版なので簡単な使い方しか用意していません（汗 随時更新します。。**  

## Example
とにかく、情報不足ですみません。
[sample](http://devjam.github.com/Full.JS/)を見てもらうと少しは理解できるかも。。

## TODO

### 追加したい機能

- アニメーション（アクション）の追加を簡単にする＆拡張できる機能
- 移動にイージングや時間を設定できるようにする
- セクション移動用のイベント <del>wheel scroll</del>/wheel/touch/arrow key/auto play/button
- 各種イベントの発行
- プラグイン的な機能を拡張できる機能
- カスタムスクロールバー（ブラウザのスクロールバーを消す仕様なので）
- ロード関連（ローディングバー、ローダー）
- アンカー関連（マネージャ、UIジェネレータ）
- 連番シーケンス／スプライトシート（他ライブラリへのアダプタ含む）
- deeplink/pjax関連
- pingfix連携

### その他
- ドキュメントやサンプルの充実
- test
- 最適化
- 他諸々気がついたらTODOに追加

## Change log

_2012.11.14_

- とりあえずアップ。


