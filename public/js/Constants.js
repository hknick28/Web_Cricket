import { battingBackZ } from "./pitch.js";
import { battingPopping } from "./pitch.js";
import { wideLineOffset } from "./pitch.js";
import { Stump } from "./stump.js";

export const Length = Object.freeze({
  YORKER: {
    label: "yorker",
    getZ() {
      return battingBackZ - (Math.random() * 1.5 + 0.5); // 0.5-1.5m from stumps
    },
  },
  FULL: {
    label: "full",
    getZ() {
      return battingBackZ - (Math.random() * 2 + 2); // 2-4m
    },
  },
  GOOD: {
    label: "good",
    getZ() {
      return battingBackZ - (Math.random() * 2 + 4); // 4-6m
    },
  },
  SHORT: {
    label: "short",
    getZ() {
      return battingBackZ - (Math.random() * 2 + 6); // 6-9m
    },
  },
});

export const Line = Object.freeze({
  LEGSTUMP: {
    label: "leg",
    getLine() {
      return Math.random() * Stump.xOffset - 0;
    },
  },
  MIDDLESTUMP: {
    label: "middle",
    getLine() {
      return 0;
    },
  },

  OFFSTUMP: {
    label: "off",
    getLine() {
      return Math.random() * Stump.xOffset + 0;
    },
  },

  OUTSIDEOFFSTUMP: {
    label: "outside-off",
    getLine() {
      let range = wideLineOffset - Stump.xOffset;
      return Math.random() * range + Stump.xOffset;
    },
  },
});

let windowLength = 1.8; //meters
let zPerfectLengthStart = battingPopping; //back

export const Timing = Object.freeze({
  EARLY: {
    label: "early",
    checkBounds: (z, tollerence = 1) => {
      let zPerfectLengthEnd = zPerfectLengthStart - windowLength * tollerence;
      z <= zPerfectLengthEnd && z >= zPerfectLengthEnd;
    },
  },

  PERFECT: {
    label: "perfect",
    checkBounds: (z, tollerence = 1) => {
      let zEarlyLengthStart =
        zPerfectLengthStart -
        windowLength * tollerence -
        windowLength * tollerence;
      let zEarlyLengthEnd = zEarlyLengthStart - windowLength * tollerence;
      return z <= zEarlyLengthStart && z >= zEarlyLengthEnd;
    },
  },

  NONE: {
    label: "none",
    checkBounds: (z, tollerence = 1) => false,
  },
});

// This picks a random key from your enums (e.g., 'YORKER', 'GOOD', etc.)
export const getRandomKey = (obj) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
};
