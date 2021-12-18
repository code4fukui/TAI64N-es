import * as t from "https://deno.land/std/testing/asserts.ts";
import { TAI64N } from "./TAI64N.js";

Deno.test("parse", () => {
  const chk = (stai64n, sdate) => {
    t.assertEquals(TAI64N.toDate(TAI64N.parse(stai64n)), new Date(sdate));
  };
  chk("@4000000037c219bf2ef02e94", "1999-08-24 04:03:43.7874925 +0000 UTC"); // https://cr.yp.to/daemontools/tai64nlocal.html
  chk("@400000000000000000000000", "1969-12-31T23:59:50.000Z"); // 1970-01-01時点で、UTCはTAIから10秒遅れていた
  chk("@400000000000000a00000000", "1970-01-01T00:00:00.000Z");
  chk("@4000000037c219bf2ef02e94", "1999-08-23 21:03:43.787492500 -0700"); // https://manpages.debian.org/testing/daemontools/tai64nlocal.8.en.html
});
Deno.test("offset", () => {
  t.assertEquals(TAI64N.getOffsetByLeap(new Date().getTime()), 37); // 2019年2月現在、UTCはTAIから37秒遅れている https://ja.wikipedia.org/wiki/%E5%9B%BD%E9%9A%9B%E5%8E%9F%E5%AD%90%E6%99%82
  t.assertEquals(TAI64N.getOffsetByLeap(new Date("2038-01-01T00:00").getTime()), 37); // 2019年2月現在、UTCはTAIから37秒遅れている https://ja.wikipedia.org/wiki/%E5%9B%BD%E9%9A%9B%E5%8E%9F%E5%AD%90%E6%99%82
});
Deno.test("now", () => {
  t.assertEquals(TAI64N.now().length, 12);
});
Deno.test("encode, stringify", () => {
  const b = TAI64N.encode(new Date("1970-01-01T00:00:00.000Z"));
  t.assertEquals(TAI64N.stringify(b), "@400000000000000a00000000");
  const b2 = TAI64N.encode(new Date("2021-12-18T00:00:01.001Z"));
  t.assertEquals(TAI64N.stringify(b2), "@4000000061bd24a6000f4240");
});
Deno.test("decode, eq", () => {
  const b = TAI64N.encode(new Date("1970-01-01T00:00:00.000Z"));
  const [sec, nsec] = TAI64N.decode(b);
  t.assertEquals(sec, 0);
  t.assertEquals(nsec, 0);
  const b2 = TAI64N.encode(new Date("2021-12-18T00:00:01.001Z"));
  const [sec2, nsec2] = TAI64N.decode(b2);
  t.assertEquals(sec2, 1639785601);
  t.assertEquals(nsec2, 1000000);
  const b3 = TAI64N.encode(sec2, nsec2);
  t.assert(TAI64N.eq(b2, b3));
});
Deno.test("lt, gt, eq", () => {
  const b1 = TAI64N.encode(new Date("2012-01-01T00:00:00.000Z"));
  const b2 = TAI64N.encode(new Date("2012-01-02T00:00:00.000Z"));
  t.assert(TAI64N.lt(b1, b2));
  t.assert(!TAI64N.lt(b2, b1));
  t.assert(!TAI64N.lt(b1, b1));

  t.assert(!TAI64N.gt(b1, b2));
  t.assert(TAI64N.gt(b2, b1));
  t.assert(!TAI64N.gt(b1, b1));

  t.assert(TAI64N.eq(b1, b1));
  t.assert(TAI64N.eq(b2, b2));
});
Deno.test("lt gt eq 2", () => {
  const b1 = TAI64N.encode(new Date("2012-01-01T00:00:00.000Z"));
  const b2 = TAI64N.encode(new Date("2012-01-01T00:00:00.001Z"));
  t.assert(TAI64N.lt(b1, b2));
  t.assert(!TAI64N.lt(b2, b1));
  t.assert(!TAI64N.lt(b1, b1));

  t.assert(!TAI64N.gt(b1, b2));
  t.assert(TAI64N.gt(b2, b1));
  t.assert(!TAI64N.gt(b1, b1));

  t.assert(TAI64N.eq(b1, b1));
  t.assert(TAI64N.eq(b2, b2));
});
