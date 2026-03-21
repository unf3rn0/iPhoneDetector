export function round2(value) {
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

export function collectSignals() {
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
    nativeShort: Math.round(screenShort * dpr),
    nativeLong: Math.round(screenLong * dpr),
    viewportWidth,
    viewportHeight,
    visualViewportWidth,
    visualViewportHeight,
    safeAreaInsets: readSafeAreaInsets(),
  };
}