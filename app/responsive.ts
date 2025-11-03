// utils/responsive.ts
import { Platform, useWindowDimensions } from "react-native";

export const BREAKPOINT = 900;   // desktop
export const TABLET_BP  = 680;   // tablet-ish
export const PHONE_BP   = 420;   // small phones

export function useBP() {
  const { width } = useWindowDimensions();
  return {
    width,
    isPhone: width <= PHONE_BP,
    isTablet: width > PHONE_BP && width <= TABLET_BP,
    isDesktop: width > TABLET_BP,
    topPad: Platform.OS === "web" ? 64 : 0, // or your HEADER_H
  };
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(n, hi));
}

// responsive size: scales around 1200 then clamps
export function rsize(winW: number, pref: number, min: number, max: number, base = 1200) {
  return clamp(pref * (winW / base), min, max);
}
