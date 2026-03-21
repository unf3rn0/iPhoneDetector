import "./styles/main.css";
import { detectAppleDevice } from "./core/detectAppleDevice.js";
import { renderApp } from "./ui/renderApp.js";

const app = document.querySelector("#app");

function render() {
  renderApp(app, detectAppleDevice());
}

render();
window.addEventListener("resize", render);
