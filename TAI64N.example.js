import { TAI64N } from "./TAI64N.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log("no wait");
for (let i = 0; i < 100; i++) {
  //console.log(TAI64N.stringify(TAI64N.now()));
  console.log(TAI64N.decode(TAI64N.now()));
  //console.log(TAI64N.decode(TAI64N.id()));
  //await sleep(1);
}

console.log("sleep(1)");
for (let i = 0; i < 10; i++) {
  //console.log(TAI64N.stringify(TAI64N.now()));
  console.log(TAI64N.decode(TAI64N.now()));
  //console.log(TAI64N.decode(TAI64N.id()));
  await sleep(1);
}
