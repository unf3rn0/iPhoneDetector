import "./style.css";
import { detectAppleDevice } from "./detector.js";

function titleByFamily(family) {
  if (family === "iphone") return "iPhone обнаружен";
  if (family === "ipad") return "iPad обнаружен";
  if (family === "mac") return "Mac обнаружен";
  return "Apple-устройство не определено";
}

function badgeClass(confidence) {
  if (confidence >= 0.85) return "good";
  if (confidence >= 0.6) return "mid";
  return "low";
}

function render() {
  const app = document.querySelector("#app");
  const detection = detectAppleDevice();
  const iphone = detection.iphone;
  const confidence = iphone?.confidence ?? 0;

  const candidatesHtml =
    iphone?.candidates?.length > 0
      ? `<ul class="candidates">${iphone.candidates.map((model) => `<li>${model}</li>`).join("")}</ul>`
      : "<p class='muted'>Нет совпадений по базе моделей.</p>";

  app.innerHTML = `
    <main class="container">
      <section class="card">
        <h1>Apple Device Detector</h1>
        <p class="subtitle">Определение семейства Apple-устройства и вероятной модели iPhone.</p>

        <div class="line"><span>Статус:</span><strong>${titleByFamily(detection.family)}</strong></div>
        <div class="line"><span>Семейство:</span><strong>${detection.family}</strong></div>
        <div class="line"><span>Форм-фактор:</span><strong>${detection.formFactor}</strong></div>
        <div class="line"><span>iOS (из UA):</span><strong>${detection.iosVersion ?? "не найдено"}</strong></div>

        ${
          detection.family === "iphone"
            ? `
            <hr />
            <h2>Версия iPhone</h2>
            <div class="line"><span>Точная модель:</span><strong>${iphone?.exactModel ?? "неоднозначно"}</strong></div>
            <div class="line">
              <span>Уверенность:</span>
              <strong class="pill ${badgeClass(confidence)}">${Math.round(confidence * 100)}%</strong>
            </div>
            <div class="line block"><span>Кандидаты:</span></div>
            ${candidatesHtml}
            ${
              iphone?.ambiguityReason
                ? `<p class="hint">${iphone.ambiguityReason}</p>`
                : "<p class='hint'>Сигнатура экрана совпала однозначно.</p>"
            }
          `
            : `
            <hr />
            <p class="hint">Главная логика версии iPhone включается только при детекции семейства <strong>iphone</strong>.</p>
          `
        }
      </section>

      <section class="card">
        <h2>Сырые сигналы</h2>
        <pre>${JSON.stringify(detection.signals, null, 2)}</pre>
      </section>
    </main>
  `;
}

render();
window.addEventListener("resize", render);
