import "./styles/main.css";
import { detectAppleDevice } from "./core/detectAppleDevice.js";
import { renderApp } from "./ui/renderApp.js";

const app = document.querySelector("#app");
const uiState = {
  signalsOpen: false,
};
let lastWidth = window.innerWidth;

function render() {
  renderApp(app, detectAppleDevice(), uiState);
}

app.addEventListener(
  "toggle",
  (event) => {
    if (event.target.id === "signals") {
      uiState.signalsOpen = event.target.open;
    }
  },
  true,
);

render();
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  if (width !== lastWidth) {
    lastWidth = width;
    render();
  }
});
