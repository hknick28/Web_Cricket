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

let windowLength = 1.8; // meters — overall contact window
let perfectWindow = 0.5; // meters — the tight sweet-spot band inside it
let zPerfectLengthEnd = battingPopping;

export const Timing = Object.freeze({
  PERFECT: {
    label: "perfect",
    checkBounds: (z, tollerence = 1) => {
      const perfectStart = zPerfectLengthEnd - perfectWindow * tollerence;
      return z <= zPerfectLengthEnd && z >= perfectStart;
    },
    timingMultiplier: 1.0,
    launchAngle: 45, // degrees
  },

  EARLY: {
    label: "early",
    checkBounds: (z, tollerence = 1) => {
      const perfectStart = zPerfectLengthEnd - perfectWindow * tollerence;
      const earlyStart = zPerfectLengthEnd - windowLength * tollerence;
      // only matches OUTSIDE the perfect band, but still inside the full window
      return z < perfectStart && z >= earlyStart;
    },
    timingMultiplier: 0.8,
    launchAngle: 32, // degrees
  },

  NONE: {
    label: "none",
    checkBounds: (z, tollerence = 1) => false,
    timingMultiplier: 0.0,
    launchAngle: 0,
  },
});

// This picks a random key from your enums (e.g., 'YORKER', 'GOOD', etc.)
export const getRandomKey = (obj) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
};
