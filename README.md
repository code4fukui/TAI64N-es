# TAI64N-es

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A JavaScript implementation of [TAI64N](https://cr.yp.to/libtai/tai64.html) (ES Modules for browsers and Deno).

## Features

- Implements TAI64N, a format for representing TAI (International Atomic Time) as a 12-byte binary or a hexadecimal string with a leading "@" (nanoseconds 1000 * 1000 * 1000 = 0x3b9aca00).
- TAI is the time scale measured by cesium-based atomic clocks, which is the most accurate time on Earth.
- `TAI64N.now()` generates a unique TAI64N timestamp for the same millisecond by incrementing the microsecond and setting the nanosecond to a random value.

## Usage

```js
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";

console.log(TAI64N.now());
console.log(TAI64N.parse("@4000000061bd24a6000f4240"));
```

## Test

```bash
deno test
```

## Cautions

- Unsupported before 1970-01-01 (no support for time representation before 1970-01-01).
- Maintain `leapSeconds.js` if new leap seconds are announced (requires updating `leapSeconds.js` when new leap seconds are announced).

## Links

- [Japan Standard Time Project - Information of Leap second](https://jjy.nict.go.jp/QandA/data/leapsec.html)

## License

MIT License — see [LICENSE](LICENSE).