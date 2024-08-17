import { hex } from "https://code4sabae.github.io/js/hex.js";
import { fix0 } from "https://js.sabae.cc/fix0.js";
import { leapSeconds } from "./leapSeconds.js";

// to make now unique
let bksec = 0;
let bknsec = 0;
let series = 0;

class TAI64N {
  static now() { // ret: 12byte Uint8Array
    const tai = TAI64N.encode(new Date());
    const ss = TAI64N.decode(tai);
    if (bksec != ss[0] || bknsec != ss[1]) {
      series = 0;
      bksec = ss[0];
      bknsec = ss[1];
      return tai;
    }
    series++;
    if (series == 1000) {
      series = 0;
    }
    const rnd = Math.floor(Math.random() * 1000);
    return TAI64N.encode(bksec, bknsec + series * 1000 + rnd);
  }
  static check(tai64n) {
    if (!(tai64n instanceof Uint8Array)) {
      throw new Error("is not Uint8Array");
    }
    if (tai64n.length != 12) {
      throw new Error("is not length 12 bytes");
    }
  }
  static encode(sec, nsec = 0) {
    if (sec instanceof Date) {
      const t = sec.getTime();
      sec = Math.floor(t / 1000);
      nsec += (t - sec * 1000) * 1000 * 1000;
      sec = BigInt(sec);
    } else if (!(sec instanceof BigInt)) {
      sec = BigInt(sec);
    }
    const offset = TAI64N.getOffsetByLeap(sec);
    sec += 0x4000000000000000n + BigInt(offset);

    const hexsec = fix0(sec.toString(16), 16);
    const hexnsec = fix0(nsec.toString(16), 8);
    const res = new Uint8Array(12);
    const binsec = hex.toBin(hexsec);
    for (let i = 0; i < 8; i++) {
      res[i] = binsec[i];
    }
    const binnsec = hex.toBin(hexnsec);
    for (let i = 0; i < 4; i++) {
      res[i + 8] = binnsec[i];
    }
    return res;
  }
  static decode(tai64n) { // Uint8Array, ret [sec, nsec]
    TAI64N.check(tai64n);
    const n1 = new Uint8Array(8);
    for (let i = 0; i < n1.length; i++) {
      n1[i] = tai64n[i];
    }
    const hexsec = hex.fromBin(n1);
    const sec = BigInt("0x" + hexsec) - 0x4000000000000000n;
    const n2 = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
      n2[i] = tai64n[i + 8];
    }
    const hexnsec = hex.fromBin(n2);
    const nsec = parseInt(hexnsec, 16);
    const offset = TAI64N.getOffsetByLeap(sec);
    return [sec - offset, nsec];
  }
  static parse(s) { // @400xxx or 1716852935.558 -> tai64n Uint8Array 12 bytes
    if (!s) return null;
    if (s.length == 25 && s[0] == "@") {
      const sec = BigInt("0x" + s.substring(1, 1 + 16)) - 0x4000000000000000n;
      const nsec = parseInt(s.substring(1 + 16, 1 + 16 + 8), 16);
      const offset = TAI64N.getOffsetByLeap(sec);
      return TAI64N.encode(sec - offset, nsec);
    }
    // 171e7
    if (s.indexOf("e") >= 0) {
      const f = parseFloat(s);
      const sec = Math.floor(f);
      const nanosec = (f - Math.floor(f)) * (1000 * 1000 * 1000);
      return TAI64N.encode(sec, nanosec);
    }
    // 1716852935.558
    const n = s.indexOf(".");
    if (n < 0) {
      return TAI64N.encode(parseInt(s), 0);
    }
    const sec = parseInt(s.substring(0, n));
    let ns = s.substring(n + 1);
    if (ns.length > 9) {
      ns = ns.substring(0, 9);
    } else {
      ns = ns + "00000000".substring(0, 9 - ns.length);
    }
    const nanosec = parseInt(ns);
    return TAI64N.encode(sec, nanosec);
  }
  static stringify(tai64n) {
    TAI64N.check(tai64n);
    return "@" + fix0(hex.fromBin(tai64n), 24);
  }
  static toString(tai64n) {
    TAI64N.check(tai64n);
    const omit0 = (n) => {
      if (!n) return "";
      const s0 = "00000000" + n;
      const s = s0.substring(s0.length - 9);
      let m = s.length;
      while (s[--m] === "0");
      if (m < 0) {
        return "." + s;
      }
      return "." + s.substring(0, m + 1);
    };
    tai64n ||= TAI64N.now();
    const t = TAI64N.decode(tai64n);
    return t[0] + omit0(t[1]);
  }
  static toDate(tai64n) {
    TAI64N.check(tai64n);
    const [sec, nsec] = TAI64N.decode(tai64n);
    const t = sec * 1000n + BigInt(nsec) / 1000000n;
    // check valid
    return new Date(parseInt(t));
  }
  static getOffsetByLeap(sec) {
    let offset = 10n + BigInt(leapSeconds.length);
    for (const l of leapSeconds) {
      offset--;
      if (sec > BigInt(l)) {
        break;
      }
    }
    return offset;
  }
  static lt(d1, d2) {
    const [sec1, nsec1] = TAI64N.decode(d1);
    const [sec2, nsec2] = TAI64N.decode(d2);
    if (sec1 == sec2) {
      return nsec1 < nsec2;
    }
    return sec1 < sec2;
  }
  static gt(d1, d2) {
    const [sec1, nsec1] = TAI64N.decode(d1);
    const [sec2, nsec2] = TAI64N.decode(d2);
    if (sec1 == sec2) {
      return nsec1 > nsec2;
    }
    return sec1 > sec2;
  }
  static eq(d1, d2) {
    TAI64N.check(d1);
    TAI64N.check(d2);
    for (let i = 0; i < 12; i++) {
      if (d1[i] != d2[i]) {
        return false;
      }
    }
    return true;
  }
  static fromYear(year) {
    year = BigInt(year);
    const sec = (year - 1970n) * (365n * 24n * 60n * 60n);
    return TAI64N.encode(sec, 0);
  }
  static toYear(tai64n) {
    const [sec, _] = TAI64N.decode(tai64n);
    return sec / (365n * 24n * 60n * 60n) + 1970n;
  }
}

export { TAI64N };
