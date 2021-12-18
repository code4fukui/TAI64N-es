import { leapSeconds } from "./leapSeconds.js";

const offset = leapSeconds.length;
leapSeconds.forEach((l, idx) => {
  console.log(new Date((l - offset + idx - 8) * 1000));
});
