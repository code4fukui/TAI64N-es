# TAI64N-es
 
- TAI(Temps Atomique International, 国際原子時)とは、セシウムを利用した原子時計によって計測される時刻系
- TAIによって刻まれる時刻は、原子時は地球上で最も正確な時刻
- [TAI64N](https://cr.yp.to/libtai/tai64.html)は、1970年1月1日からの秒とナノ秒を12byteのバイナリ、または、"@" を先頭に付けた、hexでの文字列で表現する (ナノ秒 1000 * 1000 * 1000 = 0x3b9aca00)
## how to use

```js
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";

console.log(TAI64N.now());
console.log(TAI64N.parse("@4000000061bd24a6000f4240"));
```

## test

```bash
deno test
```
## caution!

- unsupported before 1970-01-01 (1970年1月1日以前の時刻表記に非対応)
- maintain leapSeconds.js if appear new leap second (閏秒が発表された時、leapSecond.js を更新する運用が必要)
