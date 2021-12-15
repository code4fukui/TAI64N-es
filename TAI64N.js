import { hex } from "https://code4sabae.github.io/js/hex.js";
import { fix0 } from "https://js.sabae.cc/fix0.js";

class TAI64N {
  static now() { // 12byte bin,  // TODO: test!
    const sec = new Date().getTime();
    const nsec = 0;
    const hexsec = fix0(sec.toString(16), 16);
    const hexnsec = fix0(nsec.toString(16), 8);
    //console.log(hexsec, hexnsec);
    const res = new Uint8Array(12);
    const binsec = hex.toBin(hexsec);
    for (let i = 0; i < 8; i++) {
      res[i] = binsec[i];
    }
    const binnsec = hex.toBin(hexnsec);
    for (let i = 0; i < 4; i++) {
      res[i + 8] = binnsec[i];
    }
    res[0] = 4;
    return res;
  }
  static lt(d1, d2) { // TODO: test!
    for (let i = 0; i < 12; i++) {
      if (d1[i] < d2[i]) {
        return true;
      }
    }
    return false;
  }
}

//console.log(TAI64N.now());

export { TAI64N };
