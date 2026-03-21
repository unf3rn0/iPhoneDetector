export function detectFamily(signals) {
  const isIphoneUA = /iPhone/i.test(signals.ua);
  const isIpadUA = /iPad/i.test(signals.ua);
  const isMacUA = /Macintosh|Mac OS X/i.test(signals.ua) || /Mac/i.test(signals.platform);
  const isAppleVendor = /Apple/i.test(signals.vendor) || isIphoneUA || isIpadUA || isMacUA;

  if (!isAppleVendor) {
    return { isApple: false, family: "unknown", formFactor: "unknown" };
  }

  if (isIphoneUA) {
    return { isApple: true, family: "iphone", formFactor: "mobile" };
  }

  if (isIpadUA || (isMacUA && signals.maxTouchPoints > 1)) {
    return { isApple: true, family: "ipad", formFactor: "tablet" };
  }

  if (isMacUA && signals.maxTouchPoints === 0) {
    return { isApple: true, family: "mac", formFactor: "desktop" };
  }

  return { isApple: true, family: "unknown", formFactor: "unknown" };
}

export function iosVersionFromUA(ua) {
  const match = ua.match(/OS (\d+)[._]?(\d+)?/i);
  if (!match) return null;
  return `${match[1]}.${match[2] || "0"}`;
}
