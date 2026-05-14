# TAI64N-es

[TAI64N](https://cr.yp.to/libtai/tai64.html) のJavaScript実装（ブラウザおよびDeno用ESモジュール）。

## 特徴

- TAI（国際原子時）を12バイトのバイナリ、または先頭に "@" を付けた16進数文字列として表現するフォーマットであるTAI64Nを実装（ナノ秒 1000 * 1000 * 1000 = 0x3b9aca00）。
- TAIはセシウム原子時計によって測定される時刻系であり、地球上で最も正確な時刻です。
- `TAI64N.now()` は、マイクロ秒をインクリメントし、ナノ秒をランダムな値に設定することで、同一ミリ秒内でも一意のTAI64Nタイムスタンプを生成します。

## 使い方

```js
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";

console.log(TAI64N.now());
console.log(TAI64N.parse("@4000000061bd24a6000f4240"));
```

## テスト

```bash
deno test
```

## 注意事項

- 1970-01-01以前は未サポート（1970-01-01以前の時刻表現はサポートしていません）。
- 新しいうるう秒が発表された場合は `leapSeconds.js` を保守してください（新しいうるう秒が発表された際は `leapSeconds.js` を更新する必要があります）。

## リンク

- [日本標準時プロジェクト - うるう秒情報](https://jjy.nict.go.jp/QandA/data/leapsec.html)

## ライセンス

MIT License — [LICENSE](LICENSE) を参照してください。
