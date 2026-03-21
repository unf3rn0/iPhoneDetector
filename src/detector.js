import { IPHONE_SIGNATURES } from "./iphoneSignatures.js";

function round2(value) {
  return Math.round(value * 100) / 100;
}

function parseCssPixels(value) {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function readSafeAreaInsets() {
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.paddingTop = "env(safe-area-inset-top)";
  probe.style.paddingBottom = "env(safe-area-inset-bottom)";
  probe.style.paddingLeft = "env(safe-area-inset-left)";
  probe.style.paddingRight = "env(safe-area-inset-right)";
  document.body.appendChild(probe);

  const styles = getComputedStyle(probe);
  const insets = {
    top: round2(parseCssPixels(styles.paddingTop)),
    right: round2(parseCssPixels(styles.paddingRight)),
    bottom: round2(parseCssPixels(styles.paddingBottom)),
    left: round2(parseCssPixels(styles.paddingLeft)),
  };

  probe.remove();
  return insets;
}

function collectSignals() {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const vendor = navigator.vendor || "";
  const dpr = round2(window.devicePixelRatio || 1);
  const screenWidth = Number(window.screen?.width || 0);
  const screenHeight = Number(window.screen?.height || 0);
  const viewportWidth = round2(window.innerWidth || 0);
  const viewportHeight = round2(window.innerHeight || 0);
  const visualViewportWidth = round2(window.visualViewport?.width || viewportWidth);
  const visualViewportHeight = round2(window.visualViewport?.height || viewportHeight);
  const screenShort = Math.min(screenWidth, screenHeight);
  const screenLong = Math.max(screenWidth, screenHeight);
  const nativeShort = Math.round(screenShort * dpr);
  const nativeLong = Math.round(screenLong * dpr);

  return {
    ua,
    platform,
    vendor,
    dpr,
    maxTouchPoints: Number(navigator.maxTouchPoints || 0),
    pointerCoarse: matchMedia("(pointer: coarse)").matches,
    pointerFine: matchMedia("(pointer: fine)").matches,
    hover: matchMedia("(hover: hover)").matches,
    screenWidth,
    screenHeight,
    screenShort,
    screenLong,
    nativeShort,
    nativeLong,
    viewportWidth,
    viewportHeight,
    visualViewportWidth,
    visualViewportHeight,
    safeAreaInsets: readSafeAreaInsets(),
  };
}

function detectFamily(signals) {
  const isIphoneUA = /iPhone/i.test(signals.ua);
  const isIpadUA = /iPad/i.test(signals.ua);
  const isMacUA = /Macintosh|Mac OS X/i.test(signals.ua) || /Mac/i.test(signals.platform);
  const isAppleVendor = /Apple/i.test(signals.vendor) || isIphoneUA || isIpadUA || isMacUA;
  const isIpadDesktopMode = isMacUA && signals.maxTouchPoints > 1;

  if (!isAppleVendor) {
    return { isApple: false, family: "unknown", formFactor: "unknown" };
  }

  if (isIphoneUA) {
    return { isApple: true, family: "iphone", formFactor: "mobile" };
  }

  if (isIpadUA || isIpadDesktopMode) {
    return { isApple: true, family: "ipad", formFactor: "tablet" };
  }

  if (isMacUA && signals.maxTouchPoints === 0) {
    return { isApple: true, family: "mac", formFactor: "desktop" };
  }

  return { isApple: true, family: "unknown", formFactor: "unknown" };
}

function iosVersionFromUA(ua) {
  const match = ua.match(/OS (\d+)[._]?(\d+)?/i);
  if (!match) return null;
  const major = match[1];
  const minor = match[2] || "0";
  return `${major}.${minor}`;
}

function matchIphoneSignature(signals) {
  const best = IPHONE_SIGNATURES.find((item) => {
    const shortMatch = Math.abs(signals.screenShort - item.css.short) <= 1;
    const longMatch = Math.abs(signals.screenLong - item.css.long) <= 1;
    const dprMatch = Math.abs(signals.dpr - item.dpr) <= 0.1;
    return shortMatch && longMatch && dprMatch;
  });

  if (!best) {
    return {
      exactModel: null,
      candidates: [],
      confidence: 0.2,
      ambiguityReason: "Не удалось сопоставить сигнатуру экрана с известной базой iPhone.",
    };
  }

  if (best.candidates.length === 1) {
    return {
      exactModel: best.candidates[0],
      candidates: best.candidates,
      confidence: 0.95,
      ambiguityReason: null,
    };
  }

  return {
    exactModel: null,
    candidates: best.candidates,
    confidence: 0.65,
    ambiguityReason:
      "Эти модели iPhone используют одинаковую веб-сигнатуру (разрешение/viewport/DPR), точная модель в браузере неоднозначна.",
  };
}

export function detectAppleDevice() {
  const signals = collectSignals();
  const familyInfo = detectFamily(signals);
  const iosVersion = iosVersionFromUA(signals.ua);

  const result = {
    isApple: familyInfo.isApple,
    family: familyInfo.family,
    formFactor: familyInfo.formFactor,
    iosVersion,
    iphone: null,
    signals,
  };

  if (familyInfo.family === "iphone") {
    result.iphone = matchIphoneSignature(signals);
  }

  return result;
}
