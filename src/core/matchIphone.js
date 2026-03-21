import { iphoneSignatures } from "../data/iphoneSignatures.js";

export function matchIphoneModel(signals) {
  const signature = iphoneSignatures.find((item) => {
    const shortMatch = Math.abs(signals.screenShort - item.css.short) <= 1;
    const longMatch = Math.abs(signals.screenLong - item.css.long) <= 1;
    const dprMatch = Math.abs(signals.dpr - item.dpr) <= 0.1;
    return shortMatch && longMatch && dprMatch;
  });

  if (!signature) {
    return {
      exactModel: null,
      candidates: [],
      confidence: 0.2,
      ambiguityReason: "Не удалось сопоставить сигнатуру экрана с базой iPhone.",
    };
  }

  if (signature.candidates.length === 1) {
    return {
      exactModel: signature.candidates[0],
      candidates: signature.candidates,
      confidence: 0.95,
      ambiguityReason: null,
    };
  }

  return {
    exactModel: null,
    candidates: signature.candidates,
    confidence: 0.65,
    ambiguityReason: "У нескольких моделей одинаковая веб-сигнатура экрана и DPR.",
  };
}