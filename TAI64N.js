import { hex } from "https://code4sabae.github.io/js/hex.js";
import { fix0 } from "https://js.sabae.cc/fix0.js";
import { leapSeconds } from "./leapSeconds.js";

class TAI64N {
  static now() { // ret: 12byte Uint8Array
    return TAI64N.encode(new Date());
  }
  static check(tai64n) {
    if (!(tai64n instanceof Uint8Array)) {
      throw new Error("is not Uint8Array");
    }
    if (tai64n.length != 12) {
      throw new Error("is not length 12 bytes");
    }
    if (tai64n[0] != 0x40) {
      throw new Error("not supported yet before 1970");
    }
  }
  static encode(sec, nsec) {
    if (sec instanceof Date) {
      const t = sec.getTime();
      sec = Math.floor(t / 1000);
      nsec = (t - sec * 1000) * 1000 * 1000;
    }
    const offset = TAI64N.getOffsetByLeap(sec);
    console.log({offset, sec})
    sec += offset;

    const hexsec = fix0(sec.toString(16), 16);
    const hexnsec = fix0(nsec.toString(16), 8);
    console.log(hexsec, hexnsec);
    const res = new Uint8Array(12);
    const binsec = hex.toBin(hexsec);
    for (let i = 0; i < 8; i++) {
      res[i] = binsec[i];
    }
    const binnsec = hex.toBin(hexnsec);
    for (let i = 0; i < 4; i++) {
      res[i + 8] = binnsec[i];
    }
    res[0] = 0x40;
    return res;
  }
  static decode(tai64n) { // Uint8Array, ret [sec, nsec]
    TAI64N.check(tai64n);
    const n1 = new Uint8Array(6);
    for (let i = 0; i < n1.length; i++) {
      n1[i] = tai64n[i + 2];
    }
    const hexsec = hex.fromBin(n1);
    n1[0] = 0;
    n1[1] = 0;
    for (let i = 0; i < 4; i++) {
      n1[i + 2] = tai64n[i + 2 + 6];
    }
    const hexnsec = hex.fromBin(n1);
    const sec = parseInt(hexsec, 16);
    const nsec = parseInt(hexnsec, 16);
    const offset = TAI64N.getOffsetByLeap(sec);
    return [sec - offset, nsec];
  }
  static parse(s) { // @400xxx -> tai64n Uint8Array 12 bytes
    if (!s || s.length != 25 || s[0] != "@") {
      return null;
    }
    if (!s.startsWith("@400000")) {
      throw new Error("not supported yet before 1970");
    }
    const sec = parseInt(s.substring(1 + 6, 1 + 6 + 10), 16);
    const nsec = parseInt(s.substring(1 + 16, 1 + 16 + 8), 16);
    const offset = TAI64N.getOffsetByLeap(sec);
    return TAI64N.encode(sec - offset, nsec);
  }
  static stringify(tai64n) {
    TAI64N.check(tai64n);
    return "@" + fix0(hex.fromBin(tai64n), 24);
  }
  static toDate(tai64n) {
    TAI64N.check(tai64n);
    const [sec, nsec] = TAI64N.decode(tai64n);
    return new Date(sec * 1000 + nsec / 1000000);
  }
  static getOffsetByLeap(sec) {
    let offset = 10 + leapSeconds.length;
    //console.log("max offset", offset - 1);
    for (const l of leapSeconds) {
      offset--;
      if (sec > l) {
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
}

export { TAI64N };
