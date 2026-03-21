import { collectSignals } from "./collectSignals.js";
import { detectFamily, iosVersionFromUA } from "./detectFamily.js";
import { matchIphoneModel } from "./matchIphone.js";

export function detectAppleDevice() {
  const signals = collectSignals();
  const familyInfo = detectFamily(signals);

  return {
    isApple: familyInfo.isApple,
    family: familyInfo.family,
    formFactor: familyInfo.formFactor,
    iosVersion: iosVersionFromUA(signals.ua),
    iphone: familyInfo.family === "iphone" ? matchIphoneModel(signals) : null,
    signals,
  };
}
