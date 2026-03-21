function familyTitle(family) {
  if (family === "iphone") return "iPhone";
  if (family === "ipad") return "iPad";
  if (family === "mac") return "Mac";
  return "Не определено";
}

function confidenceTone(confidence) {
  if (confidence >= 0.85) return "high";
  if (confidence >= 0.6) return "mid";
  return "low";
}

function candidatesMarkup(candidates) {
  if (!candidates.length) {
    return "<p class='hint'>Совпадений по текущей базе нет.</p>";
  }

  return `<div class="chips">${candidates.map((model) => `<span class="chip">${model}</span>`).join("")}</div>`;
}

export function renderApp(target, detection, uiState = {}) {
  const iphone = detection.iphone;
  const confidence = iphone?.confidence ?? 0;
  const confidencePercent = Math.round(confidence * 100);

  target.innerHTML = `
    <main class="screen">
      <section class="shell">
        <header class="topbar">
          <p class="brand">Apple Device Detector</p>
          <a class="topbar-link" href="#signals">Signals</a>
        </header>

        <section class="hero">
          <p class="kicker">Device Intelligence</p>
          <h1>${familyTitle(detection.family)}</h1>
          <p class="subtitle">Определение семейства устройства и версии iPhone по веб-сигналам.</p>
        </section>

        <section class="panel">
          <div class="stat-grid">
            <div class="stat">
              <span>Семейство</span>
              <strong>${detection.family}</strong>
            </div>
            <div class="stat">
              <span>Форм-фактор</span>
              <strong>${detection.formFactor}</strong>
            </div>
            <div class="stat">
              <span>iOS из UA</span>
              <strong>${detection.iosVersion ?? "нет данных"}</strong>
            </div>
          </div>
        </section>

        <section class="result">
          ${
            detection.family === "iphone"
              ? `
            <div class="result-head">
              <p>Версия iPhone</p>
              <span class="badge ${confidenceTone(confidence)}">${confidencePercent}%</span>
            </div>
            <h2>${iphone?.exactModel ?? "Точная модель неоднозначна"}</h2>
            ${candidatesMarkup(iphone?.candidates ?? [])}
            ${iphone?.ambiguityReason ? `<p class="hint">${iphone.ambiguityReason}</p>` : ""}
          `
              : `
            <div class="result-head">
              <p>Версия iPhone</p>
              <span class="badge low">0%</span>
            </div>
            <h2>Нужен iPhone для точной детализации</h2>
            <p class="hint">Режим определения версии активируется только при детекции iPhone.</p>
          `
          }
        </section>

        <details class="debug" id="signals" ${uiState.signalsOpen ? "open" : ""}>
          <summary>Технические сигналы</summary>
          <pre>${JSON.stringify(detection.signals, null, 2)}</pre>
        </details>
      </section>
    </main>
  `;
}
